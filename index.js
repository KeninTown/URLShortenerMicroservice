require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const mongoose = require('mongoose');

const app = express();
// Basic Configuration
const port = process.env.PORT;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ greeting: 'hello API' });
});

//Номер shortUrl, который соответствует конкретному url
const shortUrls = {};
let shortUrlId = 1;

app.post('/api/shorturl', (req, res) => {
  let url = new URL(req.body.url);
  let host = url.hostname;
  dns.lookup(host, (err) => {
    if (err || host === '') {
      res.json({ error: 'Invalid URL' });
    }
    else {
      shortUrls[shortUrlId] = url;
      shortUrlId++;
      res.json({ original_url: url, short_url: shortUrlId - 1 });
    }
  })
});

app.get('/api/shorturl/:index', (req, res) => {
  let shortUrl = req.params.index;
  if (shortUrls.hasOwnProperty(shortUrl))
    res.redirect(shortUrls[shortUrl]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
