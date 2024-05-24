const Berita = require("../models/berita");
const DesaWisata = require("../models/desawisata");
const fs = require("fs");
const path = require("path");
const slugify = require('slugify');
const { Op } = require("sequelize")

exports.postBerita = async (req, res) => {
  try {
    const { judul, isi_berita, id_desawisata } = req.body;
    //   cek apakah ada gambar di upload
    const gambar = req.file ? req.file.filename : null;

    let slug = slugify(judul, { lower: true, strict: true });

    let uniqueSlug = slug;
    let count = 1;
    while (await Berita.findOne({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${count}`;
      count++;
    }

    const desaWisata = await DesaWisata.findOne({
      where: { id: id_desawisata },
    });

    // Validasi desawisata
    if (!desaWisata) {
      throw new Error("Desa wisata tidak ditemukan");
    }

    await Berita.create({
      judul: judul,
      slug: uniqueSlug,
      isi_berita: isi_berita,
      gambar: gambar,
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
      console.error("Error while creating berita:", error);
      return res.status(500).json({ error: error.message });
    }
  }
};

exports.updateBerita = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { judul, isi_berita, id_desawisata } = req.body;
    //   cek apakah ada gambar di upload
    const gambar = req.file ? req.file.filename : null;

    // Pastikan berita telah diinisialisasi sebelumnya
    const berita = await Berita.findByPk(id);

    if (!berita) {
      throw new Error("Berita tidak ditemukan");
    }
    if (judul) {
      berita.judul = judul;

      let slug = slugify(judul, { lower: true, strict: true });

      let uniqueSlug = slug;
      let count = 1;
      while (await Berita.findOne({ where: { slug: uniqueSlug, id: { [Op.ne]: id } } })) {
        uniqueSlug = `${slug}-${count}`;
        count++;
      }

      berita.slug = uniqueSlug;
    }
    if (gambar) {
      // Cek apakah ada gambar sebelumnya, jika ada maka hapus gambar sebelumnya
      if (berita.gambar) {
        const imagePath = path.join(
          __dirname,
          "../../uploads/resource/berita",
          berita.gambar
        );
        try {
          fs.unlinkSync(imagePath);
        } catch (error) {
          console.error("Error deleting previous image:", error);
        }
      }
      berita.gambar = gambar;
    }
    if (isi_berita) {
      berita.isi_berita = isi_berita;
    }

    if (id_desawisata) {
      const desaWisata = await DesaWisata.findOne({
        where: { id: id_desawisata },
      });

      // Validasi desawisata
      if (!desaWisata) {
        throw new Error("Desa wisata tidak ditemukan");
      }
      berita.id_desawisata = desaWisata.id;
    }

    await berita.save();

    return res.status(200).json({ message: "Berita berhasil diperbarui" });
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

exports.deleteBerita = async (req, res) => {
  try {
    const { id } = req.params;
    const berita = await Berita.findOne({ where: { id: id } });

    if (!berita) {
      return res.status(404).json({ message: "Berita tidak ditemukan" });
    }

    const gambarDestinasiwisataLama = berita.gambar;

    const deletedDestinasiwisataCount = await Berita.destroy({
      where: {
        id: id,
      },
    });
    if (deletedDestinasiwisataCount > 0) {
      if (gambarDestinasiwisataLama) {
        const imagePath = path.join(
          __dirname,
          "../../uploads/resource/berita",
          gambarDestinasiwisataLama
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log("Foto Destinasi berhasil dihapus:", gambarDestinasiwisataLama);
        } else {
          console.log("Foto Destinasi tidak ditemukan:", gambarDestinasiwisataLama);
        }
      }
      return res.status(200).json({ message: "Berita berhasil dihapus" });
    } else {
      return res.status(404).json({ message: "Berita tidak ditemukan" });
    }
  } catch (error) {
    console.error("Error :", error);
    return res
      .status(500)
      .json({ error: error.message });
  }
};

exports.getOneBerita = async (req, res) => {
  const { id } = req.params;
  try {
    const berita = await Berita.findOne({
      where: { id: id },
    });
    if (!berita) {
      return res.status(404).json({ error: "Berita tidak ditemukan" });
    }
    res.json(berita);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getBeritaByIdDesa = async (req, res) => {
  const { id } = req.params;
  try {
    const desaWisata = await DesaWisata.findOne({ where: { id: id } });
    if (!desaWisata) {
      return res.status(404).json({ error: "Desa wisata tidak ditemukan" });
    }
    const berita = await Berita.findAll({ where: { id_desawisata: id } });
    if (!berita) {
      return res.status(404).json({ error: "Berita tidak ditemukan" });
    }
    res.json(berita);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getAllBerita = async (req, res) => {
  try {
    const beritaList = await Berita.findAll({
      attributes: { exclude: [] },
    });
    res.json(beritaList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
