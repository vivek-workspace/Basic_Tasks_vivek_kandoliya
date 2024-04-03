
//--------------- Importing Node Modules
const express = require('express');

//------------------Configs
const router = express.Router();
const path = require('path');
const varifyUser = require('../middlewares/varifyUser');
const con = require('../db');

//----------------End Points (Login Required)

router.get('/',varifyUser, (req, res) => {
    const sqlquery = createQuery(req.query);
    if(req.query.showmore == undefined) req.query.showmore = 'false'
    con.query(sqlquery,(err,result, fields) => {
        if(err){
            res.render('simple_search/pages/home', { result: false, err: true, query: sqlquery, data: err, params: req.query, page: 1});
            console.log(err);
        } 
        else{
            res.render('simple_search/pages/home', { result: true, err: false, query: sqlquery, data: result, params: req.query, columns: fields, page: 1, no_of_records: 20, total_data: result.length });
        }
        
    });
   
    // 
})

function createQuery(params){
    const andorSelect = params.andor;

    let sqlquery ='select Student_Master.Student_ID, concat(Student_Master.First_Name, " ", Student_Master.Last_Name) as Student_Name, Student_Master.Gender, Student_Master.City, Student_Master.Mobile_No, sum(Exam_Master.Practicle) as Practical, sum(Exam_Master.Theory) as Theory, sum(Exam_Master.Practicle + Exam_Master.Theory) as Total, round(sum((Exam_Master.Practicle + Exam_Master.Theory)*100)/1080,2) as Percentage  from Student_Master join Exam_Master on Student_Master.Student_ID = Exam_Master.Student_ID';
    
  
    if(!params.search_sid == ''){
        let array = params.search_sid
        console.log("search sid = "+params.search_sid)
        if(!sqlquery.includes('where')) sqlquery+= ' where ';
        else sqlquery += andorSelect
        let Search_by_ID= ` Student_Master.Student_ID in (${array}) `;
        sqlquery += Search_by_ID;
    }
    if(!params.s_fsn== ''){
        if(!sqlquery.includes('where')) sqlquery+= ' where ';
        else sqlquery += andorSelect;
        let Search_by_Student_f_Name = ` Student_Master.First_Name LIKE '%${params.s_fsn}%' `
        sqlquery += Search_by_Student_f_Name;
    }

    if(!params.s_lsn== ''){
        if(!sqlquery.includes('where')) sqlquery+= ' where ';
        else sqlquery += andorSelect;
        let Search_by_Student_f_Name = ` Student_Master.Last_Name LIKE '%${params.s_lsn}%' `
        sqlquery += Search_by_Student_f_Name;
    }

    if(!params.s_gender== ''){
        if(!sqlquery.includes('where')) sqlquery+= ' where ';
        else sqlquery += andorSelect;
        let Search_by_Student_Gender = ` Student_Master.Gender = '${params.s_gender}' `
      
        sqlquery += Search_by_Student_Gender;
    }
    if(!params.s_city== ''){
        if(!sqlquery.includes('where')) sqlquery+= ' where ';
        else sqlquery += andorSelect;
        let Search_by_Student_City = ` Student_Master.City LIKE '%${params.s_city}%' `
        sqlquery += Search_by_Student_City;
    }

    if(!params.s_mno== ''){
        if(!sqlquery.includes('where')) sqlquery+= ' where ';
        else sqlquery += andorSelect;
        let Search_by_Student_MoNo = ` Student_Master.Mobile_No = '${params.s_mno}' `
        sqlquery += Search_by_Student_MoNo;
    }

    if(isNaN(params.andor) || params.andor == undefined) params.andor = 'and'
    

    let sqlGroupBy = ` group by Exam_Master.Student_ID`
    sqlquery +=  sqlGroupBy;

    if(!params.percentage== ''){
       
        let between = params.percentage.split('_');
        let start = parseInt(between[0]);
        let end = parseInt(between[1]);
        let Search_by_Student_Percent  = ` having round(sum((Exam_Master.Practicle + Exam_Master.Theory)*100)/1080,2) between ${start} and ${end} `
        sqlquery += Search_by_Student_Percent;
    }

    sqlLimit = ' limit 20;'
    sqlquery +=  sqlLimit;
    return sqlquery;
}




module.exports = router;