const router = require('express').Router();

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const userController = require('../controllers/userController');

router.get('/', [authMiddleware, adminMiddleware], userController.tumUserlariListele);

router.get('/me', authMiddleware, userController.oturumAcanKullaniciBilgileri);

router.patch('/me', authMiddleware, userController.oturumAcanKullaniciGuncelleme);

router.post('/', userController.yeniKullaniciOlustur);

router.post('/giris', userController.girisYap);




router.patch('/:id', userController.adminUserGuncelleme);

router.get('/deleteAll', [authMiddleware, adminMiddleware], userController.tumKullanicilariSil);

router.delete('/me', authMiddleware, userController.kullaniciKendiniSil);

router.delete('/:id',[authMiddleware, adminMiddleware], userController.yoneticiKullaniciSil);




module.exports = router;