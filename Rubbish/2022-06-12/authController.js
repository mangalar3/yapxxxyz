const { validationResult } = require('express-validator');
const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const passport = require('passport');
require('../config/passportLocal')(passport);


/////////

// ADD USER

/* async function asyncCall() {

    const newUser = new User({
        kullaniciAdi: 'can',
        isim: 'can',
        sifre: await bcrypt.hash('can', 8),
        isAdmin: '9'
    });
    await newUser.save();
    // expected output: "resolved"
  }
  
  asyncCall(); */


/// Generate Pass

/*         async function generatePass(){
          const sifre = await bcrypt.hash('cancan', 8)
          console.log(sifre);
      }
  generatePass() */

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

    //console.log(hatalar);
    if (!hatalar.isEmpty()) {
        console.log(hatalar.array());
        req.flash('kullaniciAdi', req.body.kullaniciAdi);
        req.flash('validation_error', hatalar.array());
        res.redirect('/cycode/login');


    } else {

        passport.authenticate('local', {
            successRedirect: '/cycode',
            failureRedirect: '/cycode/login',
            failureFlash: true
        })(req, res, next);
    }
    req.flash('kullaniciAdi', req.body.kullaniciAdi);

    //res.render('login', { layout: './layout/auth_layout' })
};

const logout = (req, res, next) => {
    req.logout();
    req.session.destroy((error) => {
        res.clearCookie('connect.sid');
        res.render('login', { layout: './layouts/adminAuth_layout', title: 'Login', success_message: [{ msg: 'Başarıyla çıkış yapıldı' }] })
        //res.redirect('/yonetim/login');
    });
};





module.exports = {
    showLoginForm,
    login,
    logout,
}