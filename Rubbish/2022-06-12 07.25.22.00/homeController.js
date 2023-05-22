const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/igUserModel');
const fs = require('fs');

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

        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.access_token;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                res.redirect('/accounts');
            } else {
                res.render('user/loginPage', { layout: '../layouts/mainHome_Layout', title: `Login | Instagram`, description: ``, keywords: `` })
            }
        })

    } catch (err) {
        console.log(err);
    }
};

const accountPageShow = async (req, res, next) => {
    try {

        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.access_token;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {


                const cookieStore = new FileCookieStore(`./cookies/${decoded.iUsername}.txt`)
                const client = new Instagram({ cookieStore }, { language: 'en-US' })
                const profile = await client.getProfile();
                console.log(profile);
                const userDetails = await User.find({ iUsername: decoded.iUsername }).then(userDetail => {

                    userDetail = userDetail[0];
                    


                    res.render('user/accountPage', { layout: '../layouts/mainHome_Layout', title: `IG Priv`, description: ``, keywords: ``, userDetail })

                })
            } else {
                // Access Denied
                res.locals.tUserlogin_error = req.flash('tUserlogin_error', '<center><p><b>Oturumunuz Sonlandı!</b><br>Oturumunuz güvenli bir şekilde sonlandı! Lütfen tekrar giriş yapın</p></center>');
                res.redirect('/login');
            }
        })
    } catch (error) {
        // Access Denied
        res.locals.tUserlogin_error = req.flash('tUserlogin_error', '<center><p><b>Oturumunuz Sonlandı!</b><br>Oturumunuz güvenli bir şekilde sonlandı! Lütfen tekrar giriş yapın</p></center>');
        res.redirect('/login');

    }



};




// POST

const loginUser = async (req, res, next) => {

    const gelenUsername = req.body.iUsername;
    const gelenSifre = req.body.iPassword

    const cookieStore = new FileCookieStore(`./cookies/${gelenUsername}.txt`)
    const client = new Instagram({ username: gelenUsername, password: gelenSifre, cookieStore }, { language: 'en-US' })

    try {

        const profile = await client.login()

            //const { gelenUsername, gelenSifre, cookieStore } = await client.login()
            //const { authenticated, user } = await client.login() 
            .then(async function (profile) {

                console.log(profile);
                if (profile == undefined || profile.authenticated == false) {
                    fs.unlink(`./cookies/${gelenUsername}.txt`, (err) => {
                        if (err)
                            throw err;
                    })
                    res.locals.iUserlogin_error = req.flash('iUserlogin_error', '<center><p><b>Giriş Başarısız!</b><br>Lütfen bilgilerinizi kontrol edin!</p></center>');
                    res.redirect('/login');


                } else {

                    async function addUser() {

                        const usernameToID = urlSegmentToInstagramId(req.body.iUsername);
                        const uyeVarMi = await User.count({ iUsername: req.body.iUsername })
                        if (uyeVarMi > 0) {
                            const uyeBilgileri = await User.find({ iUsername: req.body.iUsername })

                            const guncelBilgiler = {
                                iPassword: req.body.iPassword,
                                iActive: '1'

                            }

                            await User.findByIdAndUpdate(uyeBilgileri[0]._id, guncelBilgiler);
                        }
                        else {

                            const newUser = new User({
                                iId: usernameToID,
                                iUsername: req.body.iUsername,
                                iPassword: req.body.iPassword,
                                iActive: '1'
                            });
                            await newUser.save();
                        }
                        const data = {
                            time: Date(),
                            iUsername: req.body.iUsername,
                        }

                        const jwtToken = jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

                        res.clearCookie('access_token');

                        res.cookie('access_token', jwtToken, { expires: new Date(Date.now() + 900000) })
                        res.redirect(`/accounts`)
                    } addUser();

                }
            }).catch(function (error) {
                fs.unlink(`./cookies/${gelenUsername}.txt`, (err) => {
                    if (err)
                        throw err;
                })
                res.locals.iUserlogin_error = req.flash('iUserlogin_error', '<center><p><b>Giriş Başarısız!</b><br>Sunucuya bağlanırken bir sorunla karşılaştık!</p></center>');
                res.redirect('/login')
            })
    } catch (err) {
        console.log(err);
    }

};



module.exports = {
    homeShow,
    loginPageShow,
    loginUser,
    accountPageShow
}