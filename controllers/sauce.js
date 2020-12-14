const Sauce = require('../models/sauce');
const fs = require('fs'); // importer fs (FileSystem) pour gerer les fichiers (suppression de l'image).

exports.createSauce = (req, res, next) => { // ajouter une sauce
  const sauceObject = JSON.parse(req.body.sauce); // transfomation de chaine de carac en objet JS

  
  const sauce = new Sauce({
    ...sauceObject, // totalité de l'objet
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, //recuperation dynamique de l'url de l'image
    //likes à 0, dislikes à 0, et initialisation des tables userslikes et usersDislikes
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });

  // Enregistre l'objet dans la base
  sauce.save()    
    .then((sauce) => res.status(201).json({ message: 'sauce enregistrée !'}))// reponse à la FE sinon expiration de la req
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {  //  trouver une sauce
  Sauce.findOne({_id: req.params.id})  //  determiner la sauce avec son id
  .then((sauce) => {res.status(200).json(sauce);}) // renvoyer un status 200 pour ne pas bloquer la requete
  .catch((error) => {res.status(404).json({error: error});});
};

exports.modifySauce = (req, res, next) => {   //  modifier les caractéristiques d'une sauce
  const sauceObject = req.file ?  // si nouveau fichier ( pour une image )
    {
      ...JSON.parse(req.body.sauce), // recuperation de toutes les  infos sur l'objet
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // désignation de l'url pour l'image
    } : { ...req.body }; //  sans fichier
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })// id different _id
    .then((sauce) => res.status(200).json({ message: 'sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {  //  supprimer une sauce
   Sauce.findOne({ _id: req.params.id })   // récupération de la sauce à partir de l'Id
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1]; // nom du fichier est celui qui suit le repertoire 'images'.
      fs.unlink(`images/${filename}`, () => { // suppression du fichier
        sauce.deleteOne({ _id: req.params.id }) // suppression de l'objet
          .then((sauce) => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};


exports.getAllSauces = (req, res, next) => {   // tous les articles de la base
  Sauce.find() 
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => { // liker ou disliker une sauce
  console.log('likeSauce');
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      switch (req.body.like) { // requete pour liker ou disliker
        case 1 : //si like 
          if (!sauce.usersLiked.includes(req.body.userId)) { //si utilisateur n' pas encore liké
            // incrémentation du like à 1 et ajout de l'id la table des usersLiked
            Sauce.updateOne({ _id: req.params.id }, {$inc: {likes: 1}, $push: {usersLiked: req.body.userId}, _id: req.params.id})
              .then((sauce) => res.status(200).json(sauce)) 
              .catch(error => res.status(400).json({ error }));
          }
        break;

        case -1 : //si dislikes 
          if (!sauce.usersDisliked.includes(req.body.userId)) { //si utilisateur n' pas encore disliké
            //incrémentation du disLike et ajout de l'ID dans la table des usersDisliked
            Sauce.updateOne({ _id: req.params.id }, {$inc: {dislikes: 1}, $push: {usersDisliked: req.body.userId}, _id: req.params.id})
              .then((sauce) => res.status(200).json(sauce))
              .catch(error => res.status(400).json({ error }));
          }
        break;

        case 0 : //supprimer un like ou n disLike
          if (sauce.usersLiked.includes(req.body.userId)) { //user est présent dans la table
            //décrémente le like de 1, Suppression de l userId de la table usersLiked 
            Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: req.body.userId}, _id: req.params.id})
              .then(() => res.status(201).json({ message: 'Like supprimé'}))
              .catch(error => res.status(400).json({ error }));
          } else if (sauce.usersDisliked.includes(req.body.userId)) { //if userId already in usersDisliked array
            //décrémente le disLike de 1, Suppression de l userId de la table usersDisliked 
            Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull: {usersDisliked: req.body.userId}, _id: req.params.id})
              .then(() => res.status(201).json({ message: 'Dislike supprimé'}))
              .catch(error => res.status(400).json({ error })); 
          }
        break;

        default:
          throw { error: "Il y a un problème ! "};
      }
    })
    .catch(error => res.status(500).json({ error }));
};