/*
Program: component generator controller
Description: main controller of component generator task
Called-by: component_generator.js
@uther: Vivek Kandoliya
*/

//=====  Importing Local Modules  =====
const con = require('../../db');

//Function home_page : returns homepage
const home_page = (req, res) => {

  let sqlquery = `select * from select_master;`

  con.query(`${sqlquery}`, (err, result, fields) => {
    if (err) {
      console.log('touched : controllers/component_generator/cg_controller -> home_page')
      console.log(err);
      return res.render('error_page');
    }
    // res.send(result);
    res.render('component_generator/pages/home', { result: result, fields: fields });
  })
}

//Function generate : returns data of the component
const generate = (req, res) => {
  try {
    let combo_key = req.query.combo_name;
    combo_key = combo_key.replaceAll("'", '"');
    combo_key = combo_key.trim();
    let sqlquery = `select select_master.select_value, select_master.combo_type , option_master.option_key, option_master.option_value from select_master join option_master on select_master.select_key = option_master.select_key and select_master.select_key = ?;`

    con.query(`${sqlquery}`,[combo_key], (err, result) => {
      if (err) {
        console.log('touched : controllers/component_generator/cg_controller -> generate')
        console.log(err);
        return res.render('error_page');
      }

      if (result.length == 0) {
        res.send('invalid field');
        return;
      }
      // res.send(result)
      console.log(result);
      res.render('component_generator/pages/combo', { result: result });
    })
  }
  catch (error) {
    console.log('touched : controllers/component_generator/cg_controller -> generate')
    console.log(error);
    return res.render('error_page');
  }

}

module.exports = { home_page, generate };