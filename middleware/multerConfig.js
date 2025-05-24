const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Asegurar que el directorio existe
const uploadPath = path.join(__dirname, '../public/imagenes');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase(); // .jpg, .png, etc.
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, fileName);
  }
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se aceptan JPG y PNG.'), false);
  }
};

// Middleware de multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite: 5 MB
  }
});

module.exports = upload;
