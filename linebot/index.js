require('dotenv').config();

const express = require('express');
const line = require('@line/bot-sdk');

console.log("ACCESS TOKEN:", process.env.CHANNEL_ACCESS_TOKEN);
console.log("SECRET:", process.env.CHANNEL_SECRET);

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const app = express();
const client = new line.Client(config);

app.get('/', (req, res) => {
  res.send('LINE BOT is running!');
});

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
});

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: `「${event.message.text}」ですね！`,
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
