const { neon, neonConfig } = require('@neondatabase/serverless');

neonConfig.fetchOptions = {
  retries: 2,
};

module.exports = async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-User-Id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url?.split('?')[0] || '';
  const userId = req.headers['x-user-id'];

  try {
    // Auth - Signup
    if (url === '/api/auth/signup' && req.method === 'POST') {
      const { name, email, password } = req.body;
      const hashedPassword = Buffer.from(password).toString('base64');
      const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      const result = await sql`
        INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${hashedPassword})
        RETURNING id, name, email
      `;
      return res.status(201).json({ success: true, user: result[0] });
    }

    // Auth - Login
    if (url === '/api/auth/login' && req.method === 'POST') {
      const { email, password } = req.body;
      const hashedPassword = Buffer.from(password).toString('base64');
      const users = await sql`SELECT * FROM users WHERE email = ${email}`;
      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const user = users[0];
      if (user.password !== hashedPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      return res.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
    }

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Inquiries - List
    if (url === '/api/inquiries' && req.method === 'GET') {
      const data = await sql`SELECT * FROM inquiries WHERE user_id = ${userId} ORDER BY created_at DESC`;
      return res.json(data);
    }

    // Inquiries - Get One
    if (url.match(/^\/api\/inquiries\/\d+$/) && req.method === 'GET') {
      const id = url.split('/')[3];
      const data = await sql`SELECT * FROM inquiries WHERE id = ${id} AND user_id = ${userId}`;
      if (data.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.json(data[0]);
    }

    // Inquiries - Create
    if (url === '/api/inquiries' && req.method === 'POST') {
      const { name, contact, propertyType, budget, location, inquiryType, status, notes, linkedPropertyId } = req.body;
      const data = await sql`
        INSERT INTO inquiries (user_id, name, contact, property_type, budget, location, inquiry_type, status, notes, linked_property_id)
        VALUES (${userId}, ${name}, ${contact}, ${propertyType}, ${budget}, ${location}, ${inquiryType}, ${status || 'new'}, ${notes || null}, ${linkedPropertyId || null})
        RETURNING *
      `;
      return res.status(201).json(data[0]);
    }

    // Inquiries - Update
    if (url.match(/^\/api\/inquiries\/\d+$/) && req.method === 'PUT') {
      const id = url.split('/')[3];
      const { name, contact, propertyType, budget, location, inquiryType, status, notes, linkedPropertyId } = req.body;
      const data = await sql`
        UPDATE inquiries SET name = ${name}, contact = ${contact}, property_type = ${propertyType}, 
        budget = ${budget}, location = ${location}, inquiry_type = ${inquiryType}, status = ${status}, 
        notes = ${notes || null}, linked_property_id = ${linkedPropertyId || null}, updated_at = NOW()
        WHERE id = ${id} AND user_id = ${userId} RETURNING *
      `;
      if (data.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.json(data[0]);
    }

    // Inquiries - Delete
    if (url.match(/^\/api\/inquiries\/\d+$/) && req.method === 'DELETE') {
      const id = url.split('/')[3];
      await sql`DELETE FROM inquiries WHERE id = ${id} AND user_id = ${userId}`;
      return res.json({ success: true });
    }

    // Properties - List
    if (url === '/api/properties' && req.method === 'GET') {
      const data = await sql`SELECT * FROM properties WHERE user_id = ${userId} ORDER BY created_at DESC`;
      return res.json(data);
    }

    // Properties - Get One
    if (url.match(/^\/api\/properties\/\d+$/) && req.method === 'GET') {
      const id = url.split('/')[3];
      const data = await sql`SELECT * FROM properties WHERE id = ${id} AND user_id = ${userId}`;
      if (data.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.json(data[0]);
    }

    // Properties - Create
    if (url === '/api/properties' && req.method === 'POST') {
      const { title, type, price, location, description, ownerId, images, videoUrl } = req.body;
      const data = await sql`
        INSERT INTO properties (user_id, title, type, price, location, description, owner_id, images, video_url)
        VALUES (${userId}, ${title}, ${type}, ${price}, ${location}, ${description || null}, ${ownerId || null}, ${images || null}, ${videoUrl || null})
        RETURNING *
      `;
      return res.status(201).json(data[0]);
    }

    // Properties - Update
    if (url.match(/^\/api\/properties\/\d+$/) && req.method === 'PUT') {
      const id = url.split('/')[3];
      const { title, type, price, location, description, ownerId, images, videoUrl } = req.body;
      const data = await sql`
        UPDATE properties SET title = ${title}, type = ${type}, price = ${price}, location = ${location},
        description = ${description || null}, owner_id = ${ownerId || null}, images = ${images || null}, 
        video_url = ${videoUrl || null}, updated_at = NOW()
        WHERE id = ${id} AND user_id = ${userId} RETURNING *
      `;
      if (data.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.json(data[0]);
    }

    // Properties - Delete
    if (url.match(/^\/api\/properties\/\d+$/) && req.method === 'DELETE') {
      const id = url.split('/')[3];
      await sql`DELETE FROM properties WHERE id = ${id} AND user_id = ${userId}`;
      return res.json({ success: true });
    }

    // Landlords - List
    if (url === '/api/landlords' && req.method === 'GET') {
      const data = await sql`SELECT * FROM landlords WHERE user_id = ${userId} ORDER BY created_at DESC`;
      return res.json(data);
    }

    // Landlords - Get One
    if (url.match(/^\/api\/landlords\/\d+$/) && req.method === 'GET') {
      const id = url.split('/')[3];
      const data = await sql`SELECT * FROM landlords WHERE id = ${id} AND user_id = ${userId}`;
      if (data.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.json(data[0]);
    }

    // Landlords - Create
    if (url === '/api/landlords' && req.method === 'POST') {
      const { name, contact, address } = req.body;
      const data = await sql`
        INSERT INTO landlords (user_id, name, contact, address) VALUES (${userId}, ${name}, ${contact}, ${address || null})
        RETURNING *
      `;
      return res.status(201).json(data[0]);
    }

    // Landlords - Update
    if (url.match(/^\/api\/landlords\/\d+$/) && req.method === 'PUT') {
      const id = url.split('/')[3];
      const { name, contact, address } = req.body;
      const data = await sql`
        UPDATE landlords SET name = ${name}, contact = ${contact}, address = ${address || null}
        WHERE id = ${id} AND user_id = ${userId} RETURNING *
      `;
      if (data.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.json(data[0]);
    }

    // Landlords - Delete
    if (url.match(/^\/api\/landlords\/\d+$/) && req.method === 'DELETE') {
      const id = url.split('/')[3];
      await sql`DELETE FROM landlords WHERE id = ${id} AND user_id = ${userId}`;
      return res.json({ success: true });
    }

    // Reminders - List
    if (url === '/api/reminders' && req.method === 'GET') {
      const data = await sql`SELECT * FROM reminders WHERE user_id = ${userId} ORDER BY date ASC, time ASC`;
      return res.json(data);
    }

    // Reminders - Create
    if (url === '/api/reminders' && req.method === 'POST') {
      const { inquiryId, date, time, note } = req.body;
      const data = await sql`
        INSERT INTO reminders (user_id, inquiry_id, date, time, note) VALUES (${userId}, ${inquiryId}, ${date}, ${time}, ${note || null})
        RETURNING *
      `;
      return res.status(201).json(data[0]);
    }

    // Reminders - Update
    if (url.match(/^\/api\/reminders\/\d+$/) && req.method === 'PUT') {
      const id = url.split('/')[3];
      const { date, time, note, completed } = req.body;
      const data = await sql`
        UPDATE reminders SET date = ${date}, time = ${time}, note = ${note || null}, completed = ${completed}
        WHERE id = ${id} AND user_id = ${userId} RETURNING *
      `;
      if (data.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.json(data[0]);
    }

    // Reminders - Delete
    if (url.match(/^\/api\/reminders\/\d+$/) && req.method === 'DELETE') {
      const id = url.split('/')[3];
      await sql`DELETE FROM reminders WHERE id = ${id} AND user_id = ${userId}`;
      return res.json({ success: true });
    }

    // Comments - List
    if (url.startsWith('/api/comments') && req.method === 'GET') {
      const inquiryId = req.query?.inquiryId;
      let data;
      if (inquiryId) {
        data = await sql`SELECT * FROM comments WHERE user_id = ${userId} AND inquiry_id = ${inquiryId} ORDER BY created_at DESC`;
      } else {
        data = await sql`SELECT * FROM comments WHERE user_id = ${userId} ORDER BY created_at DESC`;
      }
      return res.json(data);
    }

    // Comments - Create
    if (url === '/api/comments' && req.method === 'POST') {
      const { inquiryId, text } = req.body;
      const data = await sql`
        INSERT INTO comments (user_id, inquiry_id, text) VALUES (${userId}, ${inquiryId}, ${text})
        RETURNING *
      `;
      return res.status(201).json(data[0]);
    }

    // Comments - Delete
    if (url.match(/^\/api\/comments\/\d+$/) && req.method === 'DELETE') {
      const id = url.split('/')[3];
      await sql`DELETE FROM comments WHERE id = ${id} AND user_id = ${userId}`;
      return res.json({ success: true });
    }

    return res.status(404).json({ error: 'Not found', url });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
};
