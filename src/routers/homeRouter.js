const router = require('express').Router();
const homeController = require('../controllers/homeController');
const Urun = require('../models/urunler');
const multerConfig = require('../config/multerConfig');
const jqueryController = require('../controllers/frontControllers/jqueryController');

//GET
router.get('/', homeController.homeYonlendirme);
router.get('/anasayfa', homeController.homeShow);
router.get('/arama/', homeController.arama);
router.get('/aramasayfa/:aramasayfa/:ara', homeController.aramasayfa);
router.get('/filtresayfa/:aramasayfa/:ara', homeController.filtresayfa);
router.get('/sifremiunuttum', homeController.sifremiunuttum);
router.get('/sifremiunuttumcode', homeController.sifremiunuttumcode);
router.get('/urunler/:urunno', homeController.urundetaylari,homeController.yorumekle);
router.get('/kayitol', homeController.kayitol);
router.get('/giris', homeController.giris);
router.get('/kurumsalhesap', homeController.kurumsalregister);
router.get('/isteklistesi', homeController.isteklistesi);
router.get('/cikisyap', homeController.logout);
router.get('/hakkimizda', homeController.hakkimizda);
router.get('/dukkanlar/:dukkanlar', homeController.dukkanlar,homeController.yorumekle2);
router.get('/hesabim', homeController.hesabim);
router.get('/kategoriler/:kategoriler',homeController.kategoriler)
router.get('/anakategori/:kategori',homeController.anakategori)
router.get('/404',homeController.dortyuzdort)
router.get('/kategori/:kategori',homeController.kategori)
router.get('/filters/:kategoriler',jqueryController.filters)
router.get('/urunekle',homeController.urunekle2)
router.get('/urunekle/:urunkategori',homeController.urunekleurun)
router.get('/urunekleArama',homeController.urunekleArama)
router.get('/messagePage',homeController.messagePage)
router.get('/isteklistesiekle/:istek', homeController.isteklistesiadd);
router.get('/meslekUser', homeController.meslekPage);
router.get('/kayitolMeslek', homeController.MeslekKayitol);
router.get('/meslekSettings', homeController.meslekSettings);
router.get('/yeniurl/:kategoriler',jqueryController.product_url);
router.get('/aramagoster/:kelime',jqueryController.aramagoster);
router.get('/urunara/:aranan',jqueryController.aramasayfa2);
router.get('/BrandFilter',jqueryController.ProductFilter);
router.get('/searchAtShop',jqueryController.FilterAtShop)
router.get('/FilterBrandAtShop',jqueryController.FilterBrandAtShop)
router.get('/mesajlarim',homeController.mesajlarim);
router.get('/siralafiyatagore',jqueryController.fiyatagorelisteleSatici);
// POST
router.post('/dukkanaekle',homeController.dukkanaekle)
router.post('/dukkanaeklev2',homeController.DukkanaEkleV2forAtTheUrunPage)
router.post('/urunuduzenle/:url',homeController.urunuduzenle)
router.post('/urunukaldir/:url',homeController.urunukaldir)
router.post('/urunukaldirv2',homeController.urunukaldirv2)
router.post('/urunbul',homeController.urunbul)
router.post('/profiliguncelle',multerConfig.single('imag'),homeController.sifreyidegistir)
router.post('/arama', homeController.arama);
router.post('/filtre', homeController.filtre);
router.post('/giris', homeController.loginUser);
router.post('/yorumekle/:urun', homeController.yorumekle);
router.post('/yorumekledukkan/:dukkan', homeController.yorumekle2);
router.post('/urungetirv2',homeController.urunbulv2)
router.post('/kayitol', homeController.kayitolpost);
router.post('/kurumsalpost', homeController.kurumsalpost);
router.post('/meslekRegister', homeController.MeslekRegister);
router.post('/sendMessage/:userid',homeController.mesajgonder)
router.post('/sendMessagev2/:id',homeController.mesajgonderContinue)
router.post('/sifremiunuttum', homeController.sifremiunuttumPost);
router.post('/kayitolcode', homeController.kayitolcodeget);
router.post('/sifremiunuttumcode', homeController.sifremiunuttumcodePost);
router.post('/kayitolcodepost', homeController.kayitolcodepost);
router.post('/cikisyap', homeController.logout);

module.exports = router;