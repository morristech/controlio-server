const express = require('express');
const auth = require('../helpers/auth');
const validate = require('express-validation');
const validation = require('../validation/payments');
const payments = require('../helpers/payments');

const router = express.Router();

// Private API

router.use(auth.checkToken);

router.get('/customer', validate(validation.customer), (req, res, next) => {
  const customerid = req.query.customerid;
  payments.getStripeCustomer(customerid)
    .then((customer) => {
      console.log(customer);
      res.send(customer);
    })
    .catch(err => next(err));
});

router.post('/customer/sources', validate(validation.postSource), (req, res, next) => {
  const customerid = req.body.customerid;
  const source = req.body.source;
  payments.addStripeSource(customerid, source)
    .then(newSource => res.send(newSource))
    .catch(err => next(err));
});

router.post('/customer/default_source', validate(validation.defaultSource), (req, res, next) => {
  const customerid = req.body.customerid;
  const source = req.body.source;
  payments.setStripeDefaultSource(customerid, source)
    .then(customer => res.send(customer))
    .catch(err => next(err));
});

// Export

module.exports = router;