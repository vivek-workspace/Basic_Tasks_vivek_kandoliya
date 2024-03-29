



//--------------- Importing Node Modules
const express = require('express');

//------------------Configs
const router = express.Router();
const path = require('path');
const varifyUser = require('../../middlewares/varifyUser');
const fs = require('fs');
const create = require('./createusr');
const { validationResult, body } = require('express-validator');
const read_list = require('./readlist');
const persondetails = require('./persondetails');

//----------------End Points (Login Required)



router.get('/',varifyUser, (req, res) => {
    res.render('create_read_on_file/pages/form');
})

router.post('/form', varifyUser, 
    body('first_name').notEmpty(),
    body('last_name').notEmpty(),
    body('age').notEmpty(),
    body('number').isLength({ min: 10, max: 10 }),
    body('email').isEmail(),
    body('gender').notEmpty(),
    body('hobbies').notEmpty(),
    body('address').notEmpty()
    , (req, res) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
            const form_data = req.body;
            const ans = create(form_data);
            if (ans)
                res.render('create_read_on_file/pages/submitted');
            else
                res.render('create_read_on_file/pages/form');
        }
        else{
            res.render('create_read_on_file/pages/errorpage',{errors: result.array()})
        }


    })

router.get('/list',varifyUser, (req, res) => {
    const ans = read_list((result) => {
        if (result.people)
            res.render('create_read_on_file/pages/peoplelist', { list: result })
        else res.render('create_read_on_file/pages/nodata');
    });
    // res.render('create_read_on_file/pages/peoplelist',{list: ans});
})

router.get('/person-details',varifyUser, (req, res) => {
    const pid = req.query.id;
    persondetails(pid, (result) => {
        res.render('create_read_on_file/pages/persondetails', { person: result });
    });

    // res.render('create_read_on_file/pages/peoplelist',{list: ans});
})

module.exports = router;