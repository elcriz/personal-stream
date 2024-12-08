const express = require('express');
const router = express.Router();
const webPush = require('web-push');

// Initialize push notifications
webPush.setVapidDetails(
  `mailto:${process.env.EMAIL}`,
  process.env.PUSH_PUBLIC_KEY,
  process.env.PUSH_PRIVATE_KEY,
);

router.post('/', (req, res) => {
  const subscription = req.body;

  res.status(201).json({});

  const payload = JSON.stringify({
    title: 'WHAM!',
    body: 'Je hebt je succesvol aangemeld voor notificaties van WHAM! HUNTER',
  });

  webPush.sendNotification(subscription, payload).catch(console.log);
});

module.exports = router;
