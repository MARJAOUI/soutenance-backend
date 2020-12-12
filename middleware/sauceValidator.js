const validate = require('mongoose-validator'); //mongoose validation 
  
 //Sauce validation : name, manufacturer et pepper 
exports.stringValidation = [
  validate({
    validator: 'matches',
    arguments: /^[\wÀ-ÿ \-']+$/, // caractères autorisés pour la rédation des champs de création
    message: 'Ce champ ne doit pas contenir de caractères particuliers'
  }),
];

//Sauce validation : description 
exports.descriptionValidation = [
  validate({
    validator: 'matches',
    arguments: /^[\w\r\nÀ-ÿ \-'?!.,;()]+$/, // caractères autorisés pour la rédation de la description
    message: 'La description ne doit pas contenir de caractères particuliers'
  }),
];