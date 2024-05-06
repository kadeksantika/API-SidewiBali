const DesaWisata = require("../models/desawisata");
const fs = require("fs");
const path = require("path");

exports.postDesaWisata = async (req, res) => {
  try {
    const { nama, alamat, deskripsi, maps, kategori, kabupaten } = req.body;
    //   cek apakah ada gambar di upload
    const gambar = req.file ? req.file.filename : null;

    // Validasi enum kategori
    if (
      !Object.values(["Rintisan", "Berkembang", "Maju", "Mandiri"]).includes(
        kategori
      )
    ) {
      throw new Error("Invalid value for 'kategori'.");
    }
    // Validasi enum kabupaten
    if (
      !Object.values([
        "Badung",
        "Bangli",
        "Buleleng",
        "Denpasar",
        "Gianyar",
        "Jembrana",
        "Karangasem",
        "Klungkung",
        "Tabanan",
      ]).includes(kabupaten)
    ) {
      throw new Error("Invalid value for 'kabupaten'.");
    }

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

    // Hapus file gambar yang sudah diunggah jika ada error
    if (req.file) {
      const fs = require("fs");
      const tempImagePath = req.file.path;
      try {
        fs.unlinkSync(tempImagePath);
        console.log("Uploaded image deleted due to failed data saving.");
      } catch (error) {
        console.error("Error deleting uploaded image:", error);
      }
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Constraint Error" });
    } else {
      console.error("Error while creating account:", error);
      return res.status(500).json({ error: error.message });
    }
  }
};

exports.updateDesaWisata = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nama, alamat, deskripsi, maps, kategori, kabupaten } = req.body;
    const gambar = req.file ? req.file.filename : null;

    // Validasi enum kategori
    if (
      !Object.values(["Rintisan", "Berkembang", "Maju", "Mandiri"]).includes(
        kategori
      )
    ) {
      throw new Error("Invalid value for 'kategori'.");
    }
    // Validasi enum kabupaten
    if (
      !Object.values([
        "Badung",
        "Bangli",
        "Buleleng",
        "Denpasar",
        "Gianyar",
        "Jembrana",
        "Karangasem",
        "Klungkung",
        "Tabanan",
      ]).includes(kabupaten)
    ) {
      throw new Error("Invalid value for 'kabupaten'.");
    }

    // Pastikan desa telah diinisialisasi sebelumnya
    const desaWisata = await DesaWisata.findByPk(id);

    if (!desaWisata) {
      throw new Error("Desa tidak ditemukan");
    }
    if (nama) {
      desaWisata.nama = nama;
    }
    if (gambar) {
     // Cek apakah ada gambar sebelumnya, jika ada maka hapus gamabr sebelumnya
      if (desaWisata.gambar) {
        const imagePath = path.join(
          __dirname,
          "../../uploads/resource/desawisata",
          desaWisata.gambar
        );
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

    return res.status(200).json({ message: "Desa wisata berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating account:", error);

    // Hapus file gambar yang sudah diunggah jika ada error
    if (req.file) {
      const fs = require("fs");
      const tempImagePath = req.file.path;
      try {
        fs.unlinkSync(tempImagePath);
        console.log("Uploaded image deleted due to failed data saving.");
      } catch (error) {
        console.error("Error deleting uploaded image:", error);
      }
    }

    return res.status(500).json({
      message: "Terjadi kesalahan saat memperbarui Desa wisata",
      error,
    });
  }
};

exports.deleteDesaWisata = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedDesawisataCount = await DesaWisata.destroy({
        where: {
          id: id,
        },
      });
      if (deletedDesawisataCount > 0) {
        return res.status(200).json({ message: "Desa wisata berhasil dihapus" });
      } else {
        return res.status(404).json({ message: "Desa wisata tidak ditemukan" });
      }
    } catch (error) {
      console.error("Error :", error);
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan saat menghapus desa wisata", error });
    }
  };
  
  exports.getOneDesaWisata = async (req, res) => {
    const { id } = req.params;
    try {
      const desaWisata = await DesaWisata.findOne({ where: { id: id} });
      if (!desaWisata) {
        return res.status(404).json({ error: "Desa wisata tidak ditemukan" });
      }
      res.json(desaWisata);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  exports.getAllDesaWisata = async (req, res) => {
    try {
      const desaWisataList = await DesaWisata.findAll({
        attributes: { exclude: [] },
      });
      res.json(desaWisataList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  