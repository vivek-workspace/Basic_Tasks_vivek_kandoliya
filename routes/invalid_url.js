/*
Program: invalid url router
Description: controls all invalid requrests.
Called-by: server.js
@uther: Vivek Kandoliya
*/

// =====  Importing Node Modules =====
const express = require('express');

// =====  Importing Local Modules  =====
const router = express.Router();
const varifyUser = require('../middlewares/varifyUser');


// ========== Endpoint Section  ==========
router.get('*',varifyUser, (req, res) => {
  res.render('page_not_exist');
});

module.exports = router;