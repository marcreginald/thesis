const bcrypt = require('bcryptjs');
const User = require('../model/userModel'); 
const studentModel = require('../model/studentModel');
const { validationResult } = require('express-validator/check');
const { Op } = require("sequelize");

exports.getDashboard = async(req, res, next) => {

    let count = User.findAndCountAll({attributes: ['id']});
    let student = studentModel.findAndCountAll({attributes: ['id']});

    let passed = studentModel.findAndCountAll({
        where: {
            status: 'Passed',
        }
    });
    let dropped = studentModel.findAndCountAll({
        where: {
            status: 'Dropped'
        }
    })

    try {

       const users = await User.findOne({
            attributes: [
                'id',
                'firstName', 
                'lastName', 
                'username', 
                'email',
                'isAdmin',
        ]})
            res.render('admin/dashboard', 
            {
                user:users,
                counts: count,
                students: student,
                drop: dropped,
                pass: passed,
                title: 'Dashboard',
                path: '/dashboard',
                active: {dashboard:true}
            })

        
         
    } catch (error) {
        console.log(error);
    }
    
};

exports.getUsers = (req, res, next) => {

    User.findAll({
        attributes: [
            'id',
            'firstName', 
            'lastName', 
            'username', 
            'email',
            'isAdmin',
    ]}).then(users => {
        res.render('admin/users', 
        {
            user:users,
            title: 'User',
            path: '/users-profile',
            active: {users:true},
            oldInput: {
                email: "",
                username: "",
                firstName: "",
                lastName: "",
                password: ""
        }
        })
        // console.log("All users:", JSON.stringify(users, null, 4));
        
      });
 
    
};

exports.postUsers = async(req, res, next) => {
 
    const errors = validationResult(req);
    let {
        firstName, 
        lastName, 
        username, 
        email,
        isAdmin,
        password
    } = req.body;

    try{

        const users = await User.findAll({
            attributes: [
                'id',
                'firstName', 
                'lastName', 
                'username', 
                'email',
                'isAdmin',
        ]})

        if(!errors.isEmpty()){
            console.log(errors.array());
            return res.status(422).render('admin/users', 
            {
                user:users,
                title: 'User',
                path: '/users-profile',
                errorMessage: errors.array()[0].msg,
                active: {users:true},
                oldInput: {email: email, username: username, password: password, firstName: firstName, lastName: lastName}
            });
        }

            if(isAdmin === true){
                isAdmin = "Admin"
                isAdmin.toString()
                return isAdmin;
            }else if(isAdmin === false){
            
                return isAdmin.toString();
            } 
                const hash = await bcrypt.hash(password, 12)
                password = hash;
                User.create(
                      {   firstName,
                          lastName,
                          username, 
                          email,
                          isAdmin,
                          password
                      });
                  res.redirect('/users-profile'); 
          
    }catch(err){
        console.log(err);
    }
};

exports.getReports = (req, res, next) => {
    res.render('admin/reports', 
    {
        path: '/reports',
        title: 'Reports',
        active:{reports: true} 
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
      console.log(err);
      res.redirect('/');
    });
};
