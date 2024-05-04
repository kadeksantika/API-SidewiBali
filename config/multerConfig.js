const multer = require("multer");
const fs = require("fs"); // Import module fs untuk manajemen file

const storage = (folderName) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      const folderPath = `uploads/resource/${folderName}/`;
      if (!fs.existsSync(folderPath)) {
        // Jika tidak, buat folder tersebut
        fs.mkdirSync(folderPath, { recursive: true });
      }
      cb(null, folderPath); // Menentukan folder penyimpanan
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname); // Menentukan nama file
    },
  });

// Filter untuk menerima hanya file dengan tipe tertentu
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG and PNG images are allowed"), false);
  }
};

// Fungsi untuk inisialisasi Multer
const upload = (folderName) =>
  multer({
    storage: storage(folderName),
    fileFilter: fileFilter,
  });
module.exports = upload;
