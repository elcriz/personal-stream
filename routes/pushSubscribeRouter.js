const express = require('express');
const router = express.Router();
const webPush = require('web-push');

// Initialize push notifications
webPush.setVapidDetails(
  `mailto:${process.env.EMAIL}`,
  process.env.PUSH_PUBLIC_KEY,
  process.env.PUSH_PRIVATE_KEY,
);

let subscriptions = [];

router.post('/subscribe', (req, res) => {
  const { userId, ...subscription } = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
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
