/*
Program: pagination sorting controller
Description: this module main controller for task:pagination sorting controller (includes request endpoints)
Called-by: attendence_result.js
@uther: Vivek Kandoliya
*/


// =====  Importing Lcoal Modules =====
const con = require('../../db');

// Function home_page : returns home page of the task (single page task)
const home_page = (req, res) => {

  let total_students = 50;

  try{
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
 

  con.query(`select * from School5_26feb.Student_Master order by ? ? limit ?,? `,[field, order, currunt_page, parseInt(no_of_records)] , function (err , result){
     if(err) {
      console.log('touched : pagi_sort_students/pass_controller -> hone_page')
      console.log(err);
      return res.render('error_page');
     };
      // console.log(result);
      const data_str = JSON.stringify(result);
      const data = JSON.parse(data_str);
      
      res.render('pagination_sorting_students/pages/student_list', {students: data, currunt: page, total_data: total_students, no_of_records: no_of_records, obf: field, order: order});
  })
  }catch(error){
    console.log('touched : pagi_sort_students/pass_controller -> hone_page')
    console.log(error);
    return res.render('error_page');
  }
  
  
}

module.exports = {home_page};