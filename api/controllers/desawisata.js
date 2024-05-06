const DesaWisata = require("../models/desawisata");

exports.postDesaWisata = async (req, res) => {
  try {
    const { nama, alamat, deskripsi, maps, kategori, kabupaten } = req.body;
    const gambar = req.file ? req.file.filename : null;

    await DesaWisata.create({
      nama: nama,
      alamat: alamat,
      deskripsi: deskripsi,
      gambar: gambar,
      maps: maps,
      kategori: kategori,
      kabupaten: kabupaten,
    });

    return res.json({ msg: "Add successful" });
  } catch (error) {
    console.error(error);
    if (error.nama === "SequelizeUniqueConstraintError") {
      res.status(400).json({ error: "Constraint Error" });
    } else {
      console.error("Error while creating account:", error);
      res.status(500).json({ error: error });
    }
  }
};
exports.updateDesaWisata = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nama, alamat, deskripsi, maps, kategori, kabupaten } = req.body;
    const gambar = req.file ? req.file.filename : null;

    // Pastikan Akun telah diinisialisasi sebelumnya
    const desaWisata = await DesaWisata.findByPk(id);

    if (!desaWisata) {
      return res.status(404).json({ message: "Desa tidak ditemukan" });
    }
    if (nama) {
        desaWisata.nama = nama;
    }
    if (gambar) {
        if(desaWisata.gambar){
            const fs = require('fs');
            const path = require('path');
            const imagePath = path.join(__dirname, '../../uploads/resource/desawisata', desaWisata.gambar);
            try {
              fs.unlinkSync(imagePath);
            } catch (error) {
              console.error("Error deleting previous image:", error);
            }
        }
        desaWisata.gambar = gambar;
    }
    if (alamat) {
        desaWisata.alamat = alamat;
    }
    if (deskripsi) {
        desaWisata.deskripsi = deskripsi;
    }
    if (maps) {
        desaWisata.maps = maps;
    }
    if (kategori) {
        desaWisata.kategori = kategori;
    }
    if (alamat) {
        desaWisata.alamat = alamat;
    }
    if (kabupaten) {
        desaWisata.kabupaten = kabupaten;
    }

    await desaWisata.save();

    return res
      .status(200)
      .json({ message: "Desa wisata berhasil diperbarui"});
  } catch (error) {
    console.error("Error updating account:", error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan saat memperbarui Desa wisata", error });
  }
};
