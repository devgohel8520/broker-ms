# Borker - Broker Management System

A serverless broker management system for property dealers built with Vercel and Neon PostgreSQL.

## Features

- **Dashboard**: Overview with stats, reminders, activity
- **Inquiry Management**: Track buyer/seller inquiries with status workflow
- **Property Management**: Add properties with images and video links
- **Landlord Management**: Manage property owners
- **Location Management**: Manage locations linked to properties and inquiries
- **Reminders**: Set follow-up reminders for inquiries
- **Comments**: Add notes to inquiries
- **Responsive**: Works on desktop and mobile

## Setup

### 1. Create Neon Database

1. Go to [Neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy your connection string (format: `postgresql://user:password@host/database?sslmode=require`)

### 2. Create Database Schema

Run this SQL in Neon SQL Editor:

```sql
-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Locations Table
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  pincode VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inquiries Table
CREATE TABLE inquiries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  contact VARCHAR(50) NOT NULL,
  property_type VARCHAR(50) NOT NULL,
  budget DECIMAL(15, 2) NOT NULL,
  location VARCHAR(255),
  inquiry_type VARCHAR(10) NOT NULL,
  status VARCHAR(20) DEFAULT 'new',
  notes TEXT,
  linked_property_id INTEGER,
  location_id INTEGER REFERENCES locations(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties Table
CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  price DECIMAL(15, 2) NOT NULL,
  location VARCHAR(255),
  description TEXT,
  owner_id INTEGER,
  location_id INTEGER REFERENCES locations(id) ON DELETE SET NULL,
  images TEXT[],
  video_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Landlords Table
CREATE TABLE landlords (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  contact VARCHAR(50) NOT NULL,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reminders Table
CREATE TABLE reminders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  inquiry_id INTEGER REFERENCES inquiries(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  note TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments Table
CREATE TABLE comments (
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

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Backend**: Vercel Serverless Functions
- **Database**: Neon PostgreSQL (Serverless)

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Locations
- `GET /api/locations` - List all locations
- `GET /api/locations/stats` - List locations with property and inquiry counts
- `GET /api/locations/:id` - Get single location
- `POST /api/locations` - Create location
- `PUT /api/locations/:id` - Update location
- `DELETE /api/locations/:id` - Delete location

### Inquiries
- `GET /api/inquiries` - List all inquiries
- `GET /api/inquiries/:id` - Get single inquiry
- `POST /api/inquiries` - Create inquiry
- `PUT /api/inquiries/:id` - Update inquiry
- `DELETE /api/inquiries/:id` - Delete inquiry

### Properties
- `GET /api/properties` - List all properties
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Landlords
- `GET /api/landlords` - List all landlords
- `GET /api/landlords/:id` - Get single landlord
- `POST /api/landlords` - Create landlord
- `PUT /api/landlords/:id` - Update landlord
- `DELETE /api/landlords/:id` - Delete landlord

### Reminders
- `GET /api/reminders` - List all reminders
- `POST /api/reminders` - Create reminder
- `PUT /api/reminders/:id` - Update reminder
- `DELETE /api/reminders/:id` - Delete reminder

### Comments
- `GET /api/comments` - List comments (optional: ?inquiryId=1)
- `POST /api/comments` - Create comment
- `DELETE /api/comments/:id` - Delete comment
