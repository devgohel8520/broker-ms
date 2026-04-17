import { query } from './pool.js';

export async function initDatabase() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      contact VARCHAR(50) NOT NULL,
      property_type VARCHAR(50) NOT NULL,
      budget DECIMAL(15, 2) NOT NULL,
      location VARCHAR(255) NOT NULL,
      inquiry_type VARCHAR(10) NOT NULL,
      status VARCHAR(20) DEFAULT 'new',
      notes TEXT,
      linked_property_id INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS properties (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      price DECIMAL(15, 2) NOT NULL,
      location VARCHAR(255) NOT NULL,
      description TEXT,
      owner_id INTEGER REFERENCES landlords(id) ON DELETE SET NULL,
      images TEXT[],
      video_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS landlords (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      contact VARCHAR(50) NOT NULL,
      address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS reminders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      inquiry_id INTEGER REFERENCES inquiries(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      time TIME NOT NULL,
      note TEXT,
      completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      inquiry_id INTEGER REFERENCES inquiries(id) ON DELETE CASCADE,
      text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`CREATE INDEX IF NOT EXISTS idx_inquiries_user_id ON inquiries(user_id)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_landlords_user_id ON landlords(user_id)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_comments_inquiry_id ON comments(inquiry_id)`);

  console.log('All tables created successfully');
}
