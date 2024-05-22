const Akomodasi = require("../models/akomodasi");
const DesaWisata = require("../models/desawisata");
const fs = require("fs");
const path = require("path");

exports.postAkomodasi = async (req, res) => {
  try {
    const { nama, kategori, id_desawisata } = req.body;
    //   cek apakah ada gambar di upload
    const gambar = req.file ? req.file.filename : null;

    const desawisata = await DesaWisata.findByPk(id_desawisata);
    if (!desawisata) {
      throw new Error("Desa wisata tidak ditemukan");
    }

    await Akomodasi.create({
      nama: nama,
      gambar: gambar,
      kategori: kategori,
      id_desawisata: id_desawisata,
    });

    return res.json({ msg: "Add successful" });
  } catch (error) {
    console.error(error);

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
      console.error("Error while creating akomodasi:", error);
      return res.status(500).json({ error: error.message });
    }
  }
};

exports.updateAkomodasi = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nama, kategori, id_desawisata } = req.body;
    const gambar = req.file ? req.file.filename : null;

    const desawisata = await DesaWisata.findByPk(id_desawisata);
    if (!desawisata) {
      throw new Error("desa wisata tidak ditemukan");
    }

    const akomodasi = await Akomodasi.findByPk(id);

    if (!akomodasi) {
      throw new Error("Akomodasi tidak ditemukan");
    }
    if (nama) {
      akomodasi.nama = nama;
    }
    if (gambar) {
      // Cek apakah ada gambar sebelumnya, jika ada maka hapus gambar sebelumnya
      if (akomodasi.gambar) {
        const imagePath = path.join(
          __dirname,
          "../../uploads/resource/akomodasi",
          akomodasi.gambar
        );
        try {
          fs.unlinkSync(imagePath);
        } catch (error) {
          console.error("Error deleting previous image:", error);
        }
      }
      akomodasi.gambar = gambar;
    }

    if (kategori) {
      akomodasi.kategori = kategori;
    }
    if (desawisata) {
      akomodasi.desawisata = desawisata;
    }

    await akomodasi.save();

    return res.status(200).json({ message: "Akomodasi berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating akomodasi:", error);

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

exports.deleteAkomodasi = async (req, res) => {
  try {
    const { id } = req.params;
    const akomodasi = await Akomodasi.findOne({ where: { id: id } });

    if (!akomodasi) {
      return res.status(404).json({ message: "Desa Wisata tidak ditemukan" });
    }

    const gambarDesawisataLama = akomodasi.gambar;

    const deletedDesawisataCount = await Akomodasi.destroy({
      where: {
        id: id,
      },
    });
    if (deletedDesawisataCount > 0) {
      if (gambarDesawisataLama) {
        const imagePath = path.join(__dirname, "../../uploads/resource/akomodasi", gambarDesawisataLama);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log("Foto Akomodasi berhasil dihapus:", gambarDesawisataLama);
        } else {
          console.log("Foto Akomodasi tidak ditemukan:", gambarDesawisataLama);
        }
      }
      return res.status(200).json({ message: "Akomodasi berhasil dihapus" });
    } else {
      return res.status(404).json({ message: "Akomodasi tidak ditemukan" });
    }
  } catch (error) {
    console.error("Error :", error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan saat menghapus Akomodasi", error });
  }
};

exports.getOneAkomodasi = async (req, res) => {
  const { id } = req.params;
  try {
    const akomodasi = await Akomodasi.findOne({ where: { id: id } });
    if (!akomodasi) {
      return res.status(404).json({ error: "Akomodasi tidak ditemukan" });
    }
    res.json(akomodasi);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getAkomodasiByIdDesa = async (req, res) => {
  const { id } = req.params;
  try {
    const desaWisata = await DesaWisata.findOne({ where: { id: id } });
    if (!desaWisata) {
      return res.status(404).json({ error: "Desa wisata tidak ditemukan" });
    }
    const akomodasi = await Akomodasi.findOne({ where: { id_desawisata: id } });
    if (!akomodasi) {
      return res.status(404).json({ error: "Akomodasi tidak ditemukan" });
    }
    res.json(akomodasi);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getAllAkomodasi = async (req, res) => {
  try {
    const akomodasiList = await Akomodasi.findAll({
      attributes: { exclude: [] },
    });
    res.json(akomodasiList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

