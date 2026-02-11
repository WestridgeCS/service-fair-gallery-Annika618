import express from 'express';
import { GoodNews } from '../models/GoodNews.js';

export const router = express.Router();

/*
  GET /
  - Most recent entry
  - Table of all entries
  - Create form
*/
router.get('/', async (req, res, next) => {
  try {
    const entries = await GoodNews.find().sort({ createdAt: -1 });
    const mostRecent = entries[0] || null;

    res.render('index', {
      title: 'Good News Machine',
      entries,
      mostRecent
    });
  } catch (err) {
    next(err);
  }
});

// CREATE
router.post('/goodnews', async (req, res, next) => {
  try {
    const message = (req.body.message || '').trim();
    if (!message) return res.redirect('/');

    await GoodNews.create({ message });
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

// VOTE (up or down)
router.post('/goodnews/:id/vote', async (req, res, next) => {
  try {
    const dir = req.body.dir; // "up" or "down"
    const inc = dir === 'down' ? -1 : 1;

    await GoodNews.findByIdAndUpdate(
      req.params.id,
      { $inc: { votes: inc } },
      { runValidators: true }
    );

    res.redirect('/');
  } catch (err) {
    next(err);
  }
});
