const DestinasiWisata = require("../models/destinasiwisata");
const KategoriDestinasi = require("../models/kategoridestinasi");
const DesaWisata = require("../models/desawisata");
const fs = require("fs");
const path = require("path");
const slugify = require('slugify');
const { Op } = require("sequelize")

exports.postDestinasiWisata = async (req, res) => {
  try {
    const { nama, deskripsi, id_kategoridestinasi, id_desawisata } = req.body;
    //   cek apakah ada gambar di upload
    const gambar = req.file ? req.file.filename : null;

    let slug = slugify(nama, { lower: true, strict: true });

    let uniqueSlug = slug;
    let count = 1;
    while (await DestinasiWisata.findOne({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${count}`;
      count++;
    }

    const kategoriDestinasi = await KategoriDestinasi.findOne({
      where: { id: id_kategoridestinasi },
    });
    const desaWisata = await DesaWisata.findOne({
      where: { id: id_desawisata },
    });

    // Validasi kategoridestinasi
    if (!kategoriDestinasi) {
      throw new Error("Kategori destinasi tidak ditemukan");
    }
    // Validasi desawisata
    if (!desaWisata) {
      throw new Error("Desa wisata tidak ditemukan");
    }

    await DestinasiWisata.create({
      nama: nama,
      slug: uniqueSlug,
      deskripsi: deskripsi,
      gambar: gambar,
      id_kategoridestinasi: kategoriDestinasi.id,
      id_desawisata: desaWisata.id,
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

exports.updateDestinasiWisata = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nama, deskripsi, id_kategoridestinasi, id_desawisata } = req.body;
    //   cek apakah ada gambar di upload
    const gambar = req.file ? req.file.filename : null;

    // Pastikan destinasi telah diinisialisasi sebelumnya
    const destinasiWisata = await DestinasiWisata.findByPk(id);

    if (!destinasiWisata) {
      throw new Error("Destinasi tidak ditemukan");
    }
    if (nama) {
      destinasiWisata.nama = nama;

      let slug = slugify(nama, { lower: true, strict: true });

      let uniqueSlug = slug;
      let count = 1;
      while (await DestinasiWisata.findOne({ where: { slug: uniqueSlug, id: { [Op.ne]: id } } })) {
        uniqueSlug = `${slug}-${count}`;
        count++;
      }

      destinasiWisata.slug = uniqueSlug;
    }
    if (gambar) {
      // Cek apakah ada gambar sebelumnya, jika ada maka hapus gambar sebelumnya
      if (destinasiWisata.gambar) {
        const imagePath = path.join(
          __dirname,
          "../../uploads/resource/destinasiwisata",
          destinasiWisata.gambar
        );
        try {
          fs.unlinkSync(imagePath);
        } catch (error) {
          console.error("Error deleting previous image:", error);
        }
      }
      destinasiWisata.gambar = gambar;
    }
    if (deskripsi) {
      destinasiWisata.deskripsi = deskripsi;
    }
    if (id_kategoridestinasi) {
      const kategoriDestinasi = await KategoriDestinasi.findOne({
        where: { id: id_kategoridestinasi },
      });
      // Validasi kategoridestinasi
      if (!kategoriDestinasi) {
        throw new Error("Kategori destinasi tidak ditemukan");
      }
      destinasiWisata.id_kategoridestinasi = kategoriDestinasi.id;
    }
    if (id_desawisata) {
      const desaWisata = await DesaWisata.findOne({
        where: { id: id_desawisata },
      });

      // Validasi desawisata
      if (!desaWisata) {
        throw new Error("Desa wisata tidak ditemukan");
      }
      destinasiWisata.id_desawisata = desaWisata.id;
    }

    await destinasiWisata.save();

    return res.status(200).json({ message: "Destinasi wisata berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating :", error);

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

exports.deleteDestinasiWisata = async (req, res) => {
  try {
    const { id } = req.params;
    const destinasiwisata = await DestinasiWisata.findOne({ where: { id: id } });

    if (!destinasiwisata) {
      return res.status(404).json({ message: "Destinasi Wisata tidak ditemukan" });
    }

    const gambarDestinasiwisataLama = destinasiwisata.gambar;

    const deletedDestinasiwisataCount = await DestinasiWisata.destroy({
      where: {
        id: id,
      },
    });
    if (deletedDestinasiwisataCount > 0) {
      if (gambarDestinasiwisataLama) {
        const imagePath = path.join(
          __dirname,
          "../../uploads/resource/destinasiwisata",
          gambarDestinasiwisataLama
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log("Foto Destinasi berhasil dihapus:", gambarDestinasiwisataLama);
        } else {
          console.log("Foto Destinasi tidak ditemukan:", gambarDestinasiwisataLama);
        }
      }
      return res.status(200).json({ message: "Destinasi wisata berhasil dihapus" });
    } else {
      return res.status(404).json({ message: "Destinasi wisata tidak ditemukan" });
    }
  } catch (error) {
    console.error("Error :", error);
    return res
      .status(500)
      .json({ error: error.message });
  }
};

exports.getOneDestinasiWisata = async (req, res) => {
  const { id } = req.params;
  try {
    const destinasiWisata = await DestinasiWisata.findOne({
      where: { id: id },
    });
    if (!destinasiWisata) {
      return res.status(404).json({ error: "Destinasi wisata tidak ditemukan" });
    }
    res.json(destinasiWisata);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getAllDestinasiWisata = async (req, res) => {
  try {
    const destinasiWisataList = await DestinasiWisata.findAll({
      attributes: { exclude: [] },
    });
    res.json(destinasiWisataList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
