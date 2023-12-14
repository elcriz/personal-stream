const RSS = require('rss');
const Item = require('../models/itemModel');

module.exports = async (req, res) => {
  const items = await Item.find().sort('-createdAt').limit(5);

  const feed = new RSS({
    title: "Chris' Stream",
    description: 'Short updates on things keeping me afloat, for anyone who cares.',
    feed_url: `${process.env.API_URL}/feed.xml`,
    site_url: process.env.SITE_URL,
    language: 'en',
    pubDate: items[0].updatedAt,
  });

  items.forEach(({ _id, title, body: description, updatedAt: date }) => {
    feed.item({
      date,
      title,
      description,
      author: 'Christiaan Hemerik',
      url: `${process.env.SITE_URL}/${_id}`,
    });
  });

  res.set('Content-Type', 'text/xml');
  res.status(200).send(feed.xml());
};
