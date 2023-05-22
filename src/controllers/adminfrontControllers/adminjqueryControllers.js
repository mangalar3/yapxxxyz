const mongoose = require('mongoose');
const fs = require('fs');
const Urun = require('../../models/urunler');
const User = require('../../models/yapxUserModel');
const multer  = require('multer');
const Admin = require('../../models/adminModel');
// GET


const searchUser = async (req,res,next) => {
    try{
        if(req.body.sec == 'Kullanıcı Adına Göre'){
            if(req.body.SearchedUser[0] == 'i')
            {
                var SearchInput = req.body.SearchedUser.replace(req.body.SearchedUser[0],'İ')
            }
            if(req.body.SearchedUser[0] == 'ü')
            {
                var SearchInput = req.body.SearchedUser.replace(req.body.SearchedUser[0],'Ü')
            }
            if(req.body.SearchedUser[0] == 'ç')
            {
                var SearchInput = req.body.SearchedUser.replace(req.body.SearchedUser[0],'Ç')
            }
            if(req.body.SearchedUser[0] == 'ğ')
            {
                var SearchInput = req.body.SearchedUser.replace(req.body.SearchedUser[0],'Ğ')
            }
            if(req.body.SearchedUser[0] == 'ö')
            {
                var SearchInput = req.body.SearchedUser.replace(req.body.SearchedUser[0],'Ö')
            }
        const LoggedUser = req.cookies.loggeduser
        

        const UserList = await User.find({ dukkanadi: {"$regex": SearchInput, $options: 'i' }})
        for(let i = 0;i<UserList.length;i++){
            var dateString = UserList[i].User_GivenTime; // Örnek tarih string'i
            var tarih = new Date(Date.parse(dateString)); // Tarih nesnesi oluşturma
            var simdikiZaman = new Date(); // Şu anki zaman nesnesi oluşturma
            var farkMilisaniye = tarih.getTime() - simdikiZaman.getTime(); // Farkın milisaniye cinsinden hesaplanması
            var farkGun = Math.floor(farkMilisaniye / (1000 * 60 * 60 * 24)); // Farkın gün cinsine dönüştürülmesi
            if(farkGun>0){
                UserList[i].KalanSure = (farkGun+1).toString()+' Gün'
            }
            else{
                UserList[i].KalanSure = 'Süresi Dolmuş'
            }
        }
        res.render('admin/tables', { layout: '../layouts/adminHome_Layout', title: `Ürün Ekleme`, description: ``, keywords: ``,UserList,LoggedUser})
    }
    else{
        const LoggedUser = req.cookies.loggeduser
        var SearchInput = req.body.SearchedUser
        const UserList = await User.find({ email: {"$regex": SearchInput, $options: 'i' }})
        for(let i = 0;i<UserList.length;i++){
            var dateString = UserList[i].User_GivenTime; // Örnek tarih string'i
            var tarih = new Date(Date.parse(dateString)); // Tarih nesnesi oluşturma
            var simdikiZaman = new Date(); // Şu anki zaman nesnesi oluşturma
            var farkMilisaniye = tarih.getTime() - simdikiZaman.getTime(); // Farkın milisaniye cinsinden hesaplanması
            var farkGun = Math.floor(farkMilisaniye / (1000 * 60 * 60 * 24)); // Farkın gün cinsine dönüştürülmesi
            if(farkGun>0){
                UserList[i].KalanSure = (farkGun+1).toString()+' Gün'
            }
            else{
                UserList[i].KalanSure = 'Süresi Dolmuş'
            }
        }
        res.render('admin/tables', { layout: '../layouts/adminHome_Layout', title: `Ürün Ekleme`, description: ``, keywords: ``,UserList,LoggedUser})
    }
    }
    catch (err){
        console.log(err)

    }
}
const DeletePhoto = async (req,res,next) => {
    try{
        const FindUrun = await Urun.find({product_url: req.query.id})
        const productUrl = req.query.id;
        const indexFind = Number(req.query.index);
        const filter = { product_url: productUrl };
        const update = { $pull: { product_photo: FindUrun[0].product_photo[indexFind] } };
        const options = { new: true };

        await Urun.findOneAndUpdate(filter, update, options);
        fs.unlink('./public/uploads/images/'+FindUrun[0].product_category3+'/'+FindUrun[0].product_photo[indexFind], (err) => {
            if (err) throw err;
            console.log('Dosya silindi!');
          });
        res.redirect('../yapxadminlogin/tablesurun');

    }
    catch (err){
        console.log(err)
    }
}
const AddPhotoAdmin = async (req,res,next) => {
    try{
        
        const FindAdmin = await Admin.find({kullaniciAdi: req.cookies.loggeduser})
        const filename = req.file.filename
        const bilgiler = {
            Admin_Photo: filename
        }
        await Admin.findByIdAndUpdate(FindAdmin[0]._id, bilgiler);
        res.redirect('../yapxadminlogin/islemkullanici')
    }
    catch (err){
        console.log(err)
    }
}
module.exports = {
    searchUser,
    DeletePhoto,
    AddPhotoAdmin
}