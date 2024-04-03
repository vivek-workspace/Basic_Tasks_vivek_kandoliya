


//--------------- Importing Node Modules
const express = require('express');

//------------------Configs
const router = express.Router();
const path = require('path');
const varifyUser = require('../middlewares/varifyUser');

//----------------End Points (Login Required)


router.get('/posts',varifyUser, (req, res) => {
    res.sendFile(path.join(__dirname,'../views/alluser.html'));
})

router.get('/post/:id',varifyUser, (req, res) => {
    res.sendFile(path.join(__dirname,'../views/post.html'));
})




module.exports = router;