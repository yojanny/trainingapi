const app = require('express');
var router = app.Router();
const createAccount = require('../controllers/account/create-account-controller');

router.get('/user', function (req, res, next) {
    res.send('USER');
  });

router.post('/accounts', createAccount);

  module.exports = router;