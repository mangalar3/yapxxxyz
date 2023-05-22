const mongoose = require('mongoose');
const fs = require('fs');
const { count } = require('console');
const Urun = require('../models/urunler');
const User = require('../models/yapxUserModel');
const Banner = require('../models/bannerModel');
const multer  = require('multer');
var bodyParser = require('body-parser');
var express = require('express');
const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
// GET
const showHomePage = async (req, res, next) => {

    try {
        const LoggedUser = await Admin.find({kullaniciAdi: req.cookies.loggeduser})
        res.render('admin/adminHomePage', { layout: '../layouts/adminHome_Layout', title: `Yapx | Admin Panel`, description: ``, keywords: ``,LoggedUser })


    } catch (err) {
        console.log(err);
    }
};
const charts = async (req, res, next) => {

    try {

        const LoggedUser = await Admin.find({kullaniciAdi: req.cookies.loggeduser})
        const productList = await Urun.find({ active: '1' }).limit(20).then(Product => {
            res.render('admin/charts', { layout: '../layouts/adminHome_Layout', title: `Yapx | Anasayfa`, description: ``, keywords: ``,Product,LoggedUser })
        })


    } catch (err) {
        console.log(err);
    }
};
const tables = async (req, res, next) => {

    try {
        const id = req.params.id
        const LoggedUser = await Admin.find({kullaniciAdi: req.cookies.loggeduser})
        const UserList = await User.find({ $and: [{ userid: id }] })
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


    } catch (err) {
        console.log(err);
    }
};
const tablesurun = async (req, res, next) => {

    try {
        if(req.query.pg){
            var Page = req.query.pg
        }
        else{
            var Page = 1
        }
        const LoggedUser = await Admin.find({kullaniciAdi: req.cookies.loggeduser})
        const UserList = await User.find({ $and: [{ userid: "3" }] })
        const BannerList = await Banner.find({active: "1"})
        const Urunler = await Urun.find({active: "1"}).skip((Number(Page)*20)-20).limit(20)
        for(let i = 0; i<Urunler.length ; i++){
            let avg = 0
            let totalstock = 0
            for(let x = 0; x<Urunler[i].product_seller.length; x++){
                avg = Number(Urunler[i].product_seller[x].price)+avg
                totalstock = Number(Urunler[i].product_seller[x].stock)+totalstock
            }
            avg = avg/Urunler[i].product_seller.length
            Urunler[i].avg = avg
            Urunler[i].totalstock = totalstock
        }
        res.render('admin/tablesurun', { layout: '../layouts/adminHome_Layout', title: `Ürün Ekleme`, description: ``, keywords: ``,UserList,LoggedUser,Urunler,BannerList})


    } catch (err) {
        console.log(err);
    }
};
const trafik = async (req, res, next) => {

    try {
        const LoggedUser = await Admin.find({kullaniciAdi: req.cookies.loggeduser})
        const UserList = await User.find({ $and: [{ userid: "3" }] })
        res.render('admin/trafik', { layout: '../layouts/adminHome_Layout', title: `Ürün Ekleme`, description: ``, keywords: ``,UserList,LoggedUser})


    } catch (err) {
        console.log(err);
    }
};
const panelmesajlar = async (req, res, next) => {

    try {
        const LoggedUser = await Admin.find({kullaniciAdi: req.cookies.loggeduser})
        const UserList = await User.find({ $and: [{ userid: "3" }] })
        res.render('admin/panelmesajlar', { layout: '../layouts/adminHome_Layout', title: `Ürün Ekleme`, description: ``, keywords: ``,UserList,LoggedUser})


    } catch (err) {
        console.log(err);
    }
};
const islemkullanici = async (req, res, next) => {

    try {
        const LoggedUser = await Admin.find({kullaniciAdi: req.cookies.loggeduser})
        const UserList = await Admin.find({ $and: [{ kullaniciAdi: req.cookies.loggeduser }] })
        res.render('admin/islemkullanici', { layout: '../layouts/adminHome_Layout', title: `Ürün Ekleme`, description: ``, keywords: ``,UserList,LoggedUser})


    } catch (err) {
        console.log(err);
    }
};


/* POST */
const urunsil = async (req, res, next) => {

    try {
        const test = req.params.urunsil
        console.log(test)
        const productList = await Urun.findOneAndDelete({ product_url: test })
        console.log('Ürün Başarı ile silindi!')
        res.redirect('/yapxadminlogin/tablesurun');
    } catch (err) {
        console.log(err);
    }
};
const adminEkle = async (req, res, next) => {

    try {
        const LoggedUser = await Admin.find({kullaniciAdi: req.cookies.loggeduser})
        res.render('admin/adminEkle', { layout: '../layouts/adminHome_Layout', title: `Admin Ekleme`, description: ``, keywords: ``,LoggedUser})


    } catch (err) {
        console.log(err);
    }
};
const urunekle = async (req, res, next) => {

    try {


        res.render('admin/urunekle', { layout: '../layouts/free', title: `Ürün Ekleme`, description: ``, keywords: `` })

    } catch (err) {
        console.log(err);
    }
};
const uruneklePost = async (req, res, next) => {
    console.log(req.body.subject.toString());
    const ekleyen = req.cookies.loggeduser;
    switch(req.body.subject.toString()){
        case 'Kaba & İnce Yapı':
            switch(req.body.topic.toString()){
                case 'Demir Grubu':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '1',
                            product_id2: '1',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,                            
                            urun_oysayisi: '1',                            
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_details1:req.body.product_details1, 
                            product_photo: [],
                                                        
                            active: '1',
                            urunuekleyen: ekleyen,      
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler,
                            
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Beton Grubu':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '1',
                            product_id2: '2',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Yalıtım Malzemeleri':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '1',
                            product_id2: '3',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Tuğla ve Blok Ürünleri':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '1',
                            product_id2: '4',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Çatı Malzemeleri':
                    try {
                        console.log(req.files.length)
                        const bilgiler = {
                            product_id: '1',
                            product_id2: '5',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,                                                         
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        
                        for(let i = 0;i < (req.files).length;i++){                             
                            bilgiler.product_photo.push(req.files[i].filename.toString())                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Sıva ve Harç Malzemeleri':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '1',
                            product_id2: '6',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Toz Alçı Grubu':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '1',
                            product_id2: '7',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Dolgu Malzemeleri':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '1',
                            product_id2: '8',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_photo: [],
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_details1:req.body.product_details1,     
                            product_photo: req.filess.filename,
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Alçı ve Alçıpan Grubu':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '1',
                            product_id2: '9',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Asma Tavan Grubu':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '1',
                            product_id2: '10',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Boya Grubu':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '1',
                            product_id2: '11',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Cephe Kaplama Ürünleri':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '1',
                            product_id2: '12',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Mantolama Ürünleri':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '1',
                            product_id2: '13',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
            }
        case 'Mobilya ve PVC Doğrama ':
            switch(req.body.topic.toString()){
                case 'İç Mekan Kapı Grubu':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '2',
                            product_id2: '1',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'İç Mekan Mobilya Grubu':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '2',
                            product_id2: '2',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Dış Cephe Kaplama Grubu':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '2',
                            product_id2: '3',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Zemin Kaplama ve Parke Grubu':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '2',
                            product_id2: '4',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Kapı Pencere Doğramaları':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '2',
                            product_id2: '5',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Korkuluklar':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '2',
                            product_id2: '6',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Açılır Kapanır Sistemler':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '2',
                            product_id2: '7',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Cam Grubu':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '2',
                            product_id2: '8',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
            }
        break;
        case 'Peyzaj ve Mermer Grubu':
            switch(req.body.topic.toString()){
                case 'Havuz Sistemleri':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '3',
                            product_id2: '1',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Bitki Grubu':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '3',
                            product_id2: '2',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Çit ve Bahçe Sistemleri':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '3',
                            product_id2: '3',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Doğal Taş ve Mermerler':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '3',
                            product_id2: '4',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
            }
        break;
        case 'Genel Hizmetler':
            switch(req.body.topic.toString()){
                case 'İş Makineleri':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '4',
                            product_id2: '1',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Nakliye':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '4',
                            product_id2: '2',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'İş Güvenliği':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '4',
                            product_id2: '3',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Yemek Hizmetleri':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '4',
                            product_id2: '4',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Temizlik Hizmetleri':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '4',
                            product_id2: '5',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Hammaliye':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '4',
                            product_id2: '6',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
            }
        break;
        case 'Elektrik ve Su Tesisatı':
            switch(req.body.topic.toString()) {
                case 'Temiz ve Pis Su Malzemeleri':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '5',
                            product_id2: '1',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Isıtma ve Soğutma Sistemleri':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '5',
                            product_id2: '2',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Vitrifiye ve Armatürler':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '5',
                            product_id2: '3',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Kablo ve Priz Grubu':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '5',
                            product_id2: '4',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Sigorta ve Pano Grubu':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '5',
                            product_id2: '5',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'TV ve Uydu Sistemleri':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '5',
                            product_id2: '6',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Aydınlatma Grubu':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '5',
                            product_id2: '7',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Güvenlik Sistemleri':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '5',
                            product_id2: '8',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Paratoner ve Topraklama Sistemleri':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '5',
                            product_id2: '9',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Mekanik Elektrik Sistemleri':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '5',
                            product_id2: '10',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
            }
        break;
        case 'Hırdavat ve Nalbur Grubu':
            switch(req.body.topic.toString()) {
                case 'El Aletleri':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '6',
                            product_id2: '1',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Vida ve Civata Grubu':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '6',
                            product_id2: '2',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Sulama Ekipmanları':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '6',
                            product_id2: '3',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Silikon ve Mastikler':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '6',
                            product_id2: '4',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                           
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Kapı ve Pencere Aksesuarları':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '6',
                            product_id2: '5',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
                case 'Hırdavat':
                    try {
                        console.log('test')
                        const bilgiler = {
                            product_id: '6',
                            product_id2: '6',
                            product_name: req.body.product_name,
                            product_marka: req.body.product_marka,
                            product_url: req.body.product_name+Math.floor(Math.random()* 1000000),
                            urun_yorum: 'Yapx: Bu ürün yorumlarınızı bekliyor.:5',
                            product_ozellik: req.body.product_ozellik,
                            urun_oysayisi: '1',
                            product_star: '5',
                            avarage: '5',
                            banner: Number(0),
                            product_category: req.body.subject,
                            product_category2: req.body.topic,
                            product_category3: req.body.chapter,
                            product_description: req.body.product_description,
                            stock_alert: req.body.stock_alert,
                            product_photo: [],
                            product_details1:req.body.product_details1,
                            product_details2:req.body.product_details2,
                            product_details3:req.body.product_details3,
                            product_details4:req.body.product_details4,                                           
                            active: '1',
                            urunuekleyen: ekleyen,         
                        }
                        for(let i = 0;i < (req.files).length;i++){                              
                            bilgiler.product_photo.push(req.files[i].filename)                           
                        }
                        console.log(bilgiler)
                        const newProduct = new Urun(
                            bilgiler
                        );
                        await newProduct.save();
                        res.redirect('../yapxadminlogin/urunekle');
                        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
                        
                    }
                    catch (err) {
                        console.log(err);
                    }
                break;
            }
        break;

    }
};
const bannerekle = async (req, res, next) => {

    try {
        const test = req.params.banner

        const productList = await Urun.find({ product_url: test })
        const id = productList[0]._id

        try{
            var banner ={
                banner: Number(1),
                bannerfoto: req.file.filename,
                bannerustyazi: req.body.bannerustyazi,
                banneryazi: req.body.banneryazi                   
            };
        }
        catch{
            var banner ={
                banner: Number(1),
                bannerfoto: productList[0].product_photo[0],
                bannerustyazi: req.body.bannerustyazi,
                banneryazi: req.body.banneryazi                   
            };
            }
        
        var modelBanner = {
            Banner_Title: req.body.bannerustyazi,
            Banner_Description: req.body.banneryazi,
            Banner_Product_Name: productList[0].product_name,
            Product_Url: productList[0].product_url,
            active: "1"            
        };

        const newUser = new Banner(
            modelBanner
        );
        await newUser.save();
        await Urun.findByIdAndUpdate(productList[0]._id, banner);
        res.redirect('/yapxadminlogin/tablesurun')
        }         
    catch (err) {
        console.log(err);
    }
};
const bannerkaldır = async (req, res, next) => {

    try {
        const test = req.params.banner2
        console.log(test)
        const productList = await Urun.find({ product_url: test })
        const id = productList[0]._id
        console.log(id)
        const banner ={
            banner: Number(0)              
        };
        
        const x = await Urun.findOneAndUpdate({product_url: test }, 
            {banner: Number(0)},);
        console.log(x)

        await Banner.findOneAndDelete({Banner_Product_Name: productList[0].product_name })
        res.redirect('/yapxadminlogin/tablesurun')
        }         
    catch (err) {
        console.log(err);
    }
};
const adminEklePost = async (req, res, next) => {
    try{
        const kullaniciAdi = req.body.username
        const isimsoyisim = req.body.isimsoyisim
        const email = req.body.email
        const userid = req.body.yetkiseviyesi
        const telefon = req.body.telefon
        const sifre = req.body.sifre
        const adres = req.body.adres
        const newUser = new Admin({
            kullaniciAdi: kullaniciAdi,
            isim: isimsoyisim,
            sifre: await bcrypt.hash(sifre, 8),
            email: email,
            userid: userid,
            Admin_Photo: 'test.png',
            telefon: telefon,
            adres: adres,
            isAdmin: '9'
        });
        await newUser.save();
        // expected output: "resolve"
        res.redirect('/yapxadminlogin/adminEkle')
    }
    catch (err){
        console.log(err)
    }
}
const EditStore = async (req,res,next) =>{
    try{
        const store = await User.find({Dukkan_UniqueID: req.query.id})
        if(req.body.status != 'Seçiniz'){
            if(req.body.status == 'Sil'){
                const DeletedUser = await User.find({ Dukkan_UniqueID: req.query.id })
                for(let i = 0;i<DeletedUser[0].dukkanurunleri.length;i++){
                    try{
                        const DukkanAdi = DeletedUser[0].dukkanurl
                        const UrunBul = await Urun.find({product_url: DeletedUser[0].dukkanurunleri[i].split(':')[0]}) 

                        for(let j = 0;j<UrunBul[0].product_seller.length;j++){
                            if(UrunBul[0].product_seller[j].split(':')[0] == DukkanAdi){
                                const newarray = UrunBul[0].product_seller[j].slice(j,1).concat(UrunBul[0].product_seller.slice(j+1));
                                const bilgiler = {
                                    product_seller : newarray
                                }
                                await Urun.findByIdAndUpdate(UrunBul[0]._id, bilgiler);
                            }
                        }
                    }
                    catch (err){
                        console.log(err)
                    }
                }
                await User.findOneAndDelete({ Dukkan_UniqueID: req.query.id })
            }
            else{
                const bilgiler  = {
                    User_Status: req.body.status
                }
                await User.findByIdAndUpdate(store[0]._id, bilgiler);
            }
        }
        if(req.body.userType != 'Seçiniz'){
            const bilgiler  = {
                userid: req.body.userType
            }
            await User.findByIdAndUpdate(store[0]._id, bilgiler);
        }
        if(req.body.GiveTime != ''){
            var now = new Date();
            if(store[0].User_GivenTime){
                const nowDate = new Date(Date.parse(store[0].User_GivenTime));
                now.setDate(nowDate.getDate() + Number(req.body.GiveTime));
                const bilgiler  = {
                User_GivenTime: now
            }
                await User.findByIdAndUpdate(store[0]._id, bilgiler);
            }
            else{
                now.setDate(now.getDate() + Number(req.body.GiveTime));
                const bilgiler  = {
                    User_GivenTime: now
                }
                await User.findByIdAndUpdate(store[0]._id, bilgiler);
            }
        }
        res.redirect('../yapxadminlogin/tables')
    }
    catch (err){
        console.log(err)
    }
}
const islemkullaniciPost = async (req, res, next) => {

    try {
        const LoggedUser = await Admin.find({kullaniciAdi: req.cookies.loggeduser})
        if(req.body.guncelsifre=='' && req.body.yenisifre=='' && req.body.yenisifreonay == ''){
            const new_informations = {
                isim : req.body.isim,
                email : req.body.email,
                telefon : req.body.telefon,
                adres : req.body.adres
            }
            await Admin.findByIdAndUpdate(LoggedUser[0]._id, new_informations);
        }
        
        res.redirect('../yapxadminlogin/islemkullanici')


    } catch (err) {
        console.log(err);
    }
};
const filtreKategori = async (req,res,next) => {
    try{
        if(req.body.chapter != ""){
            const LoggedUser = await Admin.find({kullaniciAdi: req.cookies.loggeduser})
            const UserList = await User.find({ $and: [{ userid: "3" }] })
            const BannerList = await Banner.find({active: "1"})
            const Urunler = await Urun.find({product_category3: req.body.chapter}).limit(20)
            for(let i = 0; i<Urunler.length ; i++){
                let avg = 0
                let totalstock = 0
                for(let x = 0; x<Urunler[i].product_seller.length; x++){
                    avg = Number(Urunler[i].product_seller[x].split(':')[2])+avg
                    totalstock = Number(Urunler[i].product_seller[x].split(':')[1])+totalstock
                }
                avg = avg/Urunler[i].product_seller.length
                Urunler[i].avg = avg
                Urunler[i].totalstock = totalstock
            }
            res.render('admin/tablesurun', { layout: '../layouts/adminHome_Layout', title: `Ürün Ekleme`, description: ``, keywords: ``,UserList,LoggedUser,Urunler,BannerList})
        }
        if(req.body.topic != ""){
            const LoggedUser = await Admin.find({kullaniciAdi: req.cookies.loggeduser})
            const UserList = await User.find({ $and: [{ userid: "3" }] })
            const BannerList = await Banner.find({active: "1"})
            const Urunler = await Urun.find({product_category2: req.body.topic}).limit(20)
            for(let i = 0; i<Urunler.length ; i++){
                let avg = 0
                let totalstock = 0
                for(let x = 0; x<Urunler[i].product_seller.length; x++){
                    avg = Number(Urunler[i].product_seller[x].split(':')[2])+avg
                    totalstock = Number(Urunler[i].product_seller[x].split(':')[1])+totalstock
                }
                avg = avg/Urunler[i].product_seller.length
                Urunler[i].avg = avg
                Urunler[i].totalstock = totalstock
            }
            res.render('admin/tablesurun', { layout: '../layouts/adminHome_Layout', title: `Ürün Ekleme`, description: ``, keywords: ``,UserList,LoggedUser,Urunler,BannerList})
        }
        else{
            const LoggedUser = await Admin.find({kullaniciAdi: req.cookies.loggeduser})
            const UserList = await User.find({ $and: [{ userid: "3" }] })
            const BannerList = await Banner.find({active: "1"})
            const Urunler = await Urun.find({product_category: req.body.subject}).limit(20)
            for(let i = 0; i<Urunler.length ; i++){
                let avg = 0
                let totalstock = 0
                for(let x = 0; x<Urunler[i].product_seller.length; x++){
                    avg = Number(Urunler[i].product_seller[x].split(':')[2])+avg
                    totalstock = Number(Urunler[i].product_seller[x].split(':')[1])+totalstock
                }
                avg = avg/Urunler[i].product_seller.length
                Urunler[i].avg = avg
                Urunler[i].totalstock = totalstock
            }
            res.render('admin/tablesurun', { layout: '../layouts/adminHome_Layout', title: `Ürün Ekleme`, description: ``, keywords: ``,UserList,LoggedUser,Urunler,BannerList})
        }
    }
    catch (err){
        console.log(err)
    }
}
const UrunAra = async (req,res,next) => {
    try{
        const LoggedUser = await Admin.find({kullaniciAdi: req.cookies.loggeduser})
        const UserList = await User.find({ $and: [{ userid: "3" }] })
        const BannerList = await Banner.find({active: "1"})
        const Urunler = await Urun.find({product_name: {"$regex": req.body.aranan, $options: 'i' }}).limit(20)
        for(let i = 0; i<Urunler.length ; i++){
            let avg = 0
            let totalstock = 0
            for(let x = 0; x<Urunler[i].product_seller.length; x++){
                avg = Number(Urunler[i].product_seller[x].split(':')[2])+avg
                totalstock = Number(Urunler[i].product_seller[x].split(':')[1])+totalstock
            }
            avg = avg/Urunler[i].product_seller.length
            Urunler[i].avg = avg
            Urunler[i].totalstock = totalstock
        }
        res.render('admin/tablesurun', { layout: '../layouts/adminHome_Layout', title: `Ürün Ekleme`, description: ``, keywords: ``,UserList,LoggedUser,Urunler,BannerList})
    }
    catch (err){

    }
}


module.exports = {
    showHomePage,
    tables,
    tablesurun,
    filtreKategori,
    trafik,
    panelmesajlar,
    charts,
    islemkullanici,
    UrunAra,
    adminEklePost,
    urunekle,
    urunsil,
    islemkullaniciPost,
    uruneklePost,
    adminEkle,
    bannerkaldır,
    bannerekle,
    EditStore
}