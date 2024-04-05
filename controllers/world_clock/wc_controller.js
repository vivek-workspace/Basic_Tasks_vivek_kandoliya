/*
Program: world clock controller
Description: contains functions related to  world clock
Called-by: world_clock.js
@uther: Vivek Kandoliya
*/

// =====  Importing Lcoal Modules =====
const con = require('../../db');

//Function home_page : returns home page of the task (single page task)
const home_page = (req,res) => {

    const query = `select zone_name from time_zone group by zone_name;`;
    con.query(query, (err, result) => {
       if(err){
        console.log('touched : controllers/world_clock/wc_controller -> home_page')
        console.log(err);
        res.render('error_page');
       };
       res.render('world_clock/pages/home',{result});
    })
 }

module.exports = { home_page }