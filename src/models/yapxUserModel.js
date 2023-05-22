const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    isim: {
        type: String,
        trim: true
    },
    soyisim:{
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    sifre: {
        type: String,
        trim: true
    },
    wishlist: {
        type: Array,
    },
    wishlist_Shop: {
        type: Array,
    },
    sabittelefon:{
        type: String,
    },
    gsmtelefon:{
        type: String,
    },
    faliyetalani:{
        type: String,
    },
    tckimlik:{
        type: String,
    },
    sirketunvani:{
        type: String,
    },
    user_id:{
        type: String,
    },
    sirketkurulustarihi:{
        type: String,
    },
    sirketadresi:{
        type: String,
    },
    vergidairesiili:{
        type: String,
    },
    vergikimliknumarasi:{
        type: String,
    },
    vergidairesi:{
        type: String,
    },
    dukkanadi:{
        type: String,
    },
    dukkanurunleri:{
        type: Array,
    },
    userid:{
        type: String,
    },
    verfication_number: {
        type: String,
        trim: true
    },
    dogrulama_token:{
        type: String,
        trim: true
    },
    banner:{
        type: String,
    },
    usertoken: {
        type: String,
        trim: true
    },
    dukkanurl:{
        type:String,
    },
    Dukkan_UniqueID:{
        type:String,
    },
    Messages_List:{
        type:Array,
    },
    dukkanphoto:{
        type:String
    },
    dukkanili:{
        type:String
    },
    dukkanilcesi:{
        type:String
    },
    dukkanyorum:{
        type:Array
    },
    dukkanoysayisi:{
        type:String
    },
    dukkan_star:{
        type:Array
    },
    Meslek_Projects:{
        type:Array
    },
    Meslek_Referances:{
        type:Array
    },
    Meslek_About:{
        type:String
    },
    Meslek_Adres:{
        type:String
    },
    Meslek_Thumbnails:{
        type: Array
    },
    Meslek_Photos:{
        type: Array
    },
    dukkan_av:{
        type:String
    },
    User_Status:{
        type:String
    },
    User_GivenTime:{
        type:String
    },
    Unreaded_MessageCount: {
        type:Number,
        default: 0,
    }
    
   
}, { collection: 'kullanicilar',locale: 'tr', timestamps: true });

const User = mongoose.model('kullanicilar', UserSchema);

module.exports = User;