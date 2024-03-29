


//--------------- Importing Node Modules
const express = require('express');

//------------------Configs
const router = express.Router();
const path = require('path');
const varifyUser = require('../middlewares/varifyUser');
const con = require('../db');
const { chownSync } = require('fs');

//----------------End Points (Login Required)


router.get('/',varifyUser, (req,res) => {

   const query = `select zone_name from time_zone group by zone_name;`;
   con.query(query, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.render('world_clock/pages/home',{result});
   })
})

module.exports = router;


