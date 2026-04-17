import express from 'express';
import { query } from '../db/pool.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM reminders WHERE user_id = $1 ORDER BY date ASC, time ASC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({ error: 'Failed to get reminders' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { inquiryId, date, time, note } = req.body;
    
    const result = await query(
      'INSERT INTO reminders (user_id, inquiry_id, date, time, note) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, inquiryId, date, time, note]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create reminder error:', error);
    res.status(500).json({ error: 'Failed to create reminder' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, note, completed } = req.body;
    
    const result = await query(
      'UPDATE reminders SET date = $1, time = $2, note = $3, completed = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
      [date, time, note, completed, id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update reminder error:', error);
    res.status(500).json({ error: 'Failed to update reminder' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM reminders WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Delete reminder error:', error);
    res.status(500).json({ error: 'Failed to delete reminder' });
  }
});

export default router;
