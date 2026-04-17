import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-User-Id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req;
  const userId = req.headers['x-user-id'];

  try {
    if (url.startsWith('/auth/signup') && req.method === 'POST') {
      const { name, email, password } = req.body;
      const hashedPassword = Buffer.from(password).toString('base64');
      await sql`INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${hashedPassword})`;
      const user = await sql`SELECT id, name, email FROM users WHERE email = ${email}`;
      return res.status(201).json({ success: true, user: user[0] });
    }

    if (url.startsWith('/auth/login') && req.method === 'POST') {
      const { email, password } = req.body;
      const hashedPassword = Buffer.from(password).toString('base64');
      const users = await sql`SELECT * FROM users WHERE email = ${email}`;
      if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
      const user = users[0];
      if (user.password !== hashedPassword) return res.status(401).json({ error: 'Invalid credentials' });
      return res.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
    }

    if (!userId) return res.status(401).json({ error: 'Authentication required' });

    if (url === '/inquiries' && req.method === 'GET') {
      const inquiries = await sql`SELECT * FROM inquiries WHERE user_id = ${userId} ORDER BY created_at DESC`;
      return res.json(inquiries);
    }

    if (url.match(/^\/inquiries\/\d+$/) && req.method === 'GET') {
      const id = url.split('/')[2];
      const inquiry = await sql`SELECT * FROM inquiries WHERE id = ${id} AND user_id = ${userId}`;
      if (inquiry.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.json(inquiry[0]);
    }

    if (url === '/inquiries' && req.method === 'POST') {
      const { name, contact, propertyType, budget, location, inquiryType, status, notes } = req.body;
      const result = await sql`
        INSERT INTO inquiries (user_id, name, contact, property_type, budget, location, inquiry_type, status, notes)
        VALUES (${userId}, ${name}, ${contact}, ${propertyType}, ${budget}, ${location}, ${inquiryType}, ${status || 'new'}, ${notes})
        RETURNING *
      `;
      return res.status(201).json(result[0]);
    }

    if (url.match(/^\/inquiries\/\d+$/) && req.method === 'PUT') {
      const id = url.split('/')[2];
      const { name, contact, propertyType, budget, location, inquiryType, status, notes, linkedPropertyId } = req.body;
      const result = await sql`
        UPDATE inquiries SET name = ${name}, contact = ${contact}, property_type = ${propertyType}, 
        budget = ${budget}, location = ${location}, inquiry_type = ${inquiryType}, status = ${status}, 
        notes = ${notes}, linked_property_id = ${linkedPropertyId}, updated_at = NOW()
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING *
      `;
      if (result.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.json(result[0]);
    }

    if (url.match(/^\/inquiries\/\d+$/) && req.method === 'DELETE') {
      const id = url.split('/')[2];
      await sql`DELETE FROM inquiries WHERE id = ${id} AND user_id = ${userId}`;
      return res.json({ success: true });
    }

    if (url === '/properties' && req.method === 'GET') {
      const properties = await sql`SELECT * FROM properties WHERE user_id = ${userId} ORDER BY created_at DESC`;
      return res.json(properties);
    }

    if (url.match(/^\/properties\/\d+$/) && req.method === 'GET') {
      const id = url.split('/')[2];
      const property = await sql`SELECT * FROM properties WHERE id = ${id} AND user_id = ${userId}`;
      if (property.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.json(property[0]);
    }

    if (url === '/properties' && req.method === 'POST') {
      const { title, type, price, location, description, ownerId, images, videoUrl } = req.body;
      const result = await sql`
        INSERT INTO properties (user_id, title, type, price, location, description, owner_id, images, video_url)
        VALUES (${userId}, ${title}, ${type}, ${price}, ${location}, ${description}, ${ownerId}, ${images}, ${videoUrl})
        RETURNING *
      `;
      return res.status(201).json(result[0]);
    }

    if (url.match(/^\/properties\/\d+$/) && req.method === 'PUT') {
      const id = url.split('/')[2];
      const { title, type, price, location, description, ownerId, images, videoUrl } = req.body;
      const result = await sql`
        UPDATE properties SET title = ${title}, type = ${type}, price = ${price}, location = ${location},
        description = ${description}, owner_id = ${ownerId}, images = ${images}, video_url = ${videoUrl}, updated_at = NOW()
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING *
      `;
      if (result.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.json(result[0]);
    }

    if (url.match(/^\/properties\/\d+$/) && req.method === 'DELETE') {
      const id = url.split('/')[2];
      await sql`DELETE FROM properties WHERE id = ${id} AND user_id = ${userId}`;
      return res.json({ success: true });
    }

    if (url === '/landlords' && req.method === 'GET') {
      const landlords = await sql`SELECT * FROM landlords WHERE user_id = ${userId} ORDER BY created_at DESC`;
      return res.json(landlords);
    }

    if (url.match(/^\/landlords\/\d+$/) && req.method === 'GET') {
      const id = url.split('/')[2];
      const landlord = await sql`SELECT * FROM landlords WHERE id = ${id} AND user_id = ${userId}`;
      if (landlord.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.json(landlord[0]);
    }

    if (url === '/landlords' && req.method === 'POST') {
      const { name, contact, address } = req.body;
      const result = await sql`INSERT INTO landlords (user_id, name, contact, address) VALUES (${userId}, ${name}, ${contact}, ${address}) RETURNING *`;
      return res.status(201).json(result[0]);
    }

    if (url.match(/^\/landlords\/\d+$/) && req.method === 'PUT') {
      const id = url.split('/')[2];
      const { name, contact, address } = req.body;
      const result = await sql`UPDATE landlords SET name = ${name}, contact = ${contact}, address = ${address} WHERE id = ${id} AND user_id = ${userId} RETURNING *`;
      if (result.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.json(result[0]);
    }

    if (url.match(/^\/landlords\/\d+$/) && req.method === 'DELETE') {
      const id = url.split('/')[2];
      await sql`DELETE FROM landlords WHERE id = ${id} AND user_id = ${userId}`;
      return res.json({ success: true });
    }

    if (url === '/reminders' && req.method === 'GET') {
      const reminders = await sql`SELECT * FROM reminders WHERE user_id = ${userId} ORDER BY date ASC, time ASC`;
      return res.json(reminders);
    }

    if (url === '/reminders' && req.method === 'POST') {
      const { inquiryId, date, time, note } = req.body;
      const result = await sql`INSERT INTO reminders (user_id, inquiry_id, date, time, note) VALUES (${userId}, ${inquiryId}, ${date}, ${time}, ${note}) RETURNING *`;
      return res.status(201).json(result[0]);
    }

    if (url.match(/^\/reminders\/\d+$/) && req.method === 'PUT') {
      const id = url.split('/')[2];
      const { date, time, note, completed } = req.body;
      const result = await sql`UPDATE reminders SET date = ${date}, time = ${time}, note = ${note}, completed = ${completed} WHERE id = ${id} AND user_id = ${userId} RETURNING *`;
      if (result.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.json(result[0]);
    }

    if (url.match(/^\/reminders\/\d+$/) && req.method === 'DELETE') {
      const id = url.split('/')[2];
      await sql`DELETE FROM reminders WHERE id = ${id} AND user_id = ${userId}`;
      return res.json({ success: true });
    }

    if (url.startsWith('/comments') && req.method === 'GET') {
      const inquiryId = req.query?.inquiryId;
      let comments;
      if (inquiryId) {
        comments = await sql`SELECT * FROM comments WHERE user_id = ${userId} AND inquiry_id = ${inquiryId} ORDER BY created_at DESC`;
      } else {
        comments = await sql`SELECT * FROM comments WHERE user_id = ${userId} ORDER BY created_at DESC`;
      }
      return res.json(comments);
    }

    if (url === '/comments' && req.method === 'POST') {
      const { inquiryId, text } = req.body;
      const result = await sql`INSERT INTO comments (user_id, inquiry_id, text) VALUES (${userId}, ${inquiryId}, ${text}) RETURNING *`;
      return res.status(201).json(result[0]);
    }

    if (url.match(/^\/comments\/\d+$/) && req.method === 'DELETE') {
      const id = url.split('/')[2];
      await sql`DELETE FROM comments WHERE id = ${id} AND user_id = ${userId}`;
      return res.json({ success: true });
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
