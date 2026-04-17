# Borker - Broker Management System

A serverless broker management system for property dealers built with Vercel and Neon PostgreSQL.

## Setup

### 1. Create Neon Database

1. Go to [Neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy your connection string (format: `postgresql://user:password@host/database?sslmode=require`)

### 2. Create Database Schema

Run this SQL in Neon SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
);

CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  price DECIMAL(15, 2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id INTEGER,
  images TEXT[],
  video_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS landlords (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  contact VARCHAR(50) NOT NULL,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reminders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  inquiry_id INTEGER REFERENCES inquiries(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  note TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  inquiry_id INTEGER REFERENCES inquiries(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variable:
   - **DATABASE_URL**: Your Neon connection string
4. Deploy!

## Features

- **Authentication**: Sign up / Login
- **Dashboard**: Overview with stats, reminders, activity
- **Inquiry Management**: Track buyer/seller inquiries
- **Property Management**: Add properties with images
- **Landlord Management**: Manage property owners
- **Reminders**: Set follow-up reminders
- **Comments**: Add notes to inquiries
- **Responsive**: Works on desktop and mobile

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Backend**: Vercel Serverless Functions
- **Database**: Neon PostgreSQL (Serverless)
