const multer = require('multer');

// On définit les types d'images accepter

const imgTypes = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// On définit la destination des images

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // On vérifie le nom et le type de l'image
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = imgTypes[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');