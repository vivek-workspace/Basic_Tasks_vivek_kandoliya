



//--------------- Importing Node Modules
const express = require('express');

//------------------Configs
const router = express.Router();
const path = require('path');
const varifyUser = require('../middlewares/varifyUser');
const con = require('../db');

//----------------End Points (Login Required)


router.get('/',varifyUser, (req,res) => {

    const sqlquery = 'select id, name from states;'

    con.query(sqlquery, (err, result) =>{
        if (err) throw err;
        res.render('city_state/pages/home',{states: result , cities: []})
    })   
})

router.post('/cities',varifyUser, (req, res) => {

    const state = req.body.state;
    const sqlquery = `select id, city, state_id from cities where state_id = '${state}';`

    con.query(sqlquery, (err, result) =>{
        if (err) throw err;
        res.json(result);
    })   
})

module.exports = router;
