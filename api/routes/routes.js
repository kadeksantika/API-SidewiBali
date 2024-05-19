const express = require("express");
const router = express.Router();
const AkunController = require("../controllers/akun");
const DesaWisataController = require("../controllers/desawisata");
const DestinasiWisataController = require("../controllers/destinasiwisata");
const KategoriDestinasiController = require("../controllers/kategoridestinasi");
const InformasiController = require("../controllers/informasi");
const {checkAuth} = require("../middleware/checkAuth");
const upload = require('../../config/multerConfig');


// Akun
router.post("/akun/login", AkunController.login );
/* upload('akun')-> upload ke folder Akun
single('foto')-> Field yang berisi file */
router.post("/akun/add", upload('akun').single('foto'), AkunController.postAkun);
router.delete("/akun/logout",checkAuth, AkunController.logout );
router.get("/akun",checkAuth, AkunController.getAllAkun );
router.get("/akun/:id_akun",checkAuth, AkunController.getOneAkun );
router.patch("/akun/:id_akun",checkAuth,upload('akun').single('foto'), AkunController.updateAkun);
router.delete("/akun/:id_akun",checkAuth, AkunController.deleteAkun );

// Desa wisata
router.post("/desawisata/add",upload('desawisata').single('gambar'), DesaWisataController.postDesaWisata);
router.patch("/desawisata/:id",upload('desawisata').single('gambar'), DesaWisataController.updateDesaWisata);
router.delete("/desawisata/:id", DesaWisataController.deleteDesaWisata );
router.get("/desawisata/:id", DesaWisataController.getOneDesaWisata );
router.get("/desawisata", DesaWisataController.getAllDesaWisata );


// Kategori Destinasi
router.post("/kategoridestinasi/add", KategoriDestinasiController.postKategoriDestinasi);
router.get("/kategoridestinasi/:id", KategoriDestinasiController.getOneKategoriDestinasi );
router.get("/kategoridestinasi", KategoriDestinasiController.getAllKategoriDestinasi );
router.patch("/kategoridestinasi/:id", KategoriDestinasiController.updateKategoriDestinasi);
router.delete("/kategoridestinasi/:id", KategoriDestinasiController.deleteKategoriDestinasi );

// Destinasi wisata
router.post("/destinasiwisata/add",upload('destinasiwisata').single('gambar'), DestinasiWisataController.postDestinasiWisata);
router.patch("/destinasiwisata/:id",upload('destinasiwisata').single('gambar'), DestinasiWisataController.updateDestinasiWisata);
router.delete("/destinasiwisata/:id", DestinasiWisataController.deleteDestinasiWisata );
router.get("/destinasiwisata/:id", DestinasiWisataController.getOneDestinasiWisata );
router.get("/destinasiwisata", DestinasiWisataController.getAllDestinasiWisata );

// Informasi
router.post("/informasi/add",upload('informasi').single('gambar'), InformasiController.postInformasi);
router.patch("/informasi/:id",upload('informasi').single('gambar'), InformasiController.updateInformasi);
router.delete("/informasi/:id", InformasiController.deleteInformasi );
router.get("/informasi/:id", InformasiController.getOneInformasi );
router.get("/informasi", InformasiController.getAllInformasi );

// Export
module.exports = router;
