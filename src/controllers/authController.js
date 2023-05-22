const { validationResult } = require('express-validator');
const Admin = require('../models/adminModel');
const User = require('../models/yapxUserModel');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const passport2 = require('passport');
require('../config/passportLocal')(passport);







/*
/// Generate Pass
        async function generatePass(){
          const sifre = await bcrypt.hash('cancan', 8)
          console.log(sifre);
      }
  generatePass() 
*/
/////////


// AUTH CONTROLLER
const showLoginForm = (req, res, next) => {

    try {
        res.render('admin/login', { layout: '../layouts/adminLogin_Layout', title: `test`, description: ``, keywords: `` })
    } catch (err) {
        console.log(err);
    }
};



const login = (req, res, next) => {
    const hatalar = validationResult(req);

    console.log(hatalar);
    if (!hatalar.isEmpty()) {
        console.log(hatalar.array());
        req.flash('kullaniciAdi', req.body.kullaniciAdi);
        req.flash('validation_error', hatalar.array());
        res.redirect('/yapxadminlogin/login');


    } else {
        res.clearCookie('loggeduser');  
        res.cookie('loggeduser', req.body.kullaniciAdi, { expires: new Date(Date.now() + 900000000) });
        passport.authenticate('local', {
            successRedirect: '/yapxadminlogin',
            failureRedirect: '/yapxadminlogin/login',
            failureFlash: true
        })(req, res, next);
    }
    req.flash('kullaniciAdi', req.body.kullaniciAdi);

    //res.render('login', { layout: './layout/auth_layout' })
};

const login2 = (req, res, next) => {
    const hatalar = validationResult(req);

    console.log(hatalar);
    if (!hatalar.isEmpty()) {
        console.log(hatalar.array());
        req.flash('email', req.body.email);
        req.flash('validation_error', hatalar.array());
        res.redirect('/kayitol');


    } else {

        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/kayitol',
            failureFlash: true
        })(req, res, next);
    }
    req.flash('email', req.body.email);

    //res.render('login', { layout: './layout/auth_layout' })
};
const logout = (req, res, next) => {
    req.logout();
    req.session.destroy((error) => {
        res.clearCookie('connect.sid');
        res.render('login', { layout: './layouts/adminAuth_layout', title: 'Login', success_message: [{ msg: 'Başarıyla çıkış yapıldı' }] })
        res.redirect('/yapxadminlogin');
    });
};





module.exports = {
    showLoginForm,
    login,
    logout,
    login2
}