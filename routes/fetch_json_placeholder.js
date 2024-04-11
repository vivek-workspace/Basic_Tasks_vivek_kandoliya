/*
Program: fetching json placeholder router
Description: controls all requests belongs to fetching json placeholder task
Called-by: server.js
@uther: Vivek Kandoliya
*/



// =====  Importing Node Modules =====
const express = require('express');
const path = require('path');

// =====  Importing Local Modules  =====
const varifyUser = require('../middlewares/varifyUser');

// ===== Setting Variables  =====
const router = express.Router();

// ========== Endpoint Section (Login Required in All) (/tasks/attendence_result/) ==========

// End-point 1 : /tasks/fetch_json_placeholder/posts (login required)
//Desc: sends file which fetchs list of all posts from frontend
router.get('/posts',varifyUser, (req, res) => {
    try{
        res.render('alluser');
    }
    catch(error){
        console.log('touched : Routes/fetch_json_placeholder -> router.get("/posts")')
        console.log(error);
        res.render('error_page');
    } 
})

// End-point 2 : /tasks/fetch_json_placeholder/post/:id (login required)
//Desc: sends file which fetchs perticuler post and its comments from frontend
router.get('/post/:id',varifyUser, (req, res) => {
    try{
        res.render('post')
    }
    catch(error){
        console.log('touched : Routes/fetch_json_placeholder -> router.get("/post:id")')
        console.log(error);
        res.render('error_page');
    }   
})

module.exports = router;