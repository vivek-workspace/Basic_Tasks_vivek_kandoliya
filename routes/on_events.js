
//--------------- Importing Node Modules
const express = require('express');

//------------------Configs
const router = express.Router();
const path = require('path');
const varifyUser = require('../middlewares/varifyUser');

//----------------End Points (Login Required)
router.get('/', varifyUser, (req,res) => { 
    res.sendFile(path.join(__dirname, '../views/on_events_JS_T1.html'));
})

module.exports = router;