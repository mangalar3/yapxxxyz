const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    kullaniciAdi: {
        type: String,
        required: [true, "Kullanıcı adı alanı boş olamaz"],
        trim: true,
        minlength: 2,
        maxlength: 15
    },
    isim:{
        type: String,
        required: [true, "Ad soyad boş olamaz"],
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    sifre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    telefon: {
        type: String,
        trim: true
    },
    userid: {
        type: String,
        trim: true
    },
    Admin_Photo: {
        type: String,

    },
    adres: {
        type: String,
        trim: true
    },
    isAdmin: {
        type: String,
        default: false
    },
   
}, { collection: 'globalAdmins', timestamps: true });

const Admin = mongoose.model('globalAdmins', UserSchema);

module.exports = Admin;