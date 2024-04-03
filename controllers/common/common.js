/*
Program: Common Functions
Description: this file includes common functions used in this app
@uther: Vivek Kandoliya
*/


//Function generateQuery : Used to create postfix of the sql query whih includes field names and generates query in form of '--fields-- values(?,?,?)'

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
function generateUpdateQuery(fields) {

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

//Function generateUpdateQuery : Used to create
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

module.exports = { generateQuery, generateUpdateQuery, generateConditionalSelect };