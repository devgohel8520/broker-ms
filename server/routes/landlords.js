import express from 'express';
import { query } from '../db/pool.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM landlords WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get landlords error:', error);
    res.status(500).json({ error: 'Failed to get landlords' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT * FROM landlords WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Landlord not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get landlord error:', error);
    res.status(500).json({ error: 'Failed to get landlord' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, contact, address } = req.body;
    
    const result = await query(
      'INSERT INTO landlords (user_id, name, contact, address) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, name, contact, address]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create landlord error:', error);
    res.status(500).json({ error: 'Failed to create landlord' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact, address } = req.body;
    
    const result = await query(
      'UPDATE landlords SET name = $1, contact = $2, address = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
      [name, contact, address, id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Landlord not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update landlord error:', error);
    res.status(500).json({ error: 'Failed to update landlord' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM landlords WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Landlord not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Delete landlord error:', error);
    res.status(500).json({ error: 'Failed to delete landlord' });
  }
});

export default router;
