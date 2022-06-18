require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mySecret = process.env['MONGO_URI'];
const AutoIncrement = require('mongoose-sequence')(mongoose);

mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true });

const UrlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: [true, 'Must provide a URL'],
  },
  short_url: {
    type: Number,
  },
});

UrlSchema.plugin(AutoIncrement, { id: 'order_seq', inc_field: 'short_url' });

const Url = mongoose.model('Url', UrlSchema)

// Basic Configuration
const port = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

// parse application/json
app.use(bodyParser.json());

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function (req, res) {
  let newUrl = new Url({
    original_url: req.body.url
  })
  newUrl.save((err, data) =>{
    if (err) return console.error(err);
    return res.json( {original_url: data["original_url"], short_url: data["short_url"]});
  })
  
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
