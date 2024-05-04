const express = require("express");
const router = express.Router();
const AkunController = require("../controllers/akun");
const KategoriDestinasiController = require("../controllers/kategoridestinasi");
const {checkAuth} = require("../middleware/checkAuth");


// Akun
router.post("/akun/login", AkunController.login );
router.delete("/akun/logout", AkunController.logout );
router.get("/akun/token", AkunController.refreshToken );
router.post("/akun/add", AkunController.postAkun );
router.get("/akun",checkAuth, AkunController.getAllAkun );
router.get("/akun/:id_akun", AkunController.getOneAkun );
router.patch("/akun/:id_akun", AkunController.updateAkun);
router.delete("/akun/:id_akun", AkunController.deleteAkun );

// Kategori Destinasi
router.post("/kategoridestinasi/add", KategoriDestinasiController.postKategoriDestinasi);
router.get("/kategoridestinasi", AkunController.getAllAkun );


// Export
module.exports = router;
