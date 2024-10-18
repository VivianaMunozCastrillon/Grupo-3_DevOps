const express = require('express');
const router = express.Router();
const Home = require('../Controllers/ControllersHome')

router.get('/Home', Home);

module.exports = router;