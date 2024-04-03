/*
Program: attendence result controller
Description: this module main controller for task:attendence result controller (includes request endpoints)
Called-by: attendence_result.js
@uther: Vivek Kandoliya
*/


// =====  Importing Node Modules =====

// =====  Importing Lcoal Modules =====
const con = require('../../db');

// ====  Functions  =====

//Function attendence : returns attendence list of the students
const attendence = (req, res) => {
  let total_students = 50;

  //checking queries and setting default values
  try {
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
      }

      let page = req.query.page;
      if (page == undefined || isNaN(page)) page = 1;
      if (page < 1) {
          page = 1;
          console.log("page cant not be < 1");
      }
      else if (page > total_students / no_of_records) {
          //getting total page from the total students divided by records per page
          page = total_students / no_of_records;
          console.log("page cant not be > " + total_students / no_of_records);
      }
      let currunt_page = (page * no_of_records) - no_of_records;

      //retriving list from database
      con.query(`select Student_Attendence.Student_ID, Student_Master.First_Name, count(Student_Attendence.Attendence) as Attendence_Count from Student_Attendence join Student_Master where Student_Attendence.Student_ID=Student_Master.Student_ID and Attendence="p" and month(Attendence_date)=? group by Student_Attendence.Student_ID limit ?,?;`, [month, currunt_page, no_of_records], function (err, data) {
          if (err) {
              console.log('touched : Routes/attendence_result -> router.get("/") -> con.query()')
              console.log(err);
              return res.render('error_page');
          }
          res.render('attendence_result/pages/attendence', { data: data, month: month, page: page, no_of_records: no_of_records, total_data: total_students });
      })
  }
  catch (err) {
      console.log('touched : Routes/attendence_result -> router.get("/")')
      console.log(err);
  }


}


//Function exam : returns exam list of the students
const exam = async(req, res) => {

    let total_students = 50;

    try {
        //checking queries and setting default values
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

        const terminal = `select Exam_Master.Student_ID, Student_Master.First_Name, sum(Exam_Master.Practicle) as terminal_practical, sum(Exam_Master.Theory) as terminal_final from Student_Master join Exam_Master where Student_Master.Student_ID = Exam_Master.Student_ID and Exam_Master.Exam_Type = 'terminal' group by Exam_Master.Student_ID limit ?,?;`

        const prelims = `select Exam_Master.Student_ID, Student_Master.First_Name, sum(Exam_Master.Practicle) as prelims_practical, sum(Exam_Master.Theory) as prelims_final from Student_Master join Exam_Master where Student_Master.Student_ID = Exam_Master.Student_ID and Exam_Master.Exam_Type = 'prelims' group by Exam_Master.Student_ID limit ?,?;`

        const final = `select Exam_Master.Student_ID, Student_Master.First_Name, sum(Exam_Master.Practicle) as final_practical, sum(Exam_Master.Theory) as final_final from Student_Master join Exam_Master where Student_Master.Student_ID = Exam_Master.Student_ID and Exam_Master.Exam_Type = 'final' group by Exam_Master.Student_ID limit ?,?;`



        con.query(`${terminal} ${prelims} ${final}`, [currunt_page, no_of_records, currunt_page, no_of_records, currunt_page, no_of_records], function (error, result) {
            if (error) {
                console.log('touched : Routes/attendence_result -> router.get("/exam") -> con.query()')
                console.log(error);
                return res.render('error_page');
            }
            return res.render('attendence_result/pages/result', { result: result, page: page, no_of_records: no_of_records, total_data: total_students });
        })

    }
    catch (err) {
        console.log('touched : Routes/attendence_result -> router.get("/exam")')
        console.log(err);
        res.render('error_page');
    }
}

//Function result : returns result of the perticuler student
const result = (req, res) => {

    try {
        let sid = req.query.param1;
        if (sid == undefined || isNaN(sid)) res.send("invalid request...")
        else { //applying query for gettig attendence and results
            con.query(`SELECT Exam_Master.Student_ID, concat(Student_Master.First_Name, ' ', Student_Master.Last_Name) as Student_Name, Exam_Master.Subject_ID, Exam_Master.Exam_Type, Exam_Master.Attendence, Exam_Master.Practicle, Exam_Master.Theory FROM Exam_Master join Student_Master where Student_Master.Student_ID=Exam_Master.Student_ID and Exam_Master.Student_ID = ${sid};`, function (err, result) {
                if (err) {
                    console.log('touched : Routes/attendence_result -> router.get("/result") -> req.query()')
                    console.log(err);
                    return res.render('error_page');
                }
                con.query(`select Student_Attendence.Student_ID, Student_Master.First_Name, count(Student_Attendence.Attendence) as Attendence_Count from Student_Attendence join Student_Master where Student_Attendence.Student_ID=Student_Master.Student_ID and Attendence="p" and Student_Attendence.Student_ID = ${sid} group by Student_Attendence.Student_ID ;`, function (err, attendence) {
                    if (err) {
                        console.log('touched : Routes/attendence_result -> router.get("/result") -> req.query()')
                        console.log(err);
                        return res.render('error_page');
                    }
                    res.render('attendence_result/pages/fullresult', { result: result, attendence: attendence });
                })

            })
        }
    }
    catch (error) {
        console.log('touched : Routes/attendence_result -> router.get("/result")')
        console.log(error);
        res.render('error_page');
    }

}


module.exports = {attendence, exam, result}