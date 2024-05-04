const express = require("express");
const router = express.Router();
const AkunController = require("../controllers/akun");
const KategoriDestinasiController = require("../controllers/kategoridestinasi");
const {checkAuth} = require("../middleware/checkAuth");
const upload = require('../../config/multerConfig');

// Akun
router.post("/akun/login", AkunController.login );
router.delete("/akun/logout", AkunController.logout );
router.get("/akun/token", AkunController.refreshToken );
// upload('akun')-> upload ke folder Akun
// single('foto')-> Field yang berisi file
router.post("/akun/add", upload('akun').single('foto'), AkunController.postAkun);
router.get("/akun",checkAuth, AkunController.getAllAkun );
router.get("/akun/:id_akun", AkunController.getOneAkun );
router.patch("/akun/:id_akun", AkunController.updateAkun);
router.delete("/akun/:id_akun", AkunController.deleteAkun );

// Kategori Destinasi
router.post("/kategoridestinasi/add", KategoriDestinasiController.postKategoriDestinasi);
router.get("/kategoridestinasi", AkunController.getAllAkun );


// Export
module.exports = router;
