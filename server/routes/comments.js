import express from 'express';
import { query } from '../db/pool.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const { inquiryId } = req.query;
    let sql = 'SELECT * FROM comments WHERE user_id = $1';
    const params = [req.user.id];
    
    if (inquiryId) {
      sql += ' AND inquiry_id = $2';
      params.push(inquiryId);
    }
    
    sql += ' ORDER BY created_at DESC';
    
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Failed to get comments' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { inquiryId, text } = req.body;
    
    const result = await query(
      'INSERT INTO comments (user_id, inquiry_id, text) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, inquiryId, text]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

export default router;
