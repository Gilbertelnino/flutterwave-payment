const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const payment = require('./payment');
const path = require('path');
const request = require('request');

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.json({
    message: 'api working collectly',
  });
});

app.use('/hello', express.static('public'));
app.post('/payment/create', async (req, res) => {
  const {fullname, email, phonenumber} = req.body;
  const response = await payment({
    fullname,
    email,
    phonenumber,
  });
  return res.json({
    response,
  });
});

app.get('/payment/success', async (req, res) => {
  const transaction_id = req.query.transaction_id;
  var options = {
    method: 'GET',
    url: `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SECRET_KEY}`,
    },
  };
  request(options, (error, response) => {
    if (error) throw new Error(error);
    const result = JSON.parse(response.body);
    if (result.data !== null && result.data.status === 'successful') {
      return res.json({
        message: 'transaction successfully made enjoy it',
      });
    } else if (result.data === null) {
      return res.status(403).json({
        message: 'Unauthorized',
      });
    } else {
      return res.status(406).json({
        message: 'transaction failed try again',
      });
    }
  });
});

app.get('*', function (req, res) {
  res.sendFile(`${__dirname}/public/notfound.html`);
});
app.listen(PORT, () => console.log(`Payment App Is Listening On Port ${PORT}`));
