const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptojs = require('crypto-js')
require('dotenv').config;

// Création de compte

exports.signup = (req, res, next) => {
    // On cripte l'adresse email
    const cryptedEmail = cryptojs.HmacMD5(req.body.email, process.env.SCRT_CRYPTOJS_TKN).toString(cryptojs.enc.Base64);
    // On hash le MDP
    bcrypt.hash(req.body.password, 10)
    .then( hash => {
        // On créer une nouvelle instance avec l'adresse email et le MDP
        const user = new User({
            email: cryptedEmail,
            password: hash
        });
    user.save()
    // Si la réquête est bien envoyé alors on renvoie en réponse(201) "Utilisateur créée"
    .then(() => res.status(201).json( { message: 'Utilisateur créé !' }))
    // Sinon on renvoie une erreur
    .catch(error => res.status(400).json({ error }));
 })
 .catch(error => res.status(500).json({ error }));
};

// Pour un compte déjà créer
exports.login = (req, res, next) => {
    const cryptedEmail = cryptojs.HmacMD5(req.body.email, process.env.SCRT_CRYPTOJS_TKN).toString(cryptojs.enc.Base64);
    User.findOne({ email: cryptedEmail })
    // On vérifie si il existe le nom de l'utilisateur
    .then(user => {
        // Si ce n'est pas le cas, alors on renvoie une erreur
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !'});
        };
        // Puis on vérifie le MDP de l'utilisateur
        bcrypt.compare(req.body.password, user.password)
        // Si le MDP n'est pas valide, alors on renvoie une erreur
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect'});
            }
            // Si le "user" et le MDP sont valide, alors on renvoie une réponse(200) avec un userId et un token 
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    process.env.SCRT_TKN,
                    { expiresIn: '2h' }
                )
            });
        })
    })
    // Sinon on renvoie une erreur
    .catch(error => res.status(500).json({ error }));
};
