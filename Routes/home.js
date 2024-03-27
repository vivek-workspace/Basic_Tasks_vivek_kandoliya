
//--------------- Importing Node Modules
const express = require('express');

//------------------Configs
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    res.render('home')
})

module.exports = router;
