import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDatabase } from './db/init.js';
import authRoutes from './routes/auth.js';
import inquiriesRoutes from './routes/inquiries.js';
import propertiesRoutes from './routes/properties.js';
import landlordsRoutes from './routes/landlords.js';
import remindersRoutes from './routes/reminders.js';
import commentsRoutes from './routes/comments.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/inquiries', inquiriesRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/landlords', landlordsRoutes);
app.use('/api/reminders', remindersRoutes);
app.use('/api/comments', commentsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

async function start() {
  try {
    await initDatabase();
    console.log('Database initialized');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
