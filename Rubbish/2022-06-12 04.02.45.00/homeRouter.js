const router = require('express').Router();
const homeController = require('../controllers/homeController');


//GET

router.get('/', homeController.homeShow);
router.get('/login', homeController.loginPageShow);


module.exports = router;