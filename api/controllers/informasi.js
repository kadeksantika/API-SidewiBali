const Informasi = require("../models/informasi");
const fs = require("fs");
const path = require("path");

exports.postInformasi = async (req, res) => {
  try {
    const { nama, alamat,no_telp,no_wa,facebook,instagram,website,email , id_desawisata} = req.body;
    //   cek apakah ada gambar di upload
    const gambar = req.file ? req.file.filename : null;

    await Informasi.create({
      nama: nama,
      alamat: alamat,
      no_telp: no_telp,
      gambar: gambar,
      no_wa: no_wa,
      facebook: facebook,
      instagram: instagram,
      website: website,
      email: email,
      id_desawisata: id_desawisata,
    });

    return res.json({ msg: "Add successful" });
  } catch (error) {
    console.error(error);

    // Hapus file gambar yang sudah diunggah jika ada error
    if (req.file) {
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

exports.updateInformasi = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nama, alamat,no_telp,no_wa,facebook,instagram,website,email , id_desawisata} = req.body;
    //   cek apakah ada gambar di upload
    const gambar = req.file ? req.file.filename : null;

    // Validasi enum kategori
   

    // Pastikan desa telah diinisialisasi sebelumnya
    const informasi = await Informasi.findByPk(id);

    if (!informasi) {
      throw new Error("informasi tidak ditemukan");
    }
    if (nama) {
      informasi.nama = nama;
    }
    if (gambar) {
     // Cek apakah ada gambar sebelumnya, jika ada maka hapus gambar sebelumnya
      if (informasi.gambar) {
        const imagePath = path.join(
          __dirname,
          "../../uploads/resource/informasi",
          informasi.gambar
        );
        try {
          fs.unlinkSync(imagePath);
        } catch (error) {
          console.error("Error deleting previous image:", error);
        }
      }
      informasi.gambar = gambar;
    }
    if (alamat) {
      informasi.alamat = alamat;
    }
    if (no_telp) {
      informasi.no_telp = no_telp;
    }
    if (no_wa) {
      informasi.no_wa = no_wa;
    }
    if (facebook) {
      informasi.facebook = facebook;
    }
    if (instagram) {
      informasi.instagram = instagram;
    }
    if (website) {
      informasi.website = website;
    }
    if (email) {
      informasi.email = email;
    }
    if (id_desawisata) {
      informasi.id_desawisata = id_desawisata;
    }

    await informasi.save();

    return res.status(200).json({ message: "Informasi berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating informasi:", error);

    // Hapus file gambar yang sudah diunggah jika ada error
    if (req.file) {
      const tempImagePath = req.file.path;
      try {
        fs.unlinkSync(tempImagePath);
        console.log("Uploaded image deleted due to failed data saving.");
      } catch (error) {
        console.error("Error deleting uploaded image:", error);
      }
    }

    return res.status(500).json({
      error: error.message
    });
  }
};

exports.deleteInformasi = async (req, res) => {
    try {
      const { id } = req.params;
      const informasi = await Informasi.findOne({ where: { id: id} });

      if (!informasi) {
        return res.status(404).json({ message: "Informasi tidak ditemukan" });
      }
  
      const gambarLama = informasi.gambar;

      const deletedaCount = await Informasi.destroy({
        where: {
          id: id,
        },
      });
      if (deletedaCount > 0) {
        if (gambarLama) {
            const imagePath = path.join(__dirname, "../../uploads/resource/informasi", gambarLama);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
              console.log("Foto Informasi berhasil dihapus:", gambarLama);
            } else {
              console.log("Foto Informasi tidak ditemukan:", gambarLama);
            }
          }
        return res.status(200).json({ message: "Informasi berhasil dihapus" });
      } else {
        return res.status(404).json({ message: "Informasi tidak ditemukan" });
      }
    } catch (error) {
      console.error("Error :", error);
      return res
        .status(500)
        .json({ error: error.message });
    }
  };
  
  exports.getOneInformasi = async (req, res) => {
    const { id } = req.params;
    try {
      const informasi = await Informasi.findOne({ where: { id: id} });
      if (!informasi) {
        return res.status(404).json({ error: "Informasi tidak ditemukan" });
      }
      res.json(informasi);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
  exports.getAllInformasi = async (req, res) => {
    try {
      const informasiList = await Informasi.findAll({
        attributes: { exclude: [] },
      });
      res.json(informasiList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };

  