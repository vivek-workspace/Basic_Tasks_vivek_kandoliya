


//--------------- Importing Node Modules
const express = require('express');

//------------------Configs
const router = express.Router();
const path = require('path');
const varifyUser = require('../middlewares/varifyUser');




////////////////////////////////////////////////////

const { LocalStorage } = require("node-localstorage");

let localstorage = new LocalStorage('./abc');

app.get('/', (req, res) => {
    res.render('pages/home', { result: false });
})

app.post('/query', (req, res) => {  

    let sqlquery = req.body.sqlquery;
    sqlquery = sqlquery.replace(";", "");
    localstorage.clear();
    localstorage.setItem("sqlquery", sqlquery);
    let finalsqlquery = sqlquery;
    let limited = -1;
    localstorage.setItem('limited', limited);
    if (!sqlquery.includes('limit') && sqlquery.length != 0) {
        finalsqlquery = `${sqlquery} limit 0,20`;
    }
    else if(sqlquery.length != 0){
        destructured = finalsqlquery.split('limit');
        limited = parseInt(destructured[1]);
        localstorage.setItem('limited', limited);
        if(limited<20){
            finalsqlquery = `${destructured[0]} limit 0,${limited}`;
        }
        else{
            finalsqlquery = `${destructured[0]} limit 0,20`;
        }
        
    }

    con.query(`${finalsqlquery}; ${sqlquery}`, function (err, result) {
        if (err) {
            res.render('pages/home', { result: true, err: true, data: err , query: finalsqlquery });
        } else {
           
            res.render('pages/home', { result: true, err: false,query: finalsqlquery, data: result[0], columns: Object.keys(result[0][0]), page: 1, no_of_records: 20, total_data: result[1].length });
        }
    })
    

    // con.query(finalsqlquery, function (err, result) {
    //     if (err) {
    //         res.render('pages/home', { result: true, err: true,query: finalsqlquery, data: err });
    //     } else {
    //         console.log(result[0]);
    //         res.render('pages/home', { result: true, err: false,query: finalsqlquery, data: result, columns: Object.keys(result[0]), page: 1, no_of_records: 20, total_data: 50000});
    //     }
    // })
})

app.get('/query', (req, res) => {
    let page = req.query.page;
    if (page == undefined || isNaN(page)) page = 1;
    let sqlquery = localstorage.getItem('sqlquery');
    let start = (page * 20) - 20;
    let limited = localstorage.getItem('limited');
    let finalsqlquery = sqlquery

    if(!sqlquery.includes('limit')){
        finalsqlquery = `${sqlquery} limit ${start},20`;
    }
    else if(sqlquery.length != 0){
        destructured = finalsqlquery.split('limit');
        limited = parseInt(destructured[1]);
        console.log(limited);
        console.log(start);
        console.log(start + 20) 
        if(limited < start + 20 && limited>0){
            finalsqlquery = `${destructured[0]} limit ${start},${limited-start}`;
        }
        else{
            finalsqlquery = `${destructured[0]} limit ${start},20`;
        }
    }
   
    console.log(finalsqlquery);
    
    con.query(`${finalsqlquery}; ${sqlquery}`, function (err, result) {
        if (err) {
            res.render('pages/home', { result: true, err: true, data: err , query: finalsqlquery });
        } else {
           
            res.render('pages/home', { result: true, err: false,query: finalsqlquery, data: result[0], columns: Object.keys(result[0][0]), page: page, no_of_records: 20, total_data: result[1].length });
        }
    })


})

////////////////////////////////////////////////////module.exports = router;