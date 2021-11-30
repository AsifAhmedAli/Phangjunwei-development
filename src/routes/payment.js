const express = require('express');
const router = express.Router();
const { Buffer } = require("buffer");
const axios = require('axios');
const { v4 } = require('uuid');
const db = require('../../models');

const { Order, Cart, CartItem, OrderItem } = db;

router.get('/done', async (req, res) => {

  // if (!req.user) {
  //   return res.json({ error: 'You must be logged in to pay' });
  // }

  console.log("REquest data", req.body);
  console.log("REquest Query", req.query);
  console.log("REquest params", req.params);

  try {
    // // Create New Order
    // const createdOrder = await Order.create({ userId: user.id });

    // // Get User Cart
    // const userCart = await Cart.findOne({ where: { userId: user.id } });

    // if (!userCart) {
    //   throw new Error('No cart found');
    // }

    // // Get User Cart Items
    // const userCartItems = await CartItem.findAll({ where: { CartId: userCart.id } });

    // if (!userCartItems) {
    //   throw new Error('Cart is empty');
    // }

    // // loop through cart items and add order items
    // for (const item of userCartItems) {
    //   await OrderItem.create({
    //     OrderId: createdOrder.id,
    //     ProductId: item.ProductId,
    //     MerchantId: item.MerchantId,
    //     clientFirstName,
    //     clientLastName,
    //     clientEmail,
    //     clientContactInfo,
    //     refCode,
    //     deliveryOption,
    //     deliveryFee,
    //     subTotal,
    //     promoCode,
    //     promoCodeValue,
    //     deliveryAddress,
    //     billingAddress,
    //     paymentStatus,
    //     paymentInfo,
    //   });
    // }

    return res.json({
      message: 'Done Route Called',
    });

  } catch (error) {
    throw new Error(error.message);
  }
})

router.post('/create', async (req, res) => {

  /* 
    Authorization Header requires:
      <MID> 100000000000001 
      <PSK> E00F270DE323E2B187532D8E4B306EB2841AF0BFF08132BAB7F0E62BED6419BB

    Conversion into Base64 encoded string:
      Base64(" <MID>:<PSK> ")

    Authorization Header:
      Authorization: "Basic Base64EncodedString"
  
  */

  const MID = "122000000000198";
  // Create Base64 String
  const buf = Buffer.from(`${MID}:7BBDD68340CDAA66FAFD2D1F94421713EDE5C1C8DCD28AA51D7C95A2C4669C39`, 'utf8');
  const base64String = buf.toString('base64');

  const params = {
    mode: 'HOSTED',
    orderNo: v4(),
    subject: req.body.subject || "Testing my ecommerce payment",
    amount: req.body.amount || "1.00",
    currencyCode: "SGD",
    notifyUrl: "https://www.google.com",
    returnUrl: "http://localhost:4000/api/payment/done",
    backUrl: "https://www.yahoo.com",
  }

  const { data } = await axios.put('https://ipg.fomopay.net/api/orders',
    params,
    {
      headers: {
        'Authorization': `Basic ${base64String}`,
        'Content-Type': 'application/json',
      }
    })
  res.send(data);
  // res.send(data);
});

module.exports = router;