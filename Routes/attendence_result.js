
//--------------- Importing Node Modules
const express = require('express');

//------------------Configs
const router = express.Router();
const path = require('path');
const varifyUser = require('../middlewares/varifyUser');
const con = require('../db');

//----------------End Points (Login Required)



router.get('/',varifyUser, function (req, res) {
    let total_students = 200;

    let month = parseInt(req.query.month);
    if (month == undefined || isNaN(month)) month = 12;

    let no_of_records = req.query.rows;
    if (no_of_records == undefined || isNaN(no_of_records)) no_of_records = 20;
    if (no_of_records < 1) {
        no_of_records = 1;
        console.log("nor cant not be < 1");
    }
    else if (no_of_records > total_students) {
        no_of_records = total_students
        // console.log("page cant not be > "+ total_students/200);
    }

    let page = req.query.page;
    if (page == undefined || isNaN(page)) page = 1;
    if (page < 1) {
        page = 1;
        console.log("page cant not be < 1");
    }
    else if (page > total_students / no_of_records) {
        page = total_students / no_of_records;
        console.log("page cant not be > " + total_students / no_of_records);
    }
    let currunt_page = (page * no_of_records) - no_of_records;

    con.query(`select Student_Attendence.Student_ID, Student_Master.First_Name, count(Student_Attendence.Attendence) as Attendence_Count from Student_Attendence join Student_Master where Student_Attendence.Student_ID=Student_Master.Student_ID and Attendence="p" and month(Attendence_date)=${month} group by Student_Attendence.Student_ID limit ${currunt_page},${no_of_records};`, function (err, data) {
        if (err) throw err;
        res.render('attendence_result/pages/attendence', { data: data, month: month, page: page, no_of_records: no_of_records, total_data: total_students });
    })

})


//==========================   Exam =============================================//

router.get('/exam', varifyUser, async function (req, res) {

    let total_students = 200;

    let no_of_records = req.query.rows;
    if (no_of_records == undefined || isNaN(no_of_records)) no_of_records = 20;
    if (no_of_records < 1) {
        no_of_records = 1;
        console.log("nor cant not be < 1");
    }
    else if (no_of_records > total_students) {
        no_of_records = total_students
        // console.log("page cant not be > "+ total_students/200);
    }

    let page = req.query.page;
    if (page == undefined || isNaN(page)) page = 1;
    if (page < 1) {
        page = 1;
        console.log("page cant not be < 1");
    }
    else if (page > total_students / no_of_records) {
        page = total_students / no_of_records;
        console.log("page cant not be > " + total_students / no_of_records);
    }
    let currunt_page = (page * no_of_records) - no_of_records;

    const terminal = `select Exam_Master.Student_ID, Student_Master.First_Name, sum(Exam_Master.Practicle) as terminal_practical, sum(Exam_Master.Theory) as terminal_final from Student_Master join Exam_Master where Student_Master.Student_ID = Exam_Master.Student_ID and Exam_Master.Exam_Type = 'terminal' group by Exam_Master.Student_ID limit ${currunt_page},${no_of_records};`

    const prelims = `select Exam_Master.Student_ID, Student_Master.First_Name, sum(Exam_Master.Practicle) as prelims_practical, sum(Exam_Master.Theory) as prelims_final from Student_Master join Exam_Master where Student_Master.Student_ID = Exam_Master.Student_ID and Exam_Master.Exam_Type = 'prelims' group by Exam_Master.Student_ID limit ${currunt_page},${no_of_records};`
    
    const final = `select Exam_Master.Student_ID, Student_Master.First_Name, sum(Exam_Master.Practicle) as final_practical, sum(Exam_Master.Theory) as final_final from Student_Master join Exam_Master where Student_Master.Student_ID = Exam_Master.Student_ID and Exam_Master.Exam_Type = 'final' group by Exam_Master.Student_ID limit ${currunt_page},${no_of_records};`

    con.query(`${terminal} ${prelims} ${final}`, function(err, result){
        if (err) throw err;
        res.render('attendence_result/pages/result', { result: result, page: page, no_of_records: no_of_records, total_data: total_students });
    })

    // res.render('attendence_result/pages/result', { terminal: terminal, prelims: prelims, final: final, page: page, no_of_records: no_of_records, total_data: total_students });

    // con.query(`select Exam_Master.Student_ID, Student_Master.First_Name, sum(Exam_Master.Practicle) as terminal_practical,sum(Exam_Master.Theory) as terminal_final,sum(Exam_Master.Practicle + Exam_Master.Theory) as total from Student_Master join Exam_Master where Student_Master.Student_ID = Exam_Master.Student_ID and Exam_Master.Exam_Type = 'terminal' group by Exam_Master.Student_ID limit ${currunt_page},${no_of_records};`, function (err, terminal) {
    //     if (err) throw err;
    //     con.query(`select Exam_Master.Student_ID, Student_Master.First_Name, sum(Exam_Master.Practicle) as prelims_practical,sum(Exam_Master.Theory) as prelims_final,sum(Exam_Master.Practicle + Exam_Master.Theory) as total from Student_Master join Exam_Master where Student_Master.Student_ID = Exam_Master.Student_ID and Exam_Master.Exam_Type = 'prelims' group by Exam_Master.Student_ID limit ${currunt_page},${no_of_records};`, function (err, prelims) {
    //         if (err) throw err;
    //         con.query(`select Exam_Master.Student_ID, Student_Master.First_Name, sum(Exam_Master.Practicle) as final_practical,sum(Exam_Master.Theory) as final_final,sum(Exam_Master.Practicle + Exam_Master.Theory) as total from Student_Master join Exam_Master where Student_Master.Student_ID = Exam_Master.Student_ID and Exam_Master.Exam_Type = 'final' group by Exam_Master.Student_ID limit ${currunt_page},${no_of_records};`, function (err, final) {
    //             if (err) throw err;
    //             console.log('ok');
    //             res.render('attendence_result/pages/result', { terminal: terminal, prelims: prelims, final: final, page: page, no_of_records: no_of_records, total_data: total_students });
    //         })
    //     })

    // })
})

//==========================   Exam =============================================//

router.get('/result',varifyUser,  function (req, res) {

    let sid = req.query.param1;
    if (sid == undefined || isNaN(sid)) res.send("invalid request...")
    else {
        // const student_result = `SELECT Exam_Master.Student_ID, concat(Student_Master.First_Name, ' ', Student_Master.Last_Name) as Student_Name, Exam_Master.Subject_ID, Exam_Master.Exam_Type, Exam_Master.Attendence, Exam_Master.Practicle, Exam_Master.Theory FROM Exam_Master join Student_Master where Student_Master.Student_ID=Exam_Master.Student_ID and Exam_Master.Student_ID = ${sid};`

        // const student_attendence = `select Student_Attendence.Student_ID, Student_Master.First_Name, count(Student_Attendence.Attendence) as Attendence_Count from Student_Attendence join Student_Master where Student_Attendence.Student_ID=Student_Master.Student_ID and Attendence="p" and Student_Attendence.Student_ID = ${sid} group by Student_Attendence.Student_ID ;`
    
        // con.query(`${student_result} ${student_attendence}`, function (err, result){
        //     if(err) throw err;
        //     res.render('attendence_result/pages/fullresult', { result: result});
        // })
        con.query(`SELECT Exam_Master.Student_ID, concat(Student_Master.First_Name, ' ', Student_Master.Last_Name) as Student_Name, Exam_Master.Subject_ID, Exam_Master.Exam_Type, Exam_Master.Attendence, Exam_Master.Practicle, Exam_Master.Theory FROM Exam_Master join Student_Master where Student_Master.Student_ID=Exam_Master.Student_ID and Exam_Master.Student_ID = ${sid};`, function (err, result) {
            if (err) throw err;
            con.query(`select Student_Attendence.Student_ID, Student_Master.First_Name, count(Student_Attendence.Attendence) as Attendence_Count from Student_Attendence join Student_Master where Student_Attendence.Student_ID=Student_Master.Student_ID and Attendence="p" and Student_Attendence.Student_ID = ${sid} group by Student_Attendence.Student_ID ;`, function (err, attendence) {
                if (err) throw err;
                res.render('attendence_result/pages/fullresult', { result: result, attendence: attendence });
            })

        })
    }


})


module.exports = router;
