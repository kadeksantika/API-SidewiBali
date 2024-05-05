const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadsFolder = path.join(__dirname, "../uploads"); // Menyimpan folder uploads di luar direktori proyek

// Fungsi untuk memastikan folder uploads ada dan membuatnya jika belum ada
const ensureUploadsFolderExists = () => {
  if (!fs.existsSync(uploadsFolder)) {
    fs.mkdirSync(uploadsFolder);
  }
};

// Fungsi untuk menentukan lokasi penyimpanan berdasarkan folderName
const storage = (folderName) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      ensureUploadsFolderExists(); // Memastikan folder uploads ada
      const folderPath = path.join(uploadsFolder, "resource", folderName);
      if (!fs.existsSync(folderPath)) {
        try {
          fs.mkdirSync(folderPath, { recursive: true }); // Membuat folder secara rekursif jika belum ada
        } catch (error) {
          // Penanganan error jika folder tidak dapat dibuat
          return cb(new Error("Could not create folder for upload"), null);
        }
      }
      cb(null, folderPath); // Menentukan folder penyimpanan
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname); // Menentukan nama file
    },
   
    
    
  });

// Filter untuk menerima hanya file dengan tipe tertentu
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png"];
  const allowedExtensions = [".jpg", ".jpeg", ".png"];

  const isValidMimeType = allowedMimeTypes.includes(file.mimetype);
  const isValidExtension = allowedExtensions.includes(
    path.extname(file.originalname).toLowerCase()
  );

  if (isValidMimeType && isValidExtension) {
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
