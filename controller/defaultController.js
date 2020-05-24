const crypto = require('crypto');
const User = require('../model/userModel'); 
const { validationResult } = require('express-validator/check');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');


const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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',
    }
}));

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }else{
        message = null;
    }

    if(req.session.isLoggedIn){
        return res.redirect('/dashboard');
    }
    console.log(req.session)
    res.render('default/login', 
    {
        path: '/',
        title: 'Login',
        isAuthenticated: false,
        errorMessage: message,
        oldInput: {
        email: '',
        password: ''
    },
        validationErrors: []
    });
};

exports.postLogin = (req, res, next) => {
  
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('default/login', {
          path: '/',
          pageTitle: 'Login',
          errorMessage: errors.array()[0].msg,
          oldInput: {
            email: email,
            },
          validationErrors: errors.array()
        });
      }

    User.findOne({where: {email: email}})
    .then(user => {
        if(!user) {
            return res.status(422).render('default/login', {
                path: '/',
                pageTitle: 'Login',
                errorMessage:'Invalid Credetials',
                oldInput: {
                  email: email,               
                },
                validationErrors: []
              });
        }
            bcrypt.compare(req.body.password, user.password)
            .then(doMatch => {
                if(doMatch){
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save(err => {
                        console.log(err);
                        res.redirect('/dashboard');
                      });
                }
                return res.status(422).render('default/login', {
                    path: '/',
                    pageTitle: 'Login',
                    errorMessage:'Invalid Credetials',
                    oldInput: {
                      email: email,
                   
                    },
                    validationErrors: []
                  });
            })
            .catch(err => {
                console.log(err);
                res.redirect('/')
            })
    }).catch(err => {
        res.send('error: ' + err);
        res.redirect('/');
    })
};


exports.getResetPass =  (req, res, next) => {
    res.render('default/reset-pass');
};


exports.postResetPass = (req,res,next) => {
    crypto.randomBytes(32,(err, buffer) => {
        if(err){
            console.log(err);
            return res.redirect('/reset-password');
        }
        const token = buffer.toString('hex');

        User.findOne({where: {email: req.body.email}})
        .then(user => {
            if(!user){
                // req.flash('error', 'Account not exist');
                console.log('User not exist')
                return  res.redirect('/reset-password');
            }
            let resetToken = user.resetToken;
            let resetTokenExpiration = user.resetTokenExpiration;
            User.update({
                resetToken: token,
                resetTokenExpiration: Date.now() + 3600000
            },{where: {resetToken, resetTokenExpiration}})
            .then(result => {
                console.log(result);
            }).catch(err => {
                console.log(err);
            });

        }).then(result => {
            res.redirect('/');
            transporter.sendMail({
                to: req.body.email,
                from: 'marcreginald98@gmail.com',
                subject: 'Password Reset',
                html: `
                <p>You requested a password reset</p>
                <p>Click this <a href="http://localhost:3000/reset-password/${token}">link</a> to set a new password</p>
                `
            }).catch(err => {
                console.log(err);
            })
        })
        .catch(err => {
            console.log(err);
        });
    });
};

exports.getNewPassword = (req,res,next) => {
    const token = req.params.token;

    User.findOne({where: {
        resetToken: token,
        resetTokenExpiration: {
            [Op.gt]: Date.now()
        }
    }})
    .then(user => {
        const id = {};
        if(!id){
            console.log('id not found');
        }
        res.render('default/new-password',{
            path: '/new-password',
            title: 'Update Password',
            id: id.toString(),
            passwordToken: token
        });
    })
    .catch(err => {
        console.log(err);
    })
   
};

exports.postNewPassword = (req, res, next) => {

    const newPassword = req.body.password;
    const id = req.body.id;
    const passwordToken  = req.body.passwordToken;
    let resetUser;
    let password = newPassword;
    let resetToken;
    let resetTokenExpiration;

    User.findOne({
            resetToken: passwordToken, 
            resetTokenExpiration: {
                [Op.gt]: Date.now()
            },
            id: id
        }).then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
          }).then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save({where: password, resetToken, resetTokenExpiration});
          }).then(result => {
            res.redirect('/');
          })
          .catch(err => {
            console.log(err);
          });
};