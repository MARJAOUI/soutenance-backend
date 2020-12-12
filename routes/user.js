const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/User');

router.post('/signup', userCtrl.signup);   /// route pour la création du user
router.post('/login', userCtrl.login);	   ///  route pour l'identification du user

module.exports = router;