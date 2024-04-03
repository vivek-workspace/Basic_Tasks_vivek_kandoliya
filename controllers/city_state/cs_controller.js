/*
Program: city state controller
Description: main controller of city state task
Called-by: city_state.js
@uther: Vivek Kandoliya
*/

//=====  Importing Local Modules  =====
const con = require('../../db');

//Function home_page : returns homepage
const home_page = (req, res) => {

  const sqlquery = 'select id, name from states;'

  con.query(sqlquery, (err, result) => {
    if (err) {
      console.log('touched : controllers/city_state/cs_controller -> home_page')
      console.log(err);
      return res.render('error_page');
    };
    res.render('city_state/pages/home', { states: result, cities: [] })
  })
}


//Function cities : returns all cities belongs to perticuler state
const cities = (req, res) => {

  const state = req.body.state;
  const sqlquery = `select id, city, state_id from cities where state_id = ?;`

  con.query(sqlquery,[state], (err, result) =>{
      if (err) {
        console.log('touched : controllers/city_state/cs_controller -> cities')
        console.log(err);
        return res.render('error_page');
      };
      res.json(result);
  })   
}
module.exports = { home_page, cities }
