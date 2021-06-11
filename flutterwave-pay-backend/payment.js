const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

const {PAYMENT_URL, SECRET_KEY, BASE_URL} = process.env;

const payment = async (customer, amount = '1500', tx_ref = Date.now()) => {
  const body = {
    amount,
    customer,
    currency: 'RWF',
    tx_ref,
    payment_options: 'card',
    redirect_url: `${BASE_URL}payment/success`,
  };
  const res = await fetch(PAYMENT_URL, {
    method: 'post',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${SECRET_KEY}`,
    },
  });

  const data = await res.json();
  return data;
};

module.exports = payment;
