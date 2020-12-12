const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');    // importer le middleware authentification
const multer = require('../middleware/multer-config'); // importer multer : gestion de fichiers envoyés avec protocole http
const sauceCtrl = require('../controllers/sauce');  

router.post('/', auth, multer, sauceCtrl.createSauce); // avec  multer on inclut un fichier (image) dans la requette
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // avec multer on peut modifier l'image'
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;