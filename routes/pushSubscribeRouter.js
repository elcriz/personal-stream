const express = require('express');
const router = express.Router();
const webPush = require('web-push');
const Subscriber = require('../models/whamhunter/subscriberModel');

// Initialize push notifications
webPush.setVapidDetails(
  `mailto:${process.env.EMAIL}`,
  process.env.PUSH_PUBLIC_KEY,
  process.env.PUSH_PRIVATE_KEY,
);

router.post('/subscribe', async (req, res) => {
  const { userId, subscription } = req.body;
  try {
    console.log('/subscribe received', { userId, subscription });
    const subscriptionToAdd = await Subscriber.create(new Subscriber({ userId, subscription }));
    res.status(201).json(subscriptionToAdd);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
