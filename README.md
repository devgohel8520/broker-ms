# Borker - Broker Management System

A modern broker management system for property dealers to manage inquiries, properties, landlords, and follow-ups.

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Neon Serverless)
- **Styling**: Custom CSS with blue & white theme

## Setup Instructions

### 1. Database Setup (Neon)

1. Create a free account at [Neon.tech](https://neon.tech)
2. Create a new project
3. Copy your connection string (it looks like: `postgresql://user:password@host/database?sslmode=require`)

### 2. Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env and add your DATABASE_URL
npm install
npm start
```

The server will run on port 3001.

### 3. Frontend Setup

Option A - Using Vite (recommended):
```bash
npm install
npm run dev
```

Option B - Using Python:
```bash
python3 -m http.server 8080
```

### 4. Configure API URL

If using a different port, create a `.env` file:
```
VITE_API_URL=http://localhost:3001
```

## Environment Variables

### Server (.env)
```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
PORT=3001
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001
```

## Features

- **Authentication**: Sign up / Login with secure password hashing
- **Dashboard**: Overview with stats, reminders, and activity feed
- **Inquiry Management**: Track buyer/seller inquiries with status workflow
- **Property Management**: Add properties with images and video links
- **Landlord Management**: Manage property owners
- **Reminders**: Set follow-up reminders for inquiries
- **Comments**: Add notes and remarks to inquiries
- **Responsive**: Works on desktop and mobile

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

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
