/*
Program: Delimited Search router
Description: controls all requests belongs to Delimited Search task
Called-by: server.js
@uther: Vivek Kandoliya
*/

// =====  Importing Node Modules =====
const express = require('express');

// =====  Importing Local Modules  =====
const varifyUser = require('../middlewares/varifyUser');
const controller = require('../controllers/delimited_search/ds_controller')

// ===== Setting Variables  =====
const router = express.Router();


// ========== Endpoint Section (Login Required in All) (/tasks/city_state/) ==========

// End-point 1 : /tasks/delimited_search/ (login required)
//Desc: returns list of the students
router.get('/', varifyUser, controller.list);

module.exports = router;

// =====  old unoptimized code  ====

// function generateQuery(params){

//     let sqlquery = ` select Student_ID, First_Name, Father_Name, Last_Name, Gender, City, State, Country, Age, Mobile_No, concat(extract(year from Time_Stamp),'-',extract(month from Time_Stamp),'-',extract(day from Time_Stamp) ,' ', extract(Hour from Time_Stamp), ':', extract(Minute from Time_Stamp) , ':', extract(Second from Time_Stamp)) as 'Time_Stamp(Y-M-D H:M:S)' from Student_Master `
//     let fields = ['Student_ID', 'First_Name', 'Father_Name', 'Last_Name', 'Gender', 'City', 'Age', 'Mobile_No']
//     let values = []
//     if(!params.Student_ID.length == 0){
//         let array = params.Student_ID
//         console.log("search sid = "+params.Student_ID)
//         if(!sqlquery.includes('where')) sqlquery+= ' where ';
//         else sqlquery += ` and `
//         let Search_by_ID= ` Student_Master.Student_ID in (${array}) `;
//         sqlquery += Search_by_ID;
//     }
//     if(!params.First_Name.length == 0){
//         if(!sqlquery.includes('where')) sqlquery+= ' where ( ';
//         else sqlquery += ` and ( `;
//         let Search_by_Student_f_Name = ''
//         for(let i=0; i<params.First_Name.length; i++){
//             if(!i == 0) Search_by_Student_f_Name += ` or ` 
//             Search_by_Student_f_Name += ` Student_Master.First_Name LIKE '%${params.First_Name[i]}%' `
//         }
//         sqlquery += (Search_by_Student_f_Name + ` ) `);
//     }

//     if(!params.Father_Name.length == 0){
//         if(!sqlquery.includes('where')) sqlquery+= ' where ( ';
//         else sqlquery +=  ` and ( `;
//         let Search_by_Student_m_Name = ''
//         for(let i=0; i<params.Father_Name.length; i++){
//             if(!i == 0) Search_by_Student_m_Name += ` or ` 
//             Search_by_Student_m_Name += ` Student_Master.Father_Name LIKE '%${params.Father_Name[i]}%'  `
//         }
//         sqlquery += Search_by_Student_m_Name + ` ) `;
//     }

//     if(!params.Last_Name.length == 0){
//         if(!sqlquery.includes('where')) sqlquery+= ' where ( ';
//         else sqlquery +=  ` and ( `;
//         let Search_by_Student_l_Name = '';
//         for(let i=0; i<params.Last_Name.length; i++){
//             if(!i == 0) Search_by_Student_l_Name += ` or ` 
//             Search_by_Student_l_Name += ` Student_Master.Last_Name LIKE '%${params.Last_Name[i]}%' `
//         }
//         sqlquery += Search_by_Student_l_Name + ` ) `;
//     }

//     if(!params.Gender.length == 0){
//         if(!sqlquery.includes('where')) sqlquery+= ' where ( ';
//         else sqlquery += ` and ( `;
//         let Search_by_Student_Gender =''

//         for(let i=0; i<params.Gender.length; i++){
//             if(!i == 0) Search_by_Student_Gender += ` or ` 
//             Search_by_Student_Gender += ` Student_Master.Gender LIKE '%${params.Gender[i]}%' `
//         }
//         sqlquery += Search_by_Student_Gender + ` ) `;
        
//     }

//     if(!params.City.length == 0){
//         if(!sqlquery.includes('where')) sqlquery+= ' where ( ';
//         else sqlquery += ` and ( `;
//         let Search_by_Student_City = '';
        
//         for(let i=0; i<params.City.length; i++){
//             if(!i == 0) Search_by_Student_City += ` or ` 
//             Search_by_Student_City += ` Student_Master.City LIKE '%${params.City[i]}%' `
//         }
//         sqlquery += Search_by_Student_City + ` ) `;
//     }

//     if(!params.Age.length == 0){
//         if(!sqlquery.includes('where')) sqlquery+= ' where ( ';
//         else sqlquery += ` and ( `;
//         let Search_by_Student_Age = '';
//         for(let i=0; i<params.Age.length; i++){
//             if(!i == 0) Search_by_Student_Age += ` or ` 
//             Search_by_Student_Age += ` Student_Master.Age LIKE '%${params.Age[i]}%' `
//         }
//         sqlquery += Search_by_Student_Age + ` ) `;
//     }

//     if(!params.Mobile_No.length == 0){
//         if(!sqlquery.includes('where')) sqlquery+= ' where ( ';
//         else sqlquery += ` and ( `;
//         let Search_by_Student_MoNo = '';
//         for(let i=0; i<params.Mobile_No.length; i++){
//             if(!i == 0) Search_by_Student_MoNo += ` or ` 
//             Search_by_Student_MoNo += ` Student_Master.Mobile_No LIKE '%${params.Mobile_No[i]}%' `
//         }
//         sqlquery += Search_by_Student_MoNo + ` ) `;
//     }

//     sqlLimit = ' limit 20;'
//     sqlquery +=  sqlLimit;
//     return sqlquery;
// }

/////////////////////////////////////////////////////////////////////////////

