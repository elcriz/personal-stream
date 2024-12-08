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
  const { userId, ...subscription } = req.body;
  try {
    const subscriptionToAdd = await Subscriber.create(new Subscriber({ subscription }));
    res.status(201).json(subscriptionToAdd);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/send', (req, res) => {
  const { title, message } = req.body;
  const payload = JSON.stringify({
    title,
    body: message,
  });

  subscriptions.forEach((subscription) => {
    webPush.sendNotification(subscription, payload).catch((error) => {
      console.log('Error whilst attempting to send a push notification');
      console.error(error.stack, { subscription });
    });
  });

  res.status(201).json({});
});

module.exports = router;
