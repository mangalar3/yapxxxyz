const router = require('express').Router();
const adminController = require('../controllers/adminController');
const validetorMiddleware = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const multerConfig = require('../config/multerConfig');
const multerAdminConfig = require('../config/multerAdmin');
const jqueryControllerAdmin = require('../controllers/adminfrontControllers/adminjqueryControllers');
const authController = require('../controllers/authController');

router.get('/', authMiddleware.oturumAcilmis, adminController.showHomePage);
router.get('/charts', authMiddleware.oturumAcilmis, adminController.charts);
router.get('/tables/:id', authMiddleware.oturumAcilmis, adminController.tables);
router.get('/tablesurun', authMiddleware.oturumAcilmis, adminController.tablesurun);
router.get('/trafik', authMiddleware.oturumAcilmis, adminController.trafik);
router.get('/panelmesajlar', authMiddleware.oturumAcilmis, adminController.panelmesajlar);
router.get('/urunekle', authMiddleware.oturumAcilmis, adminController.urunekle);
router.get('/islemkullanici', authMiddleware.oturumAcilmis, adminController.islemkullanici);
router.get('/adminEkle', authMiddleware.oturumAcilmis, adminController.adminEkle)

router.post('/adminEklePost', authMiddleware.oturumAcilmis,adminController.adminEklePost)
router.post('/urunara', authMiddleware.oturumAcilmis,adminController.UrunAra)
router.post('/filtreKategori', authMiddleware.oturumAcilmis,adminController.filtreKategori)
router.post('/adminEdit',authMiddleware.oturumAcilmis)
router.post('/getUser',jqueryControllerAdmin.searchUser)
router.post('/islemKullanici',adminController.islemkullaniciPost)
router.post('/PhoteDelete',jqueryControllerAdmin.DeletePhoto)
router.post('/AddPhotoAdmin', multerAdminConfig.single('images'),jqueryControllerAdmin.AddPhotoAdmin)
router.post('/urunekle', authMiddleware.oturumAcilmis,multerConfig.array('images',5), adminController.uruneklePost);
router.post('/urunsil/:urunsil', authMiddleware.oturumAcilmis, adminController.urunsil);
router.post('/EditStore', authMiddleware.oturumAcilmis, adminController.EditStore);
router.post('/banner/:banner', authMiddleware.oturumAcilmis,multerConfig.single('images'), adminController.bannerekle);
router.post('/banner2/:banner2', authMiddleware.oturumAcilmis, adminController.bannerkaldır);





module.exports = router;