const mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator');

// On créer un schéma des Utilisateurs avec un email "unique"

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniquevalidator);

module.exports = mongoose.model('User', userSchema);