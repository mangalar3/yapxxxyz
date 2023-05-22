const localStrategy = require('passport-local').Strategy;
const User = require('../models/adminModel');
const bcrypt = require('bcryptjs');


module.exports = function (passport) {
    const options = {
        usernameField: 'kullaniciAdi',
        passwordField: 'sifre'
    };
    passport.use(new localStrategy(options, async (kullaniciAdi, sifre, done) => {

        try {

            const _bulunanUser = await User.findOne({ kullaniciAdi: kullaniciAdi });

            if (!_bulunanUser) {
                return done(null, false, { message: 'User not found!' });
            }

            const sifreKontrol = await bcrypt.compare(sifre, _bulunanUser.sifre);
            if(!sifreKontrol){
                return done(null, false, { message: 'Wrong password!' });
            }else {
                if (_bulunanUser && _bulunanUser.isAdmin < 1) {
                    return done(null, false, { message: 'You are not admin!' });
                }else{
                return done(null, _bulunanUser);
            }}



        } catch (err) {
            console.log(err)
            return done(err)
        }



    }));


    passport.serializeUser(function (user, done) {

        console.log('Session kaydı başarılı ' + user.id);
        done(null, user.id);

    });

    passport.deserializeUser(function (id, done) {
        /*console.log('Session kaydı yapılan id bulundu');*/
        User.findById(id, function (err, user) {
            const yeniUser = {
                id:user.id,
                email: user.email,
                isim: user.isim
            }
            done(err, yeniUser);
        });
    });


}
/*test*/