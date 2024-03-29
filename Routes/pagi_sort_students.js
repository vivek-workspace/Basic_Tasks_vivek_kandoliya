


//--------------- Importing Node Modules
const express = require('express');

//------------------Configs
const router = express.Router();
const path = require('path');
const varifyUser = require('../middlewares/varifyUser');
const con = require('../db');

//----------------End Points (Login Required)




router.get('/',varifyUser, function (req, res){

    let total_students = 50000;
    // con.query('select count(*) as total_counts from School5_26feb.Student_Master', async function (err, result){
    //     total_students = await result.total_counts;
    // });
    
    let no_of_records = req.query.rows;
    if(no_of_records == undefined || isNaN(no_of_records)) no_of_records = 200;
    if(no_of_records < 1){
        no_of_records=1;
        console.log("nor cant not be < 1");
    } 
    else if(no_of_records > total_students){
        no_of_records=total_students
        // console.log("page cant not be > "+ total_students/200);
    }

    let page = req.query.page;
    if(page == undefined || isNaN(page) ) page=1;
    if(page < 1){
        page=1;
        console.log("page cant not be < 1");
    } 
    else if(page > total_students/no_of_records){
        page=total_students/no_of_records;
        console.log("page cant not be > "+ total_students/no_of_records);
    }

    let field = req.query.obf;
    if(field == undefined ) field='Student_ID';
    
    let order = req.query.order;
    if(order == undefined ) order='asc';

    let currunt_page = (page*no_of_records)-no_of_records;
   

    con.query(`select * from School5_26feb.Student_Master order by ${field} ${order} limit ${currunt_page},${no_of_records} `, function (err , result){
       if(err) throw err;
        // console.log(result);
        const data_str = JSON.stringify(result);
        const data = JSON.parse(data_str);
        console.log(data[0]);
        res.render('pagination_sorting_students/pages/student_list', {students: data, currunt: page, total_data: total_students, no_of_records: no_of_records, obf: field, order: order});
    })
})

module.exports = router;

