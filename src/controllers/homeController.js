const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/yapxUserModel');
const Urun = require('../models/urunler');
const Marka = require('../models/markaModel');
const Messages = require('../models/messagesModel');
const Categories = require('../models/Categories');
const bcrypt = require('bcryptjs');
const fs = require('fs');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
// GET
const homeYonlendirme = async(req,res,next) => {
    res.redirect('/anasayfa')

};
const homeShow = async (req, res, next) => {
    try {
        
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        const banner = await Urun.find({ banner: '1' }).sort( { timestamp : -1 } ).limit(50);
        const productList = await Urun.find({ active: '1' }).sort( { timestamp : -1 } ).skip(Math.random() * 7000).limit(50)
        const encokoyalanurunler = []  
        const encokarananurunler = []     
        const oy = await Urun.find( { urun_oysayisi: { $gt: 1 } } ).sort( { timestamp : -1 } ).limit(25)    
        const aranan = await Urun.find( { tiklanmasayisi: { $gt: 1 } } ).sort( { timestamp : -1 } ).limit(25)   
        for(let i=oy.length;i>(oy.length)-7;i--){
            if(oy[i]==undefined){

            }
            else{
                encokoyalanurunler.push(oy[i])
            }
        }
        for(let i=aranan.length;i>(aranan.length)-21;i--){
            if(aranan[i]==undefined){

            }
            else{
                encokarananurunler.push(aranan[i])
            }
        }    
        const urunler = []
        const urunler2 = []
        const urunler3 = []
        const urunler4 = []
        const urunler5 = []
        for(let i=0;i<6;i++){
            urunler.push(productList[i])
        }     
        for(let i=0;i<4;i++){
            urunler2.push(productList[i])
            urunler3.push(productList[i+4])
            urunler4.push(productList[i+8])
        }    
        for(let i=0;i<12;i++){
            urunler5.push(productList[i])
        }
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {               
                res.render('user/anasayfa', { layout: '../layouts/logged', title: `Yapx | Anasayfa`, description: ``, keywords: ``,banner,urunler,urunler2,urunler3,urunler4,urunler5,myacc,encokoyalanurunler,encokarananurunler })            
              
            } else {               
                res.render('user/anasayfa', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Anasayfa`, description: ``, keywords: ``,banner,urunler,urunler2,urunler3,urunler4,urunler5,myacc,encokoyalanurunler,encokarananurunler })                
            }
        })


    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const dortyuzdort = async (req, res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {               
                res.render('user/404', { layout: '../layouts/logged', title: `Yapx | 404`, description: ``, keywords: `` })
            } else {
                res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | 404`, description: ``, keywords: `` })
            }
        })

    
    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const mesajlarim = async (req, res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        const array = myacc[0].Messages_List;
        const reversedArray = array.reverse();

        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {               
                res.render('user/mesajlarim', { layout: '../layouts/logged', title: `Yapx | Mesajlar`, description: ``, keywords: `` ,myacc,reversedArray})
            } else {
                res.render('user/giris', { layout: '../layouts/login', title: `Yapx | Giriş`, description: ``, keywords: `` })
            }
        })

    
    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const messagePage = async (req,res,next) => {
    try{
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        const messages = await Messages.find({ Message_ID: req.query.id });
        const array = messages[0].Message_Content;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {           
                if(messages[0].Message_Creater == myacc[0].email || messages[0].Message_Receiver == myacc[0].email){
                    if(messages[0].Message_Creater == myacc[0].email){
                        var UserInfo = await User.find({email: messages[0].Message_Receiver})
                    }
                    else{
                        var UserInfo = await User.find({email: messages[0].Message_Creater})
                    }
                    const arr = myacc[0].Messages_List
                    const index = arr.findIndex(item => item.includes(req.query.id));
                    if (index !== -1) { // eğer öğe bulunduysa
                        // Mesaj Gönderilen
                        const kontrolEdilecekEleman = arr[index]
                        const kontrolEdilecekElemanArray = kontrolEdilecekEleman.split('?:?:?');
                        if(kontrolEdilecekElemanArray[7] == "1"){
                            await User.findByIdAndUpdate(myacc[0]._id, {Unreaded_MessageCount: myacc[0].Unreaded_MessageCount-1});
                        }
                        kontrolEdilecekElemanArray[7] = "0";
                        const yeniEleman = kontrolEdilecekElemanArray.join('?:?:?');
                        arr[index] = yeniEleman
                        const bilgiler = {
                            Messages_List: arr,                      
                        }
                        await User.findByIdAndUpdate(myacc[0]._id, bilgiler);
                        if(messages[0].Last_Sender != myacc[0].email){
                            await Messages.findByIdAndUpdate(messages[0]._id,{is_Opened: "True"})
                        }
                        
                    }
                    
                    res.render('user/messagePage', { layout: '../layouts/logged', title: `Yapx | Mesajlar`, description: ``, keywords: `` ,myacc,messages,array,UserInfo})
                }
                else{
                    res.redirect('/anasayfa')
                }
            } else {
                res.render('user/giris', { layout: '../layouts/login', title: `Yapx | Giriş`, description: ``, keywords: `` })
            }
        })
    }
    catch (err){
        console.log(err)
    }
}
const kurumsalregister = async (req, res, next) => {
    try {

        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                res.redirect('/');
              
            } else {
                res.render('user/kurumsalhesap', { layout: '../layouts/login', title: `Yapx | Kurumsal Kayıt`, description: ``, keywords: `` })
            }
        })

    

    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const isteklistesi = async (req, res, next) => {
    try {
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        let jwtSecretKey = process.env.JWT_SECRET_KEY;      
        const wishlist = myacc[0].wishlist  
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                res.render('user/isteklistesi', { layout: '../layouts/logged', title: `Yapx | İstek Listesi`, description: ``, keywords: ``,wishlist,myacc })
            } else {
                res.render('user/giris', { layout: '../layouts/login', title: `Yapx | Giriş Yap`, description: ``, keywords: `` })
            }
        })

    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const arama = async (req, res, next) => {
    try {
        if(req.params.arama==undefined){
            var sayfano = 1
            
        }
        else{
            var sayfano = req.params.arama
            
        }
        if(req.query.aranan==undefined){
            var aranan = req.body.arama
            if(req.body.arama[0] == 'i')
            {
                var aranan = req.body.arama.replace(req.body.arama[0],'İ')
            }
            if(req.body.arama[0] == 'ü')
            {
                var aranan = req.body.arama.replace(req.body.arama[0],'Ü')
            }
            if(req.body.arama[0] == 'ç')
            {
                var aranan = req.body.arama.replace(req.body.arama[0],'Ç')
            }
            if(req.body.arama[0] == 'ğ')
            {
                var aranan = req.body.arama.replace(req.body.arama[0],'Ğ')
            }
            if(req.body.arama[0] == 'ö')
            {
                var aranan = req.body.arama.replace(req.body.arama[0],'Ö')
            }
        }
        else{
            var aranan = req.query.aranan
        }
        
        res.clearCookie('arama');  
        res.cookie('arama', aranan, { expires: new Date(Date.now() + 900000) });
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        let sayfaurunleri = []
        let sayfalar = []
        const list = []
        let arananurun = aranan.split(' ')
        let aranans = []
        for(let i = 0;i<arananurun.length;i++){
            let aranankelime = {
                product_name: {"$regex": arananurun[i], $options: 'i' }
            }
            aranans.push(aranankelime)
        }
        console.log(req.query.searchKey)
        if(req.body.dukkanveyaurun=='urunara' || req.query.searchKey=="urun")
        {
            res.clearCookie('aranan');
            res.cookie('aranan','urunara', {expires: new Date(Date.now() + 900000)})
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    const productList = await Urun.find({$or: [ {product_marka:{"$regex": aranan, $options: 'i' } },{product_category2:{"$regex": aranan, $options: 'i' } },{product_category3:{"$regex": aranan, $options: 'i' } },{$and: aranans} ]}).sort( { timestamp : -1 } ).then(Product => { 
                        const toplamsayfa = parseInt(Product.length/20)+1
                        for(let sayfasayisi = 0+(20*sayfano)-20;sayfasayisi<sayfano*20;sayfasayisi++){
                            if(Product[sayfasayisi]!=undefined){
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for(i=0;i<toplamsayfa;i++){
                            sayfalar.push('/aramasayfa/'+'urunara/'+req.body.arama+':'+(i+1)+':'+sayfano)
                        }                    
                        for(let i =0;i<Product.length;i++){
                            list.push((Product[i].product_marka).toString())
                        }       
                        const filteredkategorilist2 = [...new Set(list)]   
                        for(let i =0;i<filteredkategorilist2.length;i++){
                            const count = Product.filter(element => element.product_marka === filteredkategorilist2[i]).length;
                            filteredkategorilist2[i] = filteredkategorilist2[i]+':'+count
                        }
                        res.render('user/arama', { layout: '../layouts/logged', title: `Yapx | Arama`, description: ``, keywords: ``,Product,myacc,sayfaurunleri,sayfalar,filteredkategorilist2,aranan })
                    })
                  
                } else {
                    const productList = await Urun.find({$or: [ {product_marka:{"$regex": aranan, $options: 'i' } },{product_category2:{"$regex": aranan, $options: 'i' } },{product_category3:{"$regex": aranan, $options: 'i' } },{$and: aranans} ]}).sort( { timestamp : -1 } ).then(async Product => {
                        const toplamsayfa = parseInt(Product.length/20)+1
                        for(let sayfasayisi = 0+(20*sayfano)-20;sayfasayisi<sayfano*20;sayfasayisi++){
                            if(Product[sayfasayisi]!=undefined){
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for(i=0;i<toplamsayfa;i++){
                            sayfalar.push('/aramasayfa/'+'urunara/'+req.body.arama+':'+(i+1)+':'+sayfano)
                        }
                        for(let i =0;i<Product.length;i++){
                            list.push((Product[i].product_marka).toString())
                        }       
                        const filteredkategorilist2 = [...new Set(list)] 
                        for(let i =0;i<filteredkategorilist2.length;i++){
                            const count = Product.filter(element => element.product_marka === filteredkategorilist2[i]).length;
                            filteredkategorilist2[i] = filteredkategorilist2[i]+':'+count
                        }
                        res.render('user/arama', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Arama`, description: ``, keywords: ``,Product,sayfaurunleri,sayfalar,filteredkategorilist2,aranan })
                    })
                }
            })
        }
        else{
            res.clearCookie('aranan');
            res.cookie('aranan','dukkanara', {expires: new Date(Date.now() + 900000)})
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    const productList = await User.find({ dukkanadi: {"$regex": aranan, $options: 'i' } }).then(Product => {
                        const filteredkategorilist2 = ['1']
                        const toplamsayfa = parseInt(Product.length/20)+1
                        for(let sayfasayisi = 0+(20*sayfano)-20;sayfasayisi<sayfano*20;sayfasayisi++){
                            if(Product[sayfasayisi]!=undefined){
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for(i=0;i<toplamsayfa;i++){
                            sayfalar.push('/aramasayfa/'+'dukkanara/'+req.body.arama+':'+(i+1)+':'+sayfano)
                        } 
                        res.render('user/dukkanarama', { layout: '../layouts/logged', title: `Yapx | Arama`, description: ``, keywords: ``,Product,myacc,sayfaurunleri,sayfalar,filteredkategorilist2,aranan })
                    })
                  
                } else {
                    const productList = await User.find({ dukkanadi: {"$regex": aranan, $options: 'i' } }).then(Product => {
                        const filteredkategorilist2 = ['1']
                        const toplamsayfa = parseInt(Product.length/20)+1
                        for(let sayfasayisi = 0+(20*sayfano)-20;sayfasayisi<sayfano*20;sayfasayisi++){
                            if(Product[sayfasayisi]!=undefined){
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for(i=0;i<toplamsayfa;i++){
                            sayfalar.push('/aramasayfa/'+'dukkanara/'+aranan+':'+(i+1)+':'+sayfano)
                        } 
                        res.render('user/dukkanarama', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Arama`, description: ``, keywords: ``,Product,sayfaurunleri,sayfalar,filteredkategorilist2,aranan })
                    })
                }
            })
        }
        
    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const aramasayfa = async (req, res, next) => {
    try {
        if(req.params.ara==undefined){
            var sayfano = 1
        }
        else{
            var sayfano = Number(req.params.ara.split(':')[1])
        }
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        let sayfalar = []
        const list = []
        const myacc = await User.find({ usertoken: token });
        let sayfaurunleri = []
        let arananurun = req.params.ara.split(':')[0].split(' ')
        let aranans = []
        for(let i = 0;i<arananurun.length;i++){
            let aranankelime = {
                product_name: {"$regex": arananurun[i], $options: 'i' }
            }
            aranans.push(aranankelime)
        }
        if(req.params.aramasayfa=='urunara')
        {
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    const productList = await Urun.find({$or: [ {product_marka:{"$regex": req.params.ara.split(':')[0], $options: 'i' } },{product_category2:{"$regex": req.params.ara.split(':')[0], $options: 'i' } },{product_category3:{"$regex": req.params.ara.split(':')[0], $options: 'i' } },{$and: aranans} ]}).sort( { timestamp : -1 } ).then(Product => {
                        const toplamsayfa = parseInt(Product.length/20)+1
                        for(let sayfasayisi = 0+(20*sayfano)-20;sayfasayisi<sayfano*20;sayfasayisi++){
                            if(Product[sayfasayisi]!=undefined){
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for(i=0;i<toplamsayfa;i++){
                            sayfalar.push('/aramasayfa/'+'urunara/'+req.body.arama+':'+(i+1)+':'+sayfano)
                        }                        
                        res.render('user/arama', { layout: '../layouts/logged', title: `Yapx | Arama`, description: ``, keywords: ``,Product,myacc,sayfaurunleri,sayfalar })
                    })
                  
                } else {
                    const productList = await Urun.find({$or: [ {product_marka:{"$regex": req.params.ara.split(':')[0], $options: 'i' } },{product_category2:{"$regex": req.params.ara.split(':')[0], $options: 'i' } },{product_category3:{"$regex": req.params.ara.split(':')[0], $options: 'i' } },{$and: aranans} ]}).sort( { timestamp : -1 } ).then(Product => {
                        const toplamsayfa = parseInt(Product.length/20)+1
                        for(let sayfasayisi = 0+(20*sayfano)-20;sayfasayisi<sayfano*20;sayfasayisi++){
                            if(Product[sayfasayisi]!=undefined){
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for(i=0;i<toplamsayfa;i++){
                            sayfalar.push('/aramasayfa/'+'urunara/'+req.params.ara.split(':')[0]+':'+(i+1)+':'+sayfano)
                        }                
                        for(let i =0;i<Product.length;i++){
                            list.push((Product[i].product_marka).toString())
                        }       
                        const filteredkategorilist2 = [...new Set(list)]    
                        res.render('user/arama', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Arama`, description: ``, keywords: ``,Product,sayfaurunleri,sayfalar,filteredkategorilist2 })
                    })
                }
            })
        }
        else{
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    const productList = await User.find({ dukkanadi: {"$regex": req.body.arama, $options: 'i' } }).then(Product => {
                        const toplamsayfa = parseInt(Product.length/20)+1
                        for(let sayfasayisi = 0+(20*sayfano)-20;sayfasayisi<sayfano*20;sayfasayisi++){
                            if(Product[sayfasayisi]!=undefined){
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for(i=0;i<toplamsayfa;i++){
                            sayfalar.push('/aramasayfa/'+'urunara/'+req.body.arama+':'+(i+1)+':'+sayfano)
                        } 
                        res.render('user/arama', { layout: '../layouts/logged', title: `Yapx | Arama`, description: ``, keywords: ``,Product,myacc,sayfaurunleri,sayfalar })
                    })
                  
                } else {
                    const productList = await User.find({ dukkanadi: {"$regex": req.body.arama, $options: 'i' } }).then(Product => {
                        const toplamsayfa = parseInt(Product.length/20)+1
                        for(let sayfasayisi = 0+(20*sayfano)-20;sayfasayisi<sayfano*20;sayfasayisi++){
                            if(Product[sayfasayisi]!=undefined){
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for(i=0;i<toplamsayfa;i++){
                            sayfalar.push('/aramasayfa/'+'urunara/'+req.body.arama+':'+(i+1)+':'+sayfano)
                        } 
                        res.render('user/arama', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Arama`, description: ``, keywords: ``,Product,sayfaurunleri,sayfalar })
                    })
                }
            })
        }
        
    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const sifremiunuttum = async (req, res, next) => {
    try {

        res.render('user/sifremiunuttum', { layout: '../layouts/login', title: `Şifremi Unuttum`, description: ``, keywords: `` })


    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const sifremiunuttumcode = async (req, res, next) => {
    try {

        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                res.render('user/HomePage', { layout: '../layouts/logged', title: `Yapx | Giriş`, description: ``, keywords: `` })
            } else {
                res.render('user/sifremiunuttumcode', { layout: '../layouts/login', title: `Yapx | Giriş`, description: ``, keywords: `` })
            }
        })

    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const kayitolcodeget = async (req, res, next) => {
    try {

        
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                res.render('user/HomePage', { layout: '../layouts/logged', title: `Yapx | Giriş`, description: ``, keywords: `` })
            } else {
                res.render('user/kayitolcode', { layout: '../layouts/login', title: `Yapx | Kayit Ol`, description: ``, keywords: `` })
            }
        })

    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const MeslekKayitol = async (req,res,next) =>{
    try{
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                res.redirect('/')
            } else {
                res.render('user/MeslekKayitol', { layout: '../layouts/login', title: `Yapx | Kayıt Ol`, description: ``, keywords: `` })
            }
        })
    }
    catch (err){
        console.log(err)
    }
}
const meslekPage = async (req,res,next) => {
    try{
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {               
                res.render('user/meslekPage', { layout: '../layouts/logged', title: `Yapx | Mesajlar`, description: ``, keywords: `` ,myacc})
            } else {
                res.render('user/giris', { layout: '../layouts/login', title: `Yapx | Giriş`, description: ``, keywords: `` })
            }
        })

    }
    catch (err){
        console.log(err)
    }
}
const meslekSettings = async (req,res,next) => {
    try{
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {               
                res.render('user/meslekSettings', { layout: '../layouts/logged', title: `Yapx | Meslek Ayarları`, description: ``, keywords: `` ,myacc})
            } else {
                res.render('user/giris', { layout: '../layouts/login', title: `Yapx | Giriş`, description: ``, keywords: `` })
            }
        })
    }
    catch (err){
        console.log(err)
    }
}
const kayitolcodepost = async (req, res, next) => {
    try {
        const dogrulamakodu = await User.find({ dogrulama_token: req.cookies.dogrulamatoken })
        const SifreVarmi = await User.find( dogrulamakodu[0]);
          console.log(SifreVarmi)
            const Sifrelegal = SifreVarmi[0].verfication_number;
            console.log(Sifrelegal)
        if(Sifrelegal==req.body.code){
            const data = {
                time: Date(),
                email: SifreVarmi[0].email,
                }
            const jwtToken = jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: '1d' }); 
             
            res.clearCookie('usertoken');  
            res.cookie('usertoken', jwtToken, { expires: new Date(Date.now() + 900000000) });
            const token = ('usertoken', jwtToken);
            const numberdb = {
                usertoken: token
              }
            const uyeBilgileri = await User.find({ dogrulama_token: req.cookies.dogrulamatoken })
            await User.findByIdAndUpdate(uyeBilgileri[0]._id, numberdb);
            res.clearCookie('dogrulamatoken');
            console.log('Hesap Başarı ile oluşturuldu.')
            res.redirect('/')
        }
        else{
            console.log('Sifre Yanlis')
        }
    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const giris = async (req, res, next) => {
    try {

        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                res.redirect('/');
            } else {
                res.render('user/giris', { layout: '../layouts/login', title: `Yapx | Giriş`, description: ``, keywords: `` })
            }
        })

    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const kayitol = async (req, res, next) => {
    try {

        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                res.redirect('/')
            } else {
                res.render('user/kayitol', { layout: '../layouts/login', title: `Yapx | Kayıt Ol`, description: ``, keywords: `` })
            }
        })

    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` })
    }
};
const urundetaylari = async (req, res, next) => {
    try {
        const params = req.params.urunno;
        const urunss = []
        const urunler = []
        const Product = await Urun.find({ product_url: params}).sort( { timestamp : -1 } );
        let uruns = await Urun.find({ product_category2: Product[0].product_category2}).limit(10);
        for(let i=0;i<6;i++){   
            if(uruns[i]!=undefined){        
                urunss.push(uruns[i])   
            }        
        }     
        for(let i=0; i < Product[0].product_seller.length;i++){
            const urun = await User.find({dukkanurl: Product[0].product_seller[i].seller_url})
            urun.push(Product[0].product_seller[i].price)
            urun.push(Product[0].product_seller[i].stock)
            if(urun == ![] || urun[i] == undefined){
            }
            else{
                urunler.push(urun)
            }
        }
        const satansayisi = urunler.length
        const ozellik = Product[0].product_ozellik.split(/\r?\n/);
        const urunno = req.params.urunno;      
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const star = Product[0].product_star
        let starav = 0
        for(let i = 0; i < star.length; i++){
                starav = Number(star[i]) + Number(starav)
        }
        let avarage = Math.ceil(starav/star.length);
        const av = {
            avarage: avarage,
        }
        await Urun.findByIdAndUpdate(Product[0]._id, av);
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        if(myacc.length == 0){
            myacc[0] = {
                userid: "0"
            }
        }
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                if(Product[0].tiklanmasayisi){
                    var uruntiklanmasayisi ={
                        tiklanmasayisi: (Product[0].tiklanmasayisi)+1
                    }
                    
                }
                else{
                    var uruntiklanmasayisi ={
                        tiklanmasayisi: 1
                    }
                }
                await Urun.findByIdAndUpdate(Product[0]._id, uruntiklanmasayisi);
                const productList = await Urun.find({ product_url: urunno }).then(Product => {
                    const urun_yorum = Product[0].urun_yorum
                    
                    res.render('user/urunpage', { layout: '../layouts/logged', title: `Yapx | Urun Sayfasi`, description: ``, keywords: ``,Product,urun_yorum,avarage,urunler,urunss,myacc,ozellik,satansayisi })
                })
            } else {
                    const urun_yorum = Product[0].urun_yorum
                    res.render('user/urunpage', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Urun Sayfasi`, description: ``, keywords: ``,Product,urun_yorum,avarage,urunler,urunss,ozellik,satansayisi,myacc })
    }})


    } catch (err) {
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` })
        console.log(err);
    }
};
const hakkimizda = async (req, res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        const banner = await Urun.find({ banner: '1' });
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                const productList = await Urun.find({ active: '1' }).then(Product => {
                    res.render('user/hakkimizda', { layout: '../layouts/logged', title: `Yapx | Hakkımızda`, description: ``, keywords: ``,Product,myacc })
                })
              
            } else {
                const productList = await Urun.find({ active: '1' }).then(Product => {
                res.render('user/hakkimizda', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hakkımızda`, description: ``, keywords: ``,Product })
                })
            }
        })


    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const dukkanlar = async (req, res, next) => {
    try {
        if((await User.find({ dukkanurl: req.params.dukkanlar}))==''){
            res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
        }
        else{
            let jwtSecretKey = process.env.JWT_SECRET_KEY;
            const params = req.params.dukkanlar;
            let urunler = []
            const test = await User.find({ dukkanurl: params});
            for(let i=0; i <= test[0].dukkanurunleri.length;i++){ 
                try{            
                    let urun = await Urun.find({product_url: test[0].dukkanurunleri[i].product_url})
                    if(urun == ![] || urun[0] == undefined){
                    }
                    else{
                        urun.push(test[0].dukkanurunleri[i].price)
                        urun.push(test[0].dukkanurunleri[i].stock)
                        urunler.push(urun)
                    }
                }
                catch{
                }               
            }
            const dukkanno = req.params.dukkanlar;      
            const productList2 = await User.find({ dukkanurl: dukkanno })
            const star = productList2[0].dukkan_star
            let starav = 0
            for(let i = 0; i < star.length; i++){
                    starav = Number(star[i]) + Number(starav)
            }
            let avarage = Math.ceil(starav/star.length);
            const av = {
                dukkan_av: avarage,
            }
            const x = await User.findByIdAndUpdate(productList2[0]._id, av);
            const token = req.cookies.usertoken;
            const myacc = await User.find({ usertoken: token });
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    if(myacc[0].dukkanurl==req.params.dukkanlar){
                        const productList = await User.find({ dukkanurl: params}).then(Product => {
                            const Dukkan_RegisterDate = Product[0].createdAt
                            const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
                            const formatted_Dukkan_RegisterDate = new Date(Dukkan_RegisterDate).toLocaleDateString('tr-TR', dateOptions); 
                            const dukkanyorum = productList2[0].dukkanyorum
                            const countByBrand = Product[0].dukkanurunleri.reduce((count, product) => {
                                count[product.product_brand] = (count[product.product_brand] || 0) + 1;
                                return count;
                              }, {});
                              
                            console.log(countByBrand);
                            res.render('user/benimdukkanim', { layout: '../layouts/logged', title: `Yapx | `+myacc[0].dukkanadi, description: ``, keywords: ``,Product,urunler,dukkanyorum,myacc,formatted_Dukkan_RegisterDate,countByBrand })
                        })
                    }
                    else{
                    const productList = await User.find({ dukkanurl: params}).then(Product => {
                        const Dukkan_RegisterDate = Product[0].createdAt
                        const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
                        const formatted_Dukkan_RegisterDate = new Date(Dukkan_RegisterDate).toLocaleDateString('tr-TR', dateOptions); 
                        const dukkanyorum = productList2[0].dukkanyorum
                        const countByBrand = Product[0].dukkanurunleri.reduce((count, product) => {
                            count[product.product_brand] = (count[product.product_brand] || 0) + 1;
                            return count;
                          }, {});
                        res.render('user/dukkanlar', { layout: '../layouts/logged', title: `Yapx | Hakkımızda`, description: ``, keywords: ``,Product,urunler,dukkanyorum,myacc,formatted_Dukkan_RegisterDate,countByBrand })
                    })
                }
                
                } else {
                    const productList = await User.find({ dukkanurl: params }).then(Product => {  
                        const Dukkan_RegisterDate = Product[0].createdAt
                        const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
                        const formatted_Dukkan_RegisterDate = new Date(Dukkan_RegisterDate).toLocaleDateString('tr-TR', dateOptions);  
                        const dukkanyorum = productList2[0].dukkanyorum  
                        const countByBrand = Product[0].dukkanurunleri.reduce((count, product) => {
                            count[product.product_brand] = (count[product.product_brand] || 0) + 1;
                            return count;
                          }, {});                 
                        res.render('user/dukkanlar', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hakkımızda`, description: ``, keywords: ``,Product,urunler,dukkanyorum,formatted_Dukkan_RegisterDate,countByBrand })
                    })
                }
            })
        }

    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const hesabim = async (req, res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        const banner = await User.find({ usertoken: token });
        if(banner[0].userid=='1'){
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    const productList = await User.find({ usertoken: token }).then(Product => {
                        res.render('user/hesabim', { layout: '../layouts/logged', title: `Yapx | Hakkımızda`, description: ``, keywords: ``,Product,myacc })
                    })
                
                } else {
                    const productList = await Urun.find({ usertoken: token }).then(Product => {
                    res.render('user/homePage', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hakkımızda`, description: ``, keywords: ``,Product,myacc })
                    })
                }
            })
    }
        else{
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    const productList = await User.find({ usertoken: token }).then(Product => {
                        res.render('user/kurumsalhesabim', { layout: '../layouts/logged', title: `Yapx | Hakkımızda`, description: ``, keywords: ``,Product,myacc })
                    })
                
                } else {
                    const productList = await Urun.find({ usertoken: token }).then(Product => {
                    res.render('user/homePage', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hakkımızda`, description: ``, keywords: ``,Product })
                    })
                }
            })
        }


    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const kategoriler = async (req, res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        
        var kategori = req.params.kategoriler;
        var sayfanumarasi = req.query.pg
        const paramss = Number(sayfanumarasi)
        console.log(sayfanumarasi)
        if(typeof sayfanumarasi == "undefined"){
            kategorisayfa = 0 
            sayfanumarasi = 0
        }    
        else{
            kategorisayfa = (sayfanumarasi*20)-20
        }
        const Product = await Urun.find({ product_category3: {"$regex": kategori, $options: 'i' } }).sort( { timestamp : -1 } ).skip(kategorisayfa).limit(20); 
        const kategorilist = await Categories.find({ product_category2: Product[0].product_category2 })
        const list = []
        const filteredkategorilist = []
        for(let i=0;i<kategorilist[0].product_category3.length;i++){
            filteredkategorilist.push(kategorilist[0].product_category3[i]+':'+await Urun.count({product_category3: kategorilist[0].product_category3[i]}))
        }
        var MarkaSayisi = await Marka.find({Category_Name3: kategori})
        const BrandList = MarkaSayisi[0].Brands
        const yazi = (Product[0].product_category3+':'+Product[0].product_category2+':'+Product[0].product_category3);
        const test1 = []
        test1.push(yazi)
        const urunsayisi = await Urun.count({ product_category3: kategori })
        const sayfalar = []
        for(let i=0;i<parseInt(urunsayisi/20)+1;i++){
            sayfalar.push(kategori.split('?pg=')[0]+'?pg='+(i+1))
        }
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                    res.render('user/kategori', { layout: '../layouts/logged', title: `Yapx | Kategoriler`, description: ``, keywords: ``,Product,test1,myacc,filteredkategorilist,sayfalar,urunsayisi,paramss,BrandList })
               
            } else {
                    
                    res.render('user/kategori', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Kategoriler`, description: ``, keywords: ``,Product,test1,filteredkategorilist,sayfalar,urunsayisi,paramss,BrandList })
            }
        })


    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const kategori = async (req, res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        const kategori = req.params.kategori;
        const paramss = Number(sayfanumarasi)
        var sayfanumarasi = req.query.pg
        if(typeof sayfanumarasi == "undefined"){
            kategorisayfa = 0 
            sayfanumarasi = 0
        }    
        else{
            kategorisayfa = (sayfanumarasi*20)-20
        }
        const Product = await Urun.find({ product_category2: {"$regex": kategori, $options: 'i' } }).sort( { timestamp : -1 } ).skip(kategorisayfa).limit(20);   
        const kategorilist = await Categories.find({ product_category2: Product[0].product_category2 })
        const list = []
        const filteredkategorilist = []
        for(let i=0;i<kategorilist[0].product_category3.length;i++){
            filteredkategorilist.push(kategorilist[0].product_category3[i]+':'+await Urun.count({product_category3: kategorilist[0].product_category3[i]}))
        }  
        var MarkaSayisi = await Marka.find({Category_Name2: kategori})
        const BrandList = MarkaSayisi[0].Brands
        const yazi = (Product[0].product_category2+':'+Product[0].product_category2+':'+Product[0].product_category3);
        const test1 = []
        test1.push(yazi)
        console.log(test1[0])
        const urunsayisi = await Urun.count({ product_category2: kategori })
        const sayfalar = []
        for(let i=0;i<parseInt(urunsayisi/20)+1;i++){
            sayfalar.push(kategori.split('?pg=')[0]+'?pg='+(i+1))
        }   
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                const yazi = Product[0]
                    res.render('user/kategori', { layout: '../layouts/logged', title: `Yapx | Kategoriler`, description: ``, keywords: ``,Product,test1,myacc,filteredkategorilist,sayfalar,urunsayisi,paramss,BrandList })
              
            } else {
                const yazi = Product[0]
                res.render('user/kategori', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Kategoriler`, description: ``, keywords: ``,Product,test1,filteredkategorilist,sayfalar,urunsayisi,paramss,BrandList })
            }
        })


    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const anakategori = async (req, res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        const kategori = req.params.kategori;
        const paramss = Number(sayfanumarasi)
        var sayfanumarasi = req.query.pg
        if(typeof sayfanumarasi == "undefined"){
            kategorisayfa = 0 
            sayfanumarasi = 0
        }    
        else{
            kategorisayfa = (sayfanumarasi*20)-20
        }
        if(kategori== "KABA & İNCE YAPI"){
            var duzgunkategori = "Kaba & İnce Yapı"
            var Product = await Urun.find({ product_category: {"$regex": duzgunkategori, $options: 'i' } }).sort( { timestamp : -1 } ).skip(kategorisayfa).limit(20);
            var kategorilist = await Categories.find({ product_category: "KABA & İNCE YAPI" })
            var MarkaSayisi = await Marka.find({Category_Name: duzgunkategori})
        }
        else{
            var Product = await Urun.find({ product_category: {"$regex": kategori, $options: 'i' } }).sort( { timestamp : -1 } ).skip(kategorisayfa).limit(20); 
            var kategorilist = await Categories.find({ product_category: kategori })
            var MarkaSayisi = await Marka.find({Category_Name: kategori})
        } 
        const list = []
        const filteredkategorilist = []
        for(let i=0;i<kategorilist.length;i++){
            filteredkategorilist.push(kategorilist[i].product_category2+':'+await Urun.count({product_category2: kategorilist[i].product_category2}))
        }  
        const BrandList = MarkaSayisi[0].Brands
        const yazi = (Product[0].product_category+':'+Product[0].product_category+':'+Product[0].product_category);
        const test1 = []
        test1.push(yazi)
        console.log(test1[0].split(':')[0]+test1[0].split(':')[2])
        const urunsayisi = await Urun.count({ product_category2: kategori })
        const sayfalar = []
        for(let i=0;i<parseInt(urunsayisi/20)+1;i++){
            sayfalar.push(kategori.split('?pg=')[0]+'?pg='+(i+1))
        }   
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                const yazi = Product[0]
                res.render('user/kategori', { layout: '../layouts/logged', title: `Yapx | Kategoriler`, description: ``, keywords: ``,Product,test1,myacc,filteredkategorilist,sayfalar,urunsayisi,paramss,BrandList })
              
            } else {
                const yazi = Product[0]
                res.render('user/kategori', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Kategoriler`, description: ``, keywords: ``,Product,test1,filteredkategorilist,sayfalar,urunsayisi,paramss,BrandList })
            }
        })


    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const urunekle2 = async (req,res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        const banner = await User.find({ usertoken: token });
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded && banner[0].userid=='3') {
                    const productList = await User.find({ usertoken: token }).then(Product => {
                        res.render('user/uruneklerim', { layout: '../layouts/logged', title: `Yapx | Dükkan Ürün Ekle`, description: ``, keywords: ``,Product,myacc })
                    })
                
                } else {
                    
                    res.redirect('/')
                    
                }
            })
        }
    catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const urunekleurun = async (req, res, next) => {
    try {
        const pg = req.query.pg
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const x = req.params.urunkategori
        console.log(x)
        let StoreProduct = []
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        let StoreProducts = []

        for(let i=0; i <= myacc[0].dukkanurunleri.length;i++){ 
            try{            
                let urun = await Urun.find({product_url: myacc[0].dukkanurunleri[i].product_url})

                if(urun == ![] || urun[0] == undefined){
                }
                else{
                    urun.push(myacc[0].dukkanurunleri[i].price)
                    urun.push(myacc[0].dukkanurunleri[i].stock)
                    StoreProducts.push(urun)
                    StoreProduct.push(myacc[0].dukkanurunleri[i].product_url)
                }
            }
            catch{
            }               
        }
        var cg = req.query.cg == 1 ? '' : req.query.cg;
        const category = "product_category"+cg
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded && myacc[0].userid=='3') {
                    const ProductCount = await Urun.count({ [category]: x, product_url: { $nin: StoreProduct }  })
                    const productList = await Urun.find({ [category]: x, product_url: { $nin: StoreProduct }  }).skip((pg*20)-20).limit(20).then(Product => {
                        
                        res.render('user/urunekleurun', { layout: '../layouts/logged', title: `Yapx | Dükkan Ürün Ekle`, description: ``, keywords: ``,Product,myacc,StoreProducts,ProductCount })
                    })
                
                } else {
                    
                    res.redirect('/giris')
                    
                }
            })
        }
    catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const urunekleArama = async (req,res,next) => {
    try{

        const pg = req.query.pg
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const x = req.query.q
        const brand = req.query.b
        let StoreProduct = []
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        let StoreProducts = []

        for(let i=0; i <= myacc[0].dukkanurunleri.length;i++){ 
            try{            
                let urun = await Urun.find({product_url: myacc[0].dukkanurunleri[i].product_url})

                if(urun == ![] || urun[0] == undefined){
                }
                else{
                    urun.push(myacc[0].dukkanurunleri[i].price)
                    urun.push(myacc[0].dukkanurunleri[i].stock)
                    StoreProducts.push(urun)
                    StoreProduct.push(myacc[0].dukkanurunleri[i].product_url)
                }
            }
            catch{
            }               
        }

        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded && myacc[0].userid=='3') {
                    const ProductCount = await Urun.count({$and: [{product_name:{"$regex": x, $options: 'i' }},{product_marka:{"$regex": brand, $options: 'i' }}] , product_url: { $nin: StoreProduct }  })
                    const productList = await Urun.find({$and: [{product_name:{"$regex": x, $options: 'i' }},{product_marka:{"$regex": brand, $options: 'i' }}], product_url: { $nin: StoreProduct }  }).skip((pg*20)-20).limit(20).then(Product => {
                        
                        res.render('user/urunekleurun', { layout: '../layouts/logged', title: `Yapx | Dükkan Ürün Ekle`, description: ``, keywords: ``,Product,myacc,StoreProducts,ProductCount })
                    })
                
                } else {
                    
                    res.redirect('/giris')
                    
                }
            })
    }
    catch (err){
        console.log(err)
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};



// POST
const urunbul = async (req, res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        console.log(req.body)
        const banner = await User.find({ usertoken: token });
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded && banner[0].userid=='3') {
                    const productList = await User.find({ usertoken: token }).then(Product => {
                        if(req.body.chapter != ""){
                            res.redirect('/urunekle/'+req.body.chapter+'?'+"cg=3&pg=1")
                        }
                        if(req.body.chapter == "" && req.body.topic != ""){
                            res.redirect('/urunekle/'+req.body.topic+'?'+"cg=2&pg=1")
                        }
                        if(req.body.topic == "" && req.body.subject != ""){
                            res.redirect('/urunekle/'+req.body.subject+'?'+"cg=1&pg=1")
                        }
                        if(req.body.subject == "" && req.body.topic == "" && req.body.chapter == ""){
                            res.redirect('/urunekle')
                        }
                    })
                
                } else {
                    
                    res.redirect('/')
                    
                }
            })
        }
    catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const urunbulv2 = async (req, res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;

        const banner = await User.find({ usertoken: token });
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded && banner[0].userid=='3') {
                    const productList = await User.find({ usertoken: token }).then(Product => {
                        
                        res.redirect('/urunekleArama?q='+req.body.aranan+'&b='+req.body.brand+'&pg=1')
                    })
                
                } else {
                    
                    res.redirect('/')
                    
                }
            })
        }
    catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const isteklistesiadd = async (req, res, next) => {
    try{
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const isteklistesi = req.params.istek;
        const uyeBilgileri = await User.find({usertoken: token});


        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                    const ProductFind = await Urun.findOne({product_url: isteklistesi})
                    const star ={
                        $push: {
                            wishlist: ProductFind                  
                        },
                      }
                    console.log(star)
                    await User.findByIdAndUpdate(uyeBilgileri[0]._id, star);
                    next();              
            } else {
                res.render('user/giris', { layout: '../layouts/login', title: `Yapx | Giriş Yap`, description: ``, keywords: `` })
            }
        })
        
    }
    catch{
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const kayitolpost = async (req, res, next) => {
    try {
        const uyeVarMi = await User.count({ email: req.body.email });
        if(uyeVarMi>0){
            console.log('Bu üye sistemde var!');
            res.redirect('/giris');
        }
        else{

            const bilgiler = {
                isim: req.body.isim,
                user_id: Date.now()+(Math.random() * 10000),
                soyisim: req.body.soyisim,
                email: req.body.email,
                User_Status: 'Aktif',
                wishlist: [],
                sifre: await bcrypt.hash(req.body.sifre, 10),
                userid: '1',
                verfication_number: 's',    
            }
         
            const yenikullanici = new User(
                bilgiler
            );
            await yenikullanici.save();
            console.log(req.body.isim+' başarı ile veritabanına eklendi.')
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'izzeteminn@gmail.com',
                  pass: 'ejxgjnpqlnuohsyl'
                }
              });
              const data = {
                time: Date(),
                email: req.body.email,
                }
              const jwtToken = jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: '1d' }); 
              res.clearCookie('dogrulamatoken');  
              res.cookie('dogrulamatoken', jwtToken, { expires: new Date(Date.now() + (10 * 365 * 24 * 60 * 60)) });
              const token = ('dogrulamatoken', jwtToken);
              console.log(token)
              const uyeVarMi = await User.count({ email: req.body.email });
              if(uyeVarMi>0){
              const number = Math.floor(Math.random() * 1000000) + 99999;
              const numberdb = {
                verfication_number: number,
                dogrulama_token: token
              }
              const uyeBilgileri = await User.find({ email: req.body.email })
                await User.findByIdAndUpdate(uyeBilgileri[0]._id, numberdb);
              var mailOptions = {
                from: 'izzeteminn@gmail.com',
                to: req.body.email,
                subject: ('Verification Code is: '+number),
                text: ('Verification Code is: '+number)
              };
              console.log(number)
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                  
                }
                res.render('user/kayitolcode', { layout: '../layouts/login', title: `Yapx | Doğrulama Kodu`, description: ``, keywords: `` })
              });
        }
    }

        }
    
    catch (err) {
        console.log(err);
    }
};
const kurumsalpost = async (req, res, next) => {
    try {
        console.log(req.body)
        const uyeVarMi = await User.count({ email: req.body.email });
        console.log(uyeVarMi)
        if(uyeVarMi>0){
            console.log('Bu üye sistemde var!');
            res.redirect('/giris');
        }
        else{
            if(req.body.sifre == req.body.sifretekrar){
                const bilgiler = {
                    dukkanadi: req.body.Dükkan_Adı,
                    email: req.body.email,
                    wishlist: [],
                    sifre: await bcrypt.hash(req.body.sifre, 10), 
                    verfication_number: 's',  
                    sabittelefon: req.body.Sabit_telefon,
                    dukkanyorum: 'Yapx: Bu dükkan yorumlarınızı bekliyor.:5',
                    dukkanili: req.body.Iller,
                    dukkanilcesi: req.body.Ilceler,
                    gsmtelefon: req.body.GSM_telefon,
                    faliyetalani: req.body.Faaliyet_alanı,
                    tckimlik: req.body.Tc_kimlikno,
                    sirketunvani: req.body.sirket_unvanı,
                    sirketkurulustarihi: req.body.sirket_kurulus_tarihi,
                    sirketadresi: req.body.sirket_adresi,
                    vergidairesiili: req.body.Vergi_Dairesiili,
                    dukkan_star: '5',
                    dukkan_av: '5',
                    dukkanoysayisi: '1',
                    dukkanurunleri: [],
                    dukkanphoto: 'test.png',
                    User_Status: 'Pasif',
                    vergikimliknumarasi: req.body.Vergi_kimlikno,
                    vergidairesi: req.body.Vergi_dairesi,
                    Dukkan_UniqueID: 'Yapx_'+Date.now()+(Math.random() * 100),
                    userid: '3',
                    usertoken: '',
                    dukkanurl: Math.floor(Math.random()* 1000000),
                }
            
                const yenikullanici = new User(
                    bilgiler
                );
                await yenikullanici.save();
                console.log(req.body.dukkanadi+' başarı ile veritabanına eklendi.')   
            }
            else{

            }
            res.redirect('/giris');    
        }
    } 
    catch (err) {
        console.log(err);
    }
};
const loginUser = async (req, res, next) => {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    const gelenSifre = req.body.sifre

    try {
        const uyeVarMi2 = await User.count({ email: req.body.email });
        // Üye Varmı Kontrol Et  
        if(uyeVarMi2>0){
            const uyeVarMi = await User.find({ email: req.body.email });
            const Sifrelegal = uyeVarMi[0].sifre;
            const token = uyeVarMi[0].usertoken;
            // Varsa ve Bireysel Kullanıcıysa email doğrulamış mı kontrol et
            if(token==null){
                if(uyeVarMi[0].userid=='1'){
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                        user: 'izzeteminn@gmail.com',
                        pass: 'ejxgjnpqlnuohsyl'
                        }
                    });
                    const data = {
                        time: Date(),
                        email: req.body.email,
                        }
                    const jwtToken = jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: '1d' }); 
                    res.clearCookie('dogrulamatoken');  
                    res.cookie('dogrulamatoken', jwtToken, { expires: new Date(Date.now() + 900000) });
                    const token = ('dogrulamatoken', jwtToken);
                    const number = Math.floor(Math.random() * 1000000) + 99999;
                    const numberdb = {
                    verfication_number: number,
                    dogrulama_token: token
                    }
                    const uyeBilgileri = await User.find({ email: req.body.email })
                    await User.findByIdAndUpdate(uyeBilgileri[0]._id, numberdb);
                    var mailOptions = {
                    from: 'izzeteminn@gmail.com',
                    to: req.body.email,
                    subject: ('Verification Code is: '+number),
                    text: ('Verification Code is: '+number)
                    };
                    
                    transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        
                    }
                    res.render('user/kayitolcode', { layout: '../layouts/login', title: `Yapx | Doğrulama Kodu`, description: ``, keywords: `` })   
                    });
                }
                else{
                    res.redirect('../giris/')
                }
            }
            // Doğruladıysa İşlemler
            else{
                const isMatch = await bcrypt.compare(gelenSifre, uyeVarMi[0].sifre);
                // Hesap Durumu Aktif mi Pasif mi ve Şifresi doğru mu diye kontrol et
                if(isMatch && uyeVarMi[0].User_Status == "Aktif"){
                    // Bireysel Kullanıcı Değilse Kalan Süresini Kontrol Et
                    if(uyeVarMi[0].userid != '1'){
                        if(uyeVarMi[0].User_GivenTime){
                            var dateString = uyeVarMi[0].User_GivenTime; // Örnek tarih string'i
                            var tarih = new Date(Date.parse(dateString)); // Tarih nesnesi oluşturma
                            var simdikiZaman = new Date(); // Şu anki zaman nesnesi oluşturma
                            var farkMilisaniye = tarih.getTime() - simdikiZaman.getTime(); // Farkın milisaniye cinsinden hesaplanması
                            var farkGun = Math.floor(farkMilisaniye / (1000 * 60 * 60 * 24)); // Farkın gün cinsine dönüştürülmesi
                            // Kalan Süresi 0'dan Büyük İse Giriş Hakkı Ver
                            if(farkGun>0){
                                const jwtToken = token;
                                res.clearCookie('usertoken');
                                res.cookie('usertoken', jwtToken, { expires: new Date(Date.now() + 9000000) });
                                const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                                    if (decoded) {
                                        console.log('login basarili');   
                                        res.redirect('/')
                                    }
                                    else{
                                        const data = {
                                            time: Date(),
                                            email: req.body.email,
                                            }
                                        const jwtToken = jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });                         
                                        res.clearCookie('usertoken');  
                                        res.cookie('usertoken', jwtToken, { expires: new Date(Date.now() + 900000000) });
                                        const token = ('usertoken', jwtToken);
                                        const numberdb = {
                                            usertoken: token
                                        }
                                        const uyeBilgileri = await User.find({ email: req.body.email })
                                        await User.findByIdAndUpdate(uyeBilgileri[0]._id, numberdb);
                                        console.log('yeni token:'+numberdb)
                                        console.log('login basarili');   
                                        res.redirect('/')
                                    }
                                })
                            }
                            // Süresi Bitmişse Anasayfaya Gönder ve Para Ödeyin Kısmını Getir req.flash yazılcak
                            else{
                                console.log('et')
                                req.flash('validation_error', [{ msg: 'Hesabınızın Süresi Bitmiştir Lütfen Yöneticiye Ulaşınız.' }]);
                                res.redirect('../giris')
                            }
                        }
                        // Eğer Süresi Tanımlanmamış ama aktifse Admine Yazsın
                        else{
                            
                            res.redirect('/giris')
                        }
                    }
                    // Bireysel Kullanıcı ise Token Süresinin Bitip Bitmediğini Kontrol et Bittiyse Yeni Token Oluşturup Login Yaptır
                    else{
                        const jwtToken = token;
                        res.clearCookie('usertoken');
                        res.cookie('usertoken', jwtToken, { expires: new Date(Date.now() + 9000000) });
                        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                            if (decoded) {
                                console.log('login basarili');   
                                res.redirect('/')
                            }
                            else{
                                const data = {
                                    time: Date(),
                                    email: req.body.email,
                                    }
                                const jwtToken = jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });                         
                                res.clearCookie('usertoken');  
                                res.cookie('usertoken', jwtToken, { expires: new Date(Date.now() + 900000000) });
                                const token = ('usertoken', jwtToken);
                                const numberdb = {
                                    usertoken: token
                                }
                                const uyeBilgileri = await User.find({ email: req.body.email })
                                await User.findByIdAndUpdate(uyeBilgileri[0]._id, numberdb);
                                console.log('yeni token:'+numberdb)
                                console.log('login basarili');   
                                res.redirect('/')
                            }
                        })
                    }
                }
                else{
                    res.locals.tUserlogin_error = req.flash('tUserlogin_error', 'Şifrenizi Hatalı Girdiniz.');
                    res.redirect('/giris')
                }
            }
        }
        else{
            res.locals.tUserlogin_error = req.flash('tUserlogin_error', 'Böyle bir kullanıcı bulunamadı.');
            res.redirect('/giris')
        }
                }
            
     catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }

};
const sifremiunuttumPost = async (req, res, next) => {
    try {
        
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'izzeteminn@gmail.com',
              pass: 'ejxgjnpqlnuohsyl'
            }
          });
          const data = {
            time: Date(),
            email: req.body.email,
            }
            res.clearCookie('dogrulamatoken'); 
          const jwtToken = jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: '1d' }); 
          res.clearCookie('dogrulamatoken');  
          res.cookie('dogrulamatoken', jwtToken, { expires: new Date(Date.now() + 900000) });
          const token = ('dogrulamatoken', jwtToken);
          console.log(token)
          const uyeVarMi = await User.count({ email: req.body.email });
          if(uyeVarMi>0){
          const number = Math.floor(Math.random() * 1000000) + 99999;
          console.log(number)
          const numberdb = {
            verfication_number: number,
            dogrulama_token: token
          }
          const uyeBilgileri = await User.find({ email: req.body.email })
            await User.findByIdAndUpdate(uyeBilgileri[0]._id, numberdb);
          var mailOptions = {
            from: 'izzeteminn@gmail.com',
            to: req.body.email,
            subject: ('Verification Code is: '+number),
            text: ('Verification Code is: '+number)
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
              
            }
            res.render('user/sifremiunuttumcode', { layout: '../layouts/login', title: `Yapx | Giriş`, description: ``, keywords: `` })
          });
        }
        else{
            console.log('Böyle hesap yok')
            res.redirect('/kayitol')
        }
    } catch (err) {
        console.log(err);
    }
};
const sifremiunuttumcodePost = async (req, res, next) => {
    try {
        
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'izzeteminn@gmail.com',
              pass: 'ejxgjnpqlnuohsyl'
            }
          });
          const token = req.cookies.dogrulamatoken;
          const uyeVarMi = await User.find({ dogrulama_token: token });
          const SifreVarmi = await User.find( uyeVarMi[0]);
          console.log(token)
            const Sifrelegal = SifreVarmi[0].verfication_number;
            console.log(Sifrelegal)
            if(Sifrelegal==req.body.code){
                var mailOptions = {
                    from: 'izzeteminn@gmail.com',
                    to: SifreVarmi[0].email,
                    subject: ('Yapx Şifre Sıfırlama: '+SifreVarmi[0].isim),
                    text: ('Şifren: '+SifreVarmi[0].sifre)
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                      
                    }
                    res.render('user/giris', { layout: '../layouts/login', title: `Yapx | Giriş`, description: ``, keywords: `` })
                  });
            }
            else{
                console.log('bok')
                res.redirect('/sifremiunuttumcode')
            }
        }
     catch (err) {
        console.log(err);
    }
};
const yorumekle = async (req,res,next) =>{
    try{
        const urunno = req.params.urun;
        console.log(urunno)
        const uyeBilgileri = await Urun.find({product_url: urunno})
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                const uyeBilgileri2 = await User.find({usertoken: token});
                if(uyeBilgileri2[0].userid=='3'){
                var numberdb = {
                    $push: {urun_yorum: (uyeBilgileri2[0].dukkanadi+':'+req.body.yorum+':'+req.body.rating)},
                    
                  }
                }
                else{
                    var numberdb = {
                        $push: {urun_yorum: (uyeBilgileri2[0].isim+':'+req.body.yorum+':'+req.body.rating)},
                        
                      }
                    }
                  const star ={
                    $push: {product_star: (req.body.rating)},
                    urun_oysayisi: Number(uyeBilgileri[0].urun_oysayisi)+1,
                  }
                  console.log(uyeBilgileri[0])
                  await Urun.findByIdAndUpdate(uyeBilgileri[0]._id, numberdb);
                  await Urun.findByIdAndUpdate(uyeBilgileri[0]._id, star);
                  res.redirect('/urunler/'+uyeBilgileri[0].product_url)
            } else {
                res.render('user/giris', { layout: '../layouts/login', title: `Yapx | Kayıt OL`, description: ``, keywords: `` })
    }})
        
    }
    catch{
        console.log(err)
    }
};
const yorumekle2 = async (req,res,next) =>{
    try{
        const urunno = req.params.dukkan;
        const uyeBilgileri = await User.find({dukkanurl: urunno})
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                const uyeBilgileri2 = await User.find({usertoken: token});
                if(uyeBilgileri2[0].userid=='3'){
                var numberdb = {
                    $push: {dukkanyorum: (uyeBilgileri2[0].dukkanadi+':'+req.body.yorum+':'+req.body.rating)},
                    
                  }
                }
                else{
                    var numberdb = {
                        $push: {dukkanyorum: (uyeBilgileri2[0].isim+':'+req.body.yorum+':'+req.body.rating)},
                        
                      }
                    }
                  const star ={
                    $push: {dukkan_star: (req.body.rating)},
                    dukkanoysayisi: Number(uyeBilgileri[0].dukkanoysayisi)+1,
                  }
                  await User.findByIdAndUpdate(uyeBilgileri[0]._id, numberdb);
                  await User.findByIdAndUpdate(uyeBilgileri[0]._id, star);
                  res.redirect('/dukkanlar/'+uyeBilgileri[0].dukkanurl)
            } else {
                res.render('user/giris', { layout: '../layouts/login', title: `Yapx | Kayıt OL`, description: ``, keywords: `` })
    }})
        
    }
    catch{
        console.log(err)
    }
};
const sifreyidegistir = async (req,res,next) => {
    try{
        const token = req.cookies.usertoken;
        const sifre = await User.find({ usertoken: token });
        const id = sifre[0]._id
        console.log(req.file)
        if(req.file != undefined){
            const sifre ={
                dukkanphoto: req.file.filename              
            };
            
            await User.findByIdAndUpdate(id, sifre);
            console.log('photo degisti')
        }
        else{}
        if(sifre[0].sifre==req.body.guncelsifre && req.body.yenisifre==req.body.yenisifreonay){
            const sifre ={
                sifre: req.body.yenisifre              
            };
            
            await User.findByIdAndUpdate(id, sifre);
            console.log('sifre değişti')
        }
        else{}
        if(req.body.isim != ''){
            const isim ={
                isim: req.body.isim              
            };
            await User.findByIdAndUpdate(id, isim);
        }
        else{}
        if(req.body.soyisim != ''){
            const soyisim ={
                soyisim: req.body.soyisim              
            };
            await User.findByIdAndUpdate(id, soyisim);
        }
        else{}
        res.redirect('../hesabim')
    }
    catch(err){
        console.log(err)
    }
};
const dukkanaekle = async (req, res, next) => {
    try {
        const { usertoken: token } = req.cookies;
        const { fiyat: price, url: kod, stok } = req.body;

        const banner = await Urun.findOne({ product_url: kod });      
        const seller = await User.findOne({ usertoken: token });

        if (!banner || !seller) {
            return res.status(400).json({ error: 'Invalid product or seller' });
        }
        const product = {
            product_url: kod,
            product_title: banner.product_name,
            product_avarage: banner.avarage,
            product_hype: banner.tiklanmasayisi,
            product_category3: banner.product_category3,
            product_photo: banner.product_photo[0],
            seller_City: seller.dukkanili,
            seller_Town: seller.dukkanilcesi,
            product_brand: banner.product_marka,
            seller_url: seller.dukkanurl,
            seller_Name: seller.dukkanadi,
            stock: stok,
            price: price,
            stock: stok
        };

        const productExists = seller.dukkanurunleri.some(p => p.product_url === kod);
        const result = banner.product_seller.filter(product => product.price < price).length > 0;
        if(!result){
            const minPrice ={
                Product_MinimumPrice: Number(price)
            }
            await Urun.findByIdAndUpdate(banner._id, minPrice);
        }
        if (productExists) {
            return res.status(400).json({ error: 'Product already exists in store' });
        }

        const storeProduct = {
            ...product,
            createdAt: new Date()
        };

        const userUpdate = {
            $push: { dukkanurunleri: storeProduct }
        };

        const bannerUpdate = {
            $push: { product_seller: { ...product } }
        };

        await User.findByIdAndUpdate(seller._id, userUpdate);
        await Urun.findByIdAndUpdate(banner._id, bannerUpdate);

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
const DukkanaEkleV2forAtTheUrunPage = async (req, res, next) => {
    try {
        const token = req.cookies.usertoken;
        const price = req.body.fiyat;
        const kod = req.body.url;
        const stok = req.body.stok;
        var banner = await Urun.find({ product_url: kod });      
        var uyeBilgileri2 = await User.find({usertoken: token});
        var arr = uyeBilgileri2[0].dukkanurunleri;
        const result = arr.some(obj => obj.url === banner[0].product_url.toString());
        if(!result){
          const dukkanurl = uyeBilgileri2[0].dukkanurl;
          const numberdb = {
            $push: {
              dukkanurunleri: {
                product_url: banner[0].product_url,
                product_title: banner[0].product_name,
                product_avarage: banner[0].avarage,
                product_hype: banner[0].tiklanmasayisi,
                seller_City: uyeBilgileri2[0].dukkanili,
                product_category3: banner[0].product_category3,
                product_photo: banner[0].product_photo[0],
                seller_Town: uyeBilgileri2[0].dukkanilcesi,
                product_brand: banner[0].product_marka,
                seller_Name: uyeBilgileri2[0].dukkanadi,
                stock: stok,
                seller_url: uyeBilgileri2[0].dukkanurl,
                price: price,
                stock: stok
              }
            }
          };
          const star ={
            $push: {
              product_seller: {
                product_url: banner[0].product_url,
                product_title: banner[0].product_title,
                product_avarage: banner[0].avarage,
                product_hype: banner[0].tiklanmasayisi,
                seller_City: uyeBilgileri2[0].dukkanili,
                seller_Town: uyeBilgileri2[0].dukkanilcesi,
                product_brand: banner[0].product_marka,
                stock: stok,
                seller_url: uyeBilgileri2[0].dukkanurl,
                price: price,
                stock: stok
              }
            }
          };
          const result = banner[0].product_seller.filter(product => product.price < price).length > 0;

          if(!result){
            const minPrice ={
                Product_MinimumPrice: Number(price)
            }
            await Urun.findByIdAndUpdate(banner[0]._id, minPrice);
            }
          await User.findByIdAndUpdate(uyeBilgileri2[0]._id, numberdb);
          await Urun.findByIdAndUpdate(banner[0]._id, star);
          res.redirect('/dukkanlar/'+uyeBilgileri2[0].dukkanurl);
        } else {
          res.redirect('/dukkanlar/'+uyeBilgileri2[0].dukkanurl);
        }
      } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
      }
      
}; 
const urunuduzenle = async (req,res,next) => {
    const token = req.cookies.usertoken;
    const uyeBilgileri2 = await User.find({usertoken: token});
    const urun = await Urun.find({ product_url: req.params.url });
    const iduser = uyeBilgileri2[0]._id
    const idurun = urun[0]._id
    const array = []
    const array2 = []
    /*kullanicinin sattigi urunlerde degisiklik */
    for(let i = 0;i < uyeBilgileri2[0].dukkanurunleri.length;i++){
        if(uyeBilgileri2[0].dukkanurunleri[i].product_url ==req.params.url){
            uyeBilgileri2[0].dukkanurunleri[i] = (urun[0].product_url+':'+req.body.fiyat+':'+req.body.stok)           
        }
        array.push(uyeBilgileri2[0].dukkanurunleri[i])
    }
    const yeniarray = {
        dukkanurunleri: array
    }
    await User.findByIdAndUpdate(iduser, yeniarray);
    /*urundeki satanlardaki degisiklik */
    for(let i = 0;i < urun[0].product_seller.length;i++){
        if(urun[0].product_seller[i].seller_url ==uyeBilgileri2[0].dukkanurl){
            urun[0].product_seller[i] = (uyeBilgileri2[0].dukkanurl+':'+req.body.fiyat+':'+req.body.stok)           
        }
        array2.push(urun[0].product_seller[i])
    }
    const yeniarray2 = {
        product_seller: array2
    }
    await Urun.findByIdAndUpdate(idurun, yeniarray2);
    res.redirect('/dukkanlar/'+uyeBilgileri2[0].dukkanurl);

};
const urunukaldir = async(req,res,next) => {
    const token = req.cookies.usertoken;
    var uyeBilgileri2 = await User.find({usertoken: token});
    var urun = await Urun.find({ product_url: req.params.url });
    try{
        var iduser = uyeBilgileri2[0]._id
    }
    catch{
        res.redirect('/giris/');
    }
    const idurun = urun[0]._id
    const array = []
    const array2 = []
    /*kullanicinin sattigi urunlerde degisiklik */
    for(let i = 0;i < uyeBilgileri2[0].dukkanurunleri.length;i++){
        if(uyeBilgileri2[0].dukkanurunleri[i].product_url==req.params.url){
            uyeBilgileri2[0].dukkanurunleri.splice(i,1)           
        }
        else{
            array.push(uyeBilgileri2[0].dukkanurunleri[i])
        }
    }
    const yeniarray = {
        dukkanurunleri: array
    }
    await User.findByIdAndUpdate(iduser, yeniarray);
    /*urundeki satanlardaki degisiklik */
    for(let i = 0;i < urun[0].product_seller.length;i++){
        if(urun[0].product_seller[i].seller_url==uyeBilgileri2[0].dukkanurl){
            urun[0].product_seller.splice(i,1)            
        }
        else{
            array2.push(urun[0].product_seller[i])
        }
    }
    const yeniarray2 = {
        product_seller: array2
    }
    await Urun.findByIdAndUpdate(idurun, yeniarray2);
    res.redirect('/dukkanlar/'+uyeBilgileri2[0].dukkanurl);






};
const urunukaldirv2 = async(req,res,next) => {
    try{
        const token = req.cookies.usertoken;
        var uyeBilgileri2 = await User.find({usertoken: token});
        var urun = await Urun.find({ product_url: req.body.url });

        try{
            var iduser = uyeBilgileri2[0]._id
        }
        catch{
            res.redirect('/giris/');
        }
        const idurun = urun[0]._id
        const array = []
        const array2 = []

        const updatedProducts = uyeBilgileri2[0].dukkanurunleri.filter(product => {
            return product.product_url !== req.body.url;
          });
          
          const yeniarray = {
            dukkanurunleri: updatedProducts
          };
          
          await User.findByIdAndUpdate(iduser, yeniarray);
          
          urun[0].product_seller = urun[0].product_seller.filter(seller => {
            return seller.seller_url !== uyeBilgileri2[0].dukkanurl;
          });
          
          const yeniarray2 = {
            product_seller: urun[0].product_seller
          };
          
          await Urun.findByIdAndUpdate(idurun, yeniarray2);
        res.json({status: "Tamamlandı."})
    }
    catch (err) {
        console.log(err)
    }




};
const filtre = async(req,res,next) => {
    try{
        if(req.params.arama==undefined){
            var sayfano = 1
        }
        else{
            var sayfano = req.params.arama
        }
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const aranan = req.params.arama
        const markalar = await Urun.find({product_name:{"$regex": req.cookies.arama, $options: 'i' } });
        const myacc = await User.find({ usertoken: token });
        let sayfaurunleri = []
        let sayfalar = []
        console.log(req.body)
        const list = []
        if(req.cookies.aranan == 'urunara'){
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    const productList = await Urun.find({ $or: [{ product_marka: {"$regex": req.body.arama, $options: 'i' } },{product_name:{"$regex": req.cookies.arama, $options: 'i' } }]}).then(Product => { 
                        const toplamsayfa = parseInt(Product.length/20)+1
                        for(let sayfasayisi = 0+(20*sayfano)-20;sayfasayisi<sayfano*20;sayfasayisi++){
                            if(Product[sayfasayisi]!=undefined){
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for(i=0;i<toplamsayfa;i++){
                            sayfalar.push('/aramasayfa/'+'urunara/'+req.body.arama+':'+(i+1)+':'+sayfano)
                        }                       
                        res.render('user/arama', { layout: '../layouts/logged', title: `Yapx | Arama`, description: ``, keywords: ``,Product,myacc,sayfaurunleri,sayfalar })
                    })
                
                } else {
                    const productList = await Urun.find({ $and: [{ product_marka: {"$regex": req.body.myselect, $options: 'i' }},{product_name:{"$regex": req.cookies.arama, $options: 'i' } }]}).then(Product => {
                        const toplamsayfa = parseInt(Product.length/20)+1
                        for(let sayfasayisi = 0+(20*sayfano)-20;sayfasayisi<sayfano*20;sayfasayisi++){
                            if(Product[sayfasayisi]!=undefined){
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for(i=0;i<toplamsayfa;i++){
                            sayfalar.push('/filtresayfa/'+'urunara/'+Product[i].product_marka+':'+(i+1)+':'+sayfano)
                        }
                        for(let i =0;i<markalar.length;i++){
                            list.push((markalar[i].product_marka).toString())
                        }       
                        const filteredkategorilist2 = [...new Set(list)]                    
                        res.render('user/arama', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Arama`, description: ``, keywords: ``,Product,sayfaurunleri,sayfalar,filteredkategorilist2,aranan })
                    })
                }
            })
        }
        else{
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                const productList = await Urun.find({ $or: [{ product_marka: {"$regex": req.body.arama, $options: 'i' } },{product_name:{"$regex": req.cookies.arama, $options: 'i' } }]}).then(Product => { 
                    const toplamsayfa = parseInt(Product.length/20)+1
                    for(let sayfasayisi = 0+(20*sayfano)-20;sayfasayisi<sayfano*20;sayfasayisi++){
                        if(Product[sayfasayisi]!=undefined){
                            sayfaurunleri.push(Product[sayfasayisi])
                        }
                    }
                    for(i=0;i<toplamsayfa;i++){
                        sayfalar.push('/aramasayfa/'+'urunara/'+req.body.arama+':'+(i+1)+':'+sayfano)
                    }                       
                    res.render('user/arama', { layout: '../layouts/logged', title: `Yapx | Arama`, description: ``, keywords: ``,Product,myacc,sayfaurunleri,sayfalar })
                })
            
            } else {
                if(req.body.Ilceler == 0){
                    const productList = await User.find({ $and: [{ dukkanili: {"$regex": req.body.Iller.split(':')[1], $options: 'i' }},{dukkanadi:{"$regex": req.cookies.arama, $options: 'i' } }]}).then(Product => {
                        const toplamsayfa = parseInt(Product.length/20)+1
                        for(let sayfasayisi = 0+(20*sayfano)-20;sayfasayisi<sayfano*20;sayfasayisi++){
                            if(Product[sayfasayisi]!=undefined){
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for(i=0;i<toplamsayfa;i++){
                            sayfalar.push('/filtresayfa/'+'dukkanara/'+req.body.Iller+':'+(i+1)+':'+sayfano)
                        }                   
                        res.render('user/dukkanarama', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Arama`, description: ``, keywords: ``,Product,sayfaurunleri,sayfalar })
                    })
                }
                else{
                const productList = await User.find({ $and: [{ dukkanili: {"$regex": req.body.Iller.split(':')[1], $options: 'i' }},{dukkanadi:{"$regex": req.cookies.arama, $options: 'i' } },{dukkanilcesi:{"$regex": req.body.Ilceler, $options: 'i' } }]}).then(Product => {
                    const toplamsayfa = parseInt(Product.length/20)+1
                    for(let sayfasayisi = 0+(20*sayfano)-20;sayfasayisi<sayfano*20;sayfasayisi++){
                        if(Product[sayfasayisi]!=undefined){
                            sayfaurunleri.push(Product[sayfasayisi])
                        }
                    }
                    for(i=0;i<toplamsayfa;i++){
                        sayfalar.push('/filtresayfa/'+'dukkanara/'+req.body.Iller+':'+(i+1)+':'+sayfano)
                    }                   
                    res.render('user/dukkanarama', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Arama`, description: ``, keywords: ``,Product,sayfaurunleri,sayfalar })
                })
                }
            }
            })
        }
    }
    catch (err) {
        console.log(err)
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }



};
const filtresayfa = async(req,res,next) => {
    try {
        if(req.params.ara==undefined){
            var sayfano = 1
        }
        else{
            var sayfano = Number(req.params.ara.split(':')[1])
        }
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const markalar = await Urun.find({product_name:{"$regex": req.cookies.arama, $options: 'i' } });
        let sayfalar = []
        const list = []
        const myacc = await User.find({ usertoken: token });
        console.log(req.params.ara.split(':')[0])
        let sayfaurunleri = []
        if(req.params.aramasayfa=='urunara')
        {
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    const productList = await Urun.find({ $and: [{ product_name: {"$regex": req.params.ara.split(':')[0], $options: 'i' }},{product_marka:{"$regex": req.params.ara.split(':')[0], $options: 'i' } }]}).then(Product => {
                        const toplamsayfa = parseInt(Product.length/20)+1
                        for(let sayfasayisi = 0+(20*sayfano)-20;sayfasayisi<sayfano*20;sayfasayisi++){
                            if(Product[sayfasayisi]!=undefined){
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for(i=0;i<toplamsayfa;i++){
                            sayfalar.push('/filtresayfa/'+'urunara/'+req.body.arama+':'+(i+1)+':'+sayfano)
                        }                        
                        res.render('user/arama', { layout: '../layouts/logged', title: `Yapx | Arama`, description: ``, keywords: ``,Product,myacc,sayfaurunleri,sayfalar })
                    })
                  
                } else {
                    const productList = await Urun.find({ $and: [{ product_marka: {"$regex": req.params.ara.split(':')[0], $options: 'i' }},{product_name:{"$regex": req.cookies.arama, $options: 'i' } }]}).then(Product => {
                        const toplamsayfa = parseInt(Product.length/20)+1
                        for(let sayfasayisi = 0+(20*sayfano)-20;sayfasayisi<sayfano*20;sayfasayisi++){
                            if(Product[sayfasayisi]!=undefined){
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for(i=0;i<toplamsayfa;i++){
                            sayfalar.push('/filtresayfa/'+'urunara/'+Product[i].product_marka+':'+(i+1)+':'+sayfano)
                        }                
                        for(let i =0;i<markalar.length;i++){
                            list.push((markalar[i].product_marka).toString())
                        }       
                        const filteredkategorilist2 = [...new Set(list)]    
                        res.render('user/arama', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Arama`, description: ``, keywords: ``,Product,sayfaurunleri,sayfalar,filteredkategorilist2 })
                    })
                }
            })
        }
        else{
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    const productList = await User.find({ dukkanadi: {"$regex": req.body.arama, $options: 'i' } }).then(Product => {
                        const toplamsayfa = parseInt(Product.length/20)+1
                        for(let sayfasayisi = 0+(20*sayfano)-20;sayfasayisi<sayfano*20;sayfasayisi++){
                            if(Product[sayfasayisi]!=undefined){
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for(i=0;i<toplamsayfa;i++){
                            sayfalar.push('/aramasayfa/'+'urunara/'+req.body.arama+':'+(i+1)+':'+sayfano)
                        } 
                        res.render('user/arama', { layout: '../layouts/logged', title: `Yapx | Arama`, description: ``, keywords: ``,Product,myacc,sayfaurunleri,sayfalar })
                    })
                  
                } else {
                    const productList = await User.find({ $and: [{ dukkanili: {"$regex": req.body.Iller.split(':')[1], $options: 'i' }},{dukkanadi:{"$regex": req.cookies.arama, $options: 'i' } }]}).then(Product => {
                        const toplamsayfa = parseInt(Product.length/20)+1
                        for(let sayfasayisi = 0+(20*sayfano)-20;sayfasayisi<sayfano*20;sayfasayisi++){
                            if(Product[sayfasayisi]!=undefined){
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for(i=0;i<toplamsayfa;i++){
                            sayfalar.push('/aramasayfa/'+'urunara/'+req.body.arama+':'+(i+1)+':'+sayfano)
                        } 
                        res.render('user/arama', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Arama`, description: ``, keywords: ``,Product,sayfaurunleri,sayfalar })
                    })
                }
            })
        }
        
    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const logout = (req, res, next) => {
    req.session.destroy((error) => {
        res.clearCookie('usertoken');
        res.redirect('/');
    });
};
const mesajgonder = async (req, res, next) => {
    try {
      const { userid } = req.params;
      const { usertoken } = req.cookies;
      const [sender, receiver] = await Promise.all([
        User.findOne({ usertoken }),
        User.findOne({ Dukkan_UniqueID: userid }),
      ]);
  
      const messageExists = await Messages.exists({
        $or: [
          { Message_Creater: sender.email, Message_Receiver: receiver.email },
          { Message_Creater: receiver.email, Message_Receiver: sender.email },
        ],
      });
  
      if (!messageExists) {
        const uniqueId = uuidv4();
        const formattedDate = new Date().toLocaleString("tr-TR", {
            day: "numeric",
            month: "long",
            hour: "numeric",
            minute: "numeric",
            hour12: false
          });
  
        const senderName = sender.isim && sender.soyisim ? `${sender.isim} ${sender.soyisim}` : sender.dukkanadi;
        const receiverName = receiver.isim && receiver.soyisim ? `${receiver.isim} ${receiver.soyisim}` : receiver.dukkanadi;
  
        const message = {
          Message_ID: uniqueId,
          Message_Content: [`${req.body.message_content}?:?:?${formattedDate}?:?:?${sender.email}`],
          Message_Creater: sender.email,
          Message_Receiver: receiver.email,
          Last_Sender: sender.email,
          is_Opened: "False"
        };
  
        const messageModel = new Messages(message);
        await Promise.all([
          User.findByIdAndUpdate(sender._id, {
            $push: { Messages_List: `${receiverName}?:?:?${uniqueId}?:?:?${req.body.konu}?:?:?${req.body.baslik}?:?:?${formattedDate}?:?:?First_Sender?:?:?${sender.email}?:?:?0` },
          }),
          User.findByIdAndUpdate(receiver._id, {
            $push: { Messages_List: `${senderName}?:?:?${uniqueId}?:?:?${req.body.konu}?:?:?${req.body.baslik}?:?:?${formattedDate}?:?:?First_Comer?:?:?${receiver.email}?:?:?1` },
          }),
          messageModel.save(),
        ]);
        await User.findByIdAndUpdate(receiver._id,{Unreaded_MessageCount: receiver.Unreaded_MessageCount+1})
        res.redirect("/mesajlarim");
      } else {
        const message = await Messages.findOne({
          $or: [
            { Message_Creater: sender.email, Message_Receiver: receiver.email },
            { Message_Creater: receiver.email, Message_Receiver: sender.email },
          ],
        });
  
        res.redirect(`/messagePage?id=${message.Message_ID}`);
      }
    } catch (err) {
      console.log(err);
    }
  };
const MeslekRegister = async (req,res,next) => {
    try{
        if(req.body.Password == req.body.rePassword){
            const data = {
                userid: "5",
                isim: req.body.Name,
                soyisim: req.body.Surname,
                email: req.body.email,
                sifre: await bcrypt.hash(req.body.Password, 10),
                meslekAdi: req.body.Meslek,
                Meslek_Projects: [],
                Meslek_Referances: [],
                Meslek_About: "Kullanıcı Henüz Hakkındakileri Belirtmemiş.",
                Meslek_Adres: req.body.Address,
                dukkanyorum: [],
                gsmtelefon: req.body.PhoneNumber,
                dukkan_av: "5",
                Meslek_Thumbnails:["yapxmarketimthumb.jpg"],
                Meslek_Photos: ["default.png"]
            }
            const yenikullanici = new User(
                data
            );
            await yenikullanici.save();
        }
        else{
            res.redirect('../meslekKayit')
        }
    }
    catch (err){
        console.log(err)
    }
}
const mesajgonderContinue = async (req, res, next) => {
    try {
      const message = await Messages.findOne({ Message_ID: req.params.id });
      const messageSender = await User.findOne({ usertoken: req.cookies.usertoken });
  
      const now = new Date();
      const formattedDate = new Date().toLocaleString("tr-TR", {
        day: "numeric",
        month: "long",
        hour: "numeric",
        minute: "numeric",
        hour12: false
      });
  
      const messageContent = `${req.body.message_content}?:?:?${formattedDate}?:?:?${messageSender.email}`;
  
      const MessagePush = { $push: { Message_Content: messageContent } };
      await Messages.findByIdAndUpdate(message._id, MessagePush);
  
      const otherUserEmail = message.Message_Creater === messageSender.email ? message.Message_Receiver : message.Message_Creater;
      const otherUser = await User.findOne({ email: otherUserEmail });
  
      const updateMessageList = (list, index, read) => {
        const item = list[index];
        const itemArray = item.split('?:?:?');
        itemArray[4] = formattedDate;
        if (read) itemArray[7] = '1';
        list.splice(index, 1);
        list.push(itemArray.join('?:?:?'))
      };
  
      const index = otherUser.Messages_List.findIndex(item => item.includes(req.params.id));
      if (index !== -1) {
        updateMessageList(otherUser.Messages_List, index, true);
      }
  
      const index2 = messageSender.Messages_List.findIndex(item => item.includes(req.params.id));
      if (index2 !== -1) {
        updateMessageList(messageSender.Messages_List, index2, false);
      }
  
      await Promise.all([
        otherUser.save(),
        messageSender.save()
      ]);
      await Messages.findByIdAndUpdate(message._id,{Last_Sender: messageSender.email,is_Opened: "False"})
      if(message.Last_Sender != messageSender.email || message.is_Opened == "True"){
        await User.findByIdAndUpdate(otherUser._id,{Unreaded_MessageCount: otherUser.Unreaded_MessageCount+1})
      }
      res.redirect('/messagePage?id=' + message.Message_ID);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
const deletes = async (req,res,next) => {
    
    const silinecekler = await Urun.find({product_category3 : "Sulama Sistemleri"})
    for(i=0;i<silinecekler.length;i++){
        await Urun.findOneAndDelete({ product_name: silinecekler[i].product_name })
    }
};
















module.exports = {
    homeShow,
    homeYonlendirme,
    urunekleurun,
    arama,
    mesajgonderContinue,
    kategoriler,
    urunekleArama,
    sifremiunuttum,
    sifremiunuttumcode,
    kayitolcodepost,
    aramasayfa,
    meslekSettings,
    kayitolcodeget,
    MeslekRegister,
    isteklistesi,
    MeslekKayitol,
    kurumsalpost,
    urunukaldir,
    dukkanaekle, 
    giris,
    kayitol,
    deletes,
    dortyuzdort,
    hesabim,
    messagePage,
    DukkanaEkleV2forAtTheUrunPage,
    urunukaldirv2,
    sifreyidegistir,
    mesajlarim,
    meslekPage,
    kurumsalregister,
    urunbulv2,
    anakategori,
    urundetaylari,
    isteklistesiadd,
    kayitolpost,
    urunbul,
    yorumekle2,
    filtresayfa,
    yorumekle,
    filtre,
    loginUser,
    kategori,
    sifremiunuttumPost,
    sifremiunuttumcodePost,
    logout,
    hakkimizda,
    mesajgonder,
    dukkanlar,
    urunekle2,
    urunuduzenle,
    
    
};