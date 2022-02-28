const Sauce = require('../models/sauce');
const fs = require('fs');

// Création de sauce

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  delete sauceObject._id;
  // On créer une nouvelle instance "Sauce" qui contiendra le corp de la sauce, une "imageUrl" et les likes, dislikes
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [' '],
    usersdisLiked: [' '],
  });
  sauce.save()
  // Si la création de la sauce est validé, alors on renvoie une réponse(201)
    .then(() => res.status(201).json({ message: "Sauce enregistrée" }))
    // Sinon une erreur
    .catch((error) => res.status(400).json({ error }));
};
  // Sélectionner une sauce
  exports.getOneSauce = (req, res, next) => {
    // On sélectionne une sauce
    Sauce.findOne({
      // On récupère l'id de la sauce
      _id: req.params.id
    })
    // Si l'id de la sauce est bonne, alors on renvoie une réponse(200)
    .then(
      (sauce) => {
        res.status(200).json(sauce);
      }
      // Sinon on renvoie une erreur
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };
  
// Modification d'une sauce

  exports.modifySauce = (req, res, next) => {
    // On récupère le corp de la sauce et l'image de la sauce
    const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`} : { ...req.body }
    // Puis on actualise la sauce avec le nouveau corp et l'id de la sauce
    Sauce.updateOne({ _id : req.params.id}, {...sauceObject, _id: req.params.id})
    // Si la sauce les modifications sont valident, alors on renvoie une réponse(200)
    .then(res.status(200).json({ message : "Sauce modifiée"}))
    // Sinon une erreur
    .catch(error => res.status(400).json({ error }))
  }
  
// Suppression d'une sauce

  exports.deleteSauce = (req, res, next) => {
    // On récupère l'id de la sauce
    Sauce.findOne({ _id : req.params.id })
    // On supprime l'image de la sauce et l'id
    .then(sauce => {
      const filename = sauce.imageUrl.split("/images/")[1]
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({_id : req.params.id})
        // Si la sauce est bien supprimé, alors on renvoie une réponse(200)
    .then(res.status(200).json({ message: "Sauce supprimée" }))
    // Sinon on renvoie une erreur
    .catch(error => res.status(400).json({ error }))
    
      })
    })
    .catch(error => res.status(500).json({ error }))
  }

  // Les likes et dislikes

  exports.likeDislikeSauce = (req, res, next) => {
    // On déclare des variables ou l'on récupère le like, l'userId, et l'id de la sauce
    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id
    switch (like) {
      case 1 :
        // Si l'utilisateur met un like, alors le j'aime= +1
          Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
            .then(() => res.status(200).json({ message: `J'aime` }))
            .catch((error) => res.status(400).json({ error }))
              
        break;
  
      case 0 :
        // Si l'utilisateur enlève son like ou son dislike, alors le j'aime= -1
          Sauce.findOne({ _id: sauceId })
             .then((sauce) => {
              if (sauce.usersLiked.includes(userId)) { 
                Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
                  .then(() => res.status(200).json({ message: `Neutre` }))
                  .catch((error) => res.status(400).json({ error }))
              }
              if (sauce.usersDisliked.includes(userId)) { 
                Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
                  .then(() => res.status(200).json({ message: `Neutre` }))
                  .catch((error) => res.status(400).json({ error }))
              }
            })
            .catch((error) => res.status(404).json({ error }))
        break;
  
      case -1 :
        // Si l'utilisateur met un dislike, alors Je n'aime pas= +1
          Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
            .then(() => { res.status(200).json({ message: `Je n'aime pas` }) })
            .catch((error) => res.status(400).json({ error }))
        break;
        
        default:
          console.log(error);
    }
  }
  
  // Toute les sauces

  exports.getAllSauce = (req, res, next) => {
    // On récupère toute les sauce
    Sauce.find()
    // Si on récupère toute les sauces, alors on renvoie une réponse(200)
    .then(
      (sauce) => {
        res.status(200).json(sauce);
      }
      // Sinon on renvoie une erreur
    ).catch(
      (error) => {
        res.status(400).json({ error: error });
      }
    );
  };