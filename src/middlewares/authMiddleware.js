const oturumAcilmis = function (req, res, next) {
    if (req.isAuthenticated()) {
        //console.log('AUTH MIDDLEWARE GİRİŞ YAPILMIŞ');
        return next();
    } else {

        res.redirect('/yapxadminlogin/login');
    }
}
const mainoturumAcilmis = function (req, res, next) {
    if (req.isAuthenticated()) {
        //console.log('AUTH MIDDLEWARE GİRİŞ YAPILMIŞ');
        return next();
    } else {

        res.redirect('/');
    }
}
const mainoturumAcilmamis = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
}
const oturumAcilmamis = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/yapxadminlogin');
    }
}




module.exports = {
    oturumAcilmis,
    oturumAcilmamis,
    mainoturumAcilmamis,
    mainoturumAcilmis
}