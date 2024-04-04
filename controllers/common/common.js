/*
Program: Common Functions
Description: this file includes common functions used in this app
@uther: Vivek Kandoliya
*/

// =====  Importing Node Modules =====
const util = require("util");

// =====  Importing Local Modules  =====
const con = require('../../db');

//Function generateQuery : generates postfix of the query '(fields) values (?,?,?);
function generateQuery(fields, values) {
  var fields_part = "";
  var values_part = "";

  for (let i = 0; i < values.length; i++) {
    if (values[i] !== '') {
      fields_part += `,${fields[i]} `;
      values_part += `,? `;
    }
  }
  fields_part = fields_part.slice(1);
  values_part = values_part.slice(1);
  let sqlquery = `${fields_part} ) values ( ${values_part} );`
  // console.log("sqlqey",sqlquery);
  return sqlquery;
}

//Function generateUpdateQuery : Used to create postfix of the update sql query whih includes field names and generates query in form of 'field = ?'
function generateUpdateQuery(fields, values) {

  const length = fields.length;
  let sqlquery = ''
  for (let i = 0; i < length; i++) {

    if (values[i] != undefined) {
      sqlquery += `,${fields[i]} = ? `
    }

  }
  sqlquery = sqlquery.slice(1);

  return sqlquery;
}

//Function generateConditionalSelect : generates postfix of select the query ' where (x or y) and (a or b)'
function generateConditionalSelect(fields, values) {

  let sqlquery = ' '

  values.forEach((element, index) => {
    if (!element.length == 0) {

      // console.log("search sid = "+params.Student_ID)
      if (!sqlquery.includes('where')) sqlquery += ' where ';
      else sqlquery += ` and ( `;
      let search = ''
      for (let i = 0; i < element.length; i++) {
        if (!i == 0) search += ` or `
        search += ` ${fields[index]} LIKE '%${element[i]}%' `
      }
      sqlquery += search;
    }
  });
  
  sqlLimit = ' limit 20;'
  sqlquery += sqlLimit;
  return sqlquery;
}

//Function insertBasicDetails : inserts basic details of the job app form.
async function insertBasicDetails(formData) {

  let promisedQuery = util.promisify(con.query).bind(con);

  const values_array = ['first_name', 'last_name', 'designation', 'zip_code', 'address_1', 'address_2', 'city', 'state', 'email', 'phone', 'gender', 'relationship', 'dob', 'prefered_location', 'notice_period', 'department', 'expacted_ctc', 'currunt_ctc']

  let values = [];
  values_array.forEach(item => {
      if ((item == 'expacted_ctc' || item == 'notice_period' || item == 'currunt_ctc') && formData[item] != '') {
          values.push(parseInt(formData[item]))
      }
      else values.push(formData[item]);
  })

  const fields = ['first_name', 'last_name', 'designation', 'zipcode', 'address_1', 'address_2', 'city', 'state', 'email', 'phone_no','gender', 'relationship_status', 'date_of_birth', 'prefered_location', 'notice_period', 'department', 'expacted_ctc', 'currunt_ctc'];

  let sqlquery = `insert into applicants (`;
  sqlquery += generateQuery(fields, values);
  values = removeEmpty(values);

  let result = await promisedQuery(sqlquery,values);

  return result.insertId;

}

//Function insertEducationalDetails : inserts educational details of the job app form.
async function insertEducationalDetails(formData, id) {

  let promisedQuery = util.promisify(con.query).bind(con);

  const { degree, board_uni, course, passing_year, percentage } = formData;
  const fields = ['applicant_id', 'degree', 'course', 'university_or_board', 'passing_year', 'percentage'];
  // const length = percentage.length;
  const allDeg = ['ssc', 'hsc'].concat(degree);
  const newcourse = ['ssc','hsc'].concat(course);
  let values = [];
  // console.log("abc", allDeg)

  const filtered_data = filterRows([allDeg, newcourse, board_uni, passing_year, percentage]);
  const length = filtered_data[0].length;

  for (let i = 0; i < length; i++) {
      let sqlquery = `insert into education_details (`;
      values = [];
      values.push(id);
      for(let j=0; j< filtered_data.length; j++){
          if(j == 1 && i < 2){
              values.push('');
          }
          else values.push(filtered_data[j][i]);
      }
      // console.log('value str',values)
      sqlquery += generateQuery(fields, values);
      try {
          values = removeEmpty(values)
          let result = await promisedQuery(sqlquery,values);
      }
      catch (err) {
          console.log(err);
      }
  }
}

//Function insertWorkexperienceDetails : inserts work experience details of the job app form.
async function insertWorkexperienceDetails(formData, id) {
  let promisedQuery = util.promisify(con.query).bind(con);

  const { company, old_designation, from, to } = formData;
  const fields = ['applicant_id', 'company', 'designation', 'joining', 'leaving'];
  
  const filtered_data = filterRows([company, old_designation, from, to]);
  const length = filtered_data[0].length;
  let values = [];

  for (let i = 0; i < length; i++) {
      let sqlquery = `insert into work_experience (`;
      values = []
      values.push(id);
      for(let j=0; j< filtered_data.length; j++){
          values.push(filtered_data[j][i]);
      }
      
      sqlquery += generateQuery(fields, values);
      try {
          values = removeEmpty(values)
          let result = await promisedQuery(sqlquery, values);
      }
      catch (err) {
          console.log(err);
      }
  }
}

//Function insertLanguages : inserts Language details of the job app form.

async function insertLanguages(formData, id){
  let promisedQuery = util.promisify(con.query).bind(con);

  const { language, read, write, speak } = formData;
  const fields = ['applicant_id','language', 'lread', 'lwrite','speak'];
  let nread = (read == undefined)?[]:read;
  let nwrite = (write == undefined)?[]:write;
  let nspeak = (speak == undefined)?[]:speak;
  const filtered_data = [language, nread, nwrite, nspeak];
  const length = filtered_data[0].length;
  // console.log(filtered_data)
  let values = [];

  for (let i = 0; i < length; i++) {
      let sqlquery = `insert into languages_known (`;
      values = []
      values.push(id);
      for(let j=0; j< filtered_data.length; j++){
          if(j == 0){
              values.push(filtered_data[j][i]);
          }
          else{
              if(filtered_data[j].includes(language[i])){
                  values.push(true);
                  // console.log(values);
              }
              else{
                  // console.log('runiing');
                 values.push(false); 
              //    console.log(values);
              }
          }
      }
      
      sqlquery += generateQuery(fields, values);
      // console.log(sqlquery);
      try {
          values = removeEmpty(values)
          let result = await promisedQuery(sqlquery, values);
          // console.log(result)
      }
      catch (err) {
          console.log(err);
      }"${values[i]}"
  }
}

//Function insertTechnologies : inserts Technologies details of the job app form.

async function insertTechnologies(formData, id){
  let promisedQuery = util.promisify(con.query).bind(con);

  const { technology, php_radio, mysql_radio, laravel_radio } = formData;
  const fields = ['applicant_id','technology', 'expertise'];
  
  const radio_data = [php_radio, mysql_radio, laravel_radio];

  for(let i=0; i<radio_data.length; i++){
      if(radio_data[i] == undefined){
          radio_data.splice(i,1);
      }
  }
  // console.log(radio_data)
  const length = technology.length;

  let values = [];

  for (let i = 0; i < length; i++) {
      let sqlquery = `insert into technologies_known (`;
      values = []
      values.push(id);
      values.push(technology[i]);
      values.push(radio_data[i]);
     
      
      sqlquery += generateQuery(fields, values);
      // console.log(sqlquery);
      try {
          values = removeEmpty(values)
          let result = await promisedQuery(sqlquery, values);
          // console.log(result)
      }
      catch (err) {
          console.log(err);
      }
  }

}


//Function insertReferanceContact : inserts refrence details of the job app form.

async function insertReferanceContact(formData, id){
  let promisedQuery = util.promisify(con.query).bind(con);

  const { ref_names, ref_con, ref_relation } = formData;
  const fields = ['applicant_id','reference_name', 'reference_mobile_no', 'relation'];
  
  const filtered_data = filterRows([ref_names, ref_con, ref_relation]);
  const length = filtered_data[0].length;

  let values = [];

  for (let i = 0; i < length; i++) {
      let sqlquery = `insert into reference_contact (`;
      values = []
      values.push(id);
      for(let j=0; j< filtered_data.length; j++){
          values.push(filtered_data[j][i]);
      }
      
      sqlquery += generateQuery(fields, values);
      // console.log(sqlquery);
      try {
          values = removeEmpty(values)
          let result = await promisedQuery(sqlquery, values);
          // console.log(result)
      }
      catch (err) {
          console.log(err);
      }
  }
}


// ======================= Update Basic Details ===================================================//

async function updateBasicDetails(formData){
  let promisedQuery = util.promisify(con.query).bind(con);

  const fields = ['first_name', 'last_name', 'designation', 'zipcode' , 'address_1', 'address_2','city', 'state', 'email', 'phone_no', 'gender', 'relationship_status','date_of_birth', 'prefered_location', 'notice_period', 'department', 'expacted_ctc', 'currunt_ctc'];
  const formFields = ['first_name', 'last_name', 'designation', 'zip_code', 'address_1', 'address_2', 'city', 'state', 'email', 'phone', 'gender', 'relationship', 'dob', 'prefered_location', 'notice_period', 'department', 'expacted_ctc', 'currunt_ctc']
  let values = [];

  formFields.forEach(item => {
      if ((item == 'expacted_ctc' || item == 'notice_period' || item == 'currunt_ctc') && formData[item] != '') {
          values.push(parseInt(formData[item]))
      }
      else if(formData[item] != '')
          values.push(formData[item]);
      else    
      values.push(undefined);
  })
  

  let sqlquery = `update applicants set `;

  sqlquery += generateUpdateQuery(fields, values);
  values = removeEmpty(values);
  // console.log("abcd",values)

  sqlquery += ` where applicant_id = ${formData.update_applicant_id}`
  // console.log(sqlquery);
  const result = await promisedQuery(sqlquery, values);
  
  return result.affectedRows;
}

// ======================= Update Education Details ===================================================//

async function updateEducationalDetails(formData){

  const user_id = formData.update_applicant_id;
  let promisedQuery = util.promisify(con.query).bind(con);
  let ids = formData.eduIds;
  let degree = ['SSC', 'HSC'];
  degree = degree.concat(formData.degree);
  let course = ['SSC','HSC'];
  course = course.concat(formData.course);
  let board_uni = formData.board_uni;
  let passing_year = formData.passing_year;
  let percentage = formData.percentage;
  // console.log(degree, course, board_uni, passing_year, percentage);
  let fields = ['degree', 'course', 'university_or_board','passing_year','percentage'];
  for(let i=0; i<ids.length; i++){
      let values = [];
      let sqlquery = 'update education_details set '
      if(i>2 && degree[i] == ''){
          continue;
      }
      if(i<2){
          values = [board_uni[i], passing_year[i], parseInt(percentage[i])];
          let fields2 = fields.slice(2);
          sqlquery += generateUpdateQuery(fields2, values);
      }
      else{
          values = [degree[i], course[i], board_uni[i], passing_year[i], parseInt(percentage[i])];
          sqlquery += generateUpdateQuery(fields, values);
      }
      sqlquery += ` where id = ${ids[i]}`
      values = removeEmpty(values);
      const result = await promisedQuery(sqlquery, values);
      // console.log(result);
  }

  if(ids.length < 4 && degree[3] != ''){
     
      let fields = ['applicant_id','degree', 'course', 'university_or_board','passing_year','percentage'];
      let values = [user_id, degree[3], course[3], board_uni[3], passing_year[3], parseInt(percentage[3])];
      let sqlquery = `insert into education_details (`
      sqlquery += generateQuery(fields, values);
      values = removeEmpty(values);
      const result = await promisedQuery(sqlquery, values);
      // console.log("insertion",result);
  }

  if(ids.length == 4 && degree[3] == ''){
      const sqlquery =  `delete from education_details where id = ${ids[3]}`;
      const result = await promisedQuery(sqlquery);
      // console.log("deletion",result);
  }
}

// ======================= Update Language Details ===================================================//


async function updateLanguageDetails(formData){

  let promisedQuery = util.promisify(con.query).bind(con);
  const user_id = formData.update_applicant_id;
 

  const deleteLanguages = `delete from languages_known where applicant_id = ${parseInt(user_id)}`;
  const delete_Languages = promisedQuery(deleteLanguages);

  const ans = insertLanguages(formData, user_id);
  console.log(ans);

}

// ======================= Update Technologies ===================================================//

async function updateTechnologyDetails(formData){

  let promisedQuery = util.promisify(con.query).bind(con);
  const user_id = formData.update_applicant_id;


  const deleteTechnologies = `delete from technologies_known where applicant_id = ${parseInt(user_id)}`;
  const delete_tech = await promisedQuery(deleteTechnologies);

  const ans = insertTechnologies(formData, user_id);
  // console.log(ans);

}

// ======================= Update WorkExperience ===================================================//

async function updateWorkExperience(formData){
  let promisedQuery = util.promisify(con.query).bind(con);
  const user_id = formData.update_applicant_id;


  const deleteWorkexperience = `delete from work_experience where applicant_id = ${parseInt(user_id)}`;
  const delete_we = await promisedQuery(deleteWorkexperience);

  const ans = insertWorkexperienceDetails(formData, user_id);
  // console.log(ans);
}

// ======================= Update Reference Contact ===================================================//

async function updateReferenceContacts(formData){
  let promisedQuery = util.promisify(con.query).bind(con);
  const user_id = formData.update_applicant_id;


  const deleteReferences = `delete from reference_contact where applicant_id = ${parseInt(user_id)}`;
  const delete_rc = await promisedQuery(deleteReferences);

  const ans = insertReferanceContact(formData, user_id);
  // console.log(ans);
}

// // ======================= Function Filter Rows ===================================================//

function filterRows(data) {
  let length = data[0].length;
  
  for (let i = 0; i < length; i++) {
      let flag = true;
      for (let j = 0; j < data.length; j++) {
          if (data[j][i] == '') {
              flag = false;          
          }
      }
      if (!flag) {
          for (let j = 0; j < data.length; j++) {
              data[j].splice(i,1);
              
          }
      }
  }
 
  return data;
}

// ======================= Function Remove Empty ===================================================//

function removeEmpty(array){
  let newArray = []
  array.forEach(item => {
      if(item !==undefined && item !== ''){
          newArray.push(item);
          // console.log("sdfasd",item);
      }
      else{
          console.log(item);
      }
  })
  return newArray;
}

module.exports = { generateQuery, generateUpdateQuery, generateConditionalSelect, insertBasicDetails, insertEducationalDetails, insertWorkexperienceDetails, insertLanguages, insertTechnologies, insertReferanceContact, updateBasicDetails, updateEducationalDetails, updateLanguageDetails, updateTechnologyDetails, updateWorkExperience, updateReferenceContacts, filterRows };