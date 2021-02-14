const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const gorevController = require('../controllers/gorevController');


router.get('/tumGorevler', [authMiddleware, adminMiddleware], gorevController.tumGorevleriListele);

router.get('/:id', authMiddleware, gorevController.gorevGoster);

router.delete('/:id', authMiddleware, gorevController.gorevSil);

router.patch('/:id', authMiddleware, gorevController.gorevGuncelle);

router.get('/', authMiddleware, gorevController.tumGorevlerimiListele);

router.post('/', authMiddleware, gorevController.gorevEkle);

module.exports = router;