

//--------------- Importing Node Modules
const express = require('express');

//------------------Configs
const router = express.Router();
const path = require('path');
const varifyUser = require('../middlewares/varifyUser');
const con = require('../db');

//----------------End Points (Login Required)
// router.get('/', varifyUser, (req,res) => { 
//     res.sendFile(path.join(__dirname, '../views/on_events_JS_T1.html'));
// })





////////////////////////////////////////////////////////////

const app = express();


router.get('/',varifyUser, (req,res) => {

    let sqlquery = `select * from select_master;` 

    con.query(`${sqlquery}`, (err,result, fields) => {
        if(err) throw err;
        // res.send(result);
        res.render('component_generator/pages/home',{result: result , fields: fields});
    })
})

router.get('/generate',varifyUser, (req, res) => {
    let combo_key = req.query.combo_name;
    combo_key = combo_key.replaceAll("'",'"');
    combo_key = combo_key.trim();
    let sqlquery = `select select_master.select_value, select_master.combo_type , option_master.option_key, option_master.option_value from select_master join option_master on select_master.select_key = option_master.select_key and select_master.select_key = '${combo_key}';`

    con.query(`${sqlquery}`, (err, result) => {
        if(err) throw err;

        if(result.length == 0){
            res.send('invalid field');
            return;
        }
        // res.send(result)
        console.log(result);
        res.render('component_generator/pages/combo',{result: result});
    })
})

router.get('/form',varifyUser ,(req,res) => {

    const sqlquery = `select select_master.select_key, select_master.select_value, select_master.combo_type, option_master.option_key, option_master.option_value from select_master join option_master on select_master.select_key = option_master.select_key;`

    con.query(`${sqlquery}`, (err, result, fields) => {
        if(err) throw err;
        
        // res.send(result);
        res.render('component_generator/pages/form', {result: result, fields: fields})
    })
})
///////////////////////////////////////////////////////////////////////


module.exports = router;