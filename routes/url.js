const express = require('express');
const shortid = require('shortid');
const Url = require('../models/Url');
const router = express.Router();

// Create Short URL
router.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ message: 'Original URL is required.' });
  }

  try {
    const shortUrl = shortid.generate();
    const newUrl = new Url({ originalUrl, shortUrl });

    await newUrl.save();
    res.status(201).json(newUrl);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

// Get All URLs
router.get('/urllist', async (req, res) => {
  try {
    const urls = await Url.find({});
    res.status(200).json({ urls });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

// Get URL statistics
router.get('/stats', async (req, res) => {
  try {
    const daily = await Url.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
    const monthly = await Url.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
    // console.log(daily)
    // console.log(monthly)

    res.status(200).json({ daily, monthly });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch URL statistics.' });
  }
});

// Redirect Short URL
router.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const urlDoc = await Url.findOne({ shortUrl });

    if (!urlDoc) {
      // console.error(`URL not found for short URL: ${shortUrl}`);
      return res.status(404).json({ message: 'URL not found.' });
    }

    // Increment the click count
    urlDoc.clickCount += 1;
    await urlDoc.save();
    // console.log(`Click count incremented for short URL: ${shortUrl}`);

    // Redirect to the original URL
    return res.redirect(urlDoc.originalUrl);
  } catch (err) {
    console.error(`Error processing short URL: ${shortUrl}`, err);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
});




module.exports = router;