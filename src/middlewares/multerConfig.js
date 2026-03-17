const multer = require("multer");
const path = require("path");

// Configuración de almacenamiento local
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../assets/imagenes"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Validaciones de seguridad
function fileFilter(req, file, cb) {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Solo se permiten archivos JPG o PNG"), false);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // máximo 2 MB
  fileFilter,
});

module.exports = upload;
