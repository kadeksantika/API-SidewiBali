const PaketWisata = require("../models/paketwisata");
const DesaWisata = require("../models/desawisata");
const fs = require("fs");
const path = require("path");
const slugify = require('slugify');
const { Op } = require("sequelize")

exports.postPaketWisata = async (req, res) => {
  try {
    const { deskripsi, nama, harga, id_desawisata } = req.body;
    //   cek apakah ada gambar di upload
    const gambar = req.file ? req.file.filename : null;

    let slug = slugify(nama, { lower: true, strict: true });

    let uniqueSlug = slug;
    let count = 1;
    while (await PaketWisata.findOne({ where: { slug: uniqueSlug } })) {
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

    await PaketWisata.create({
      deskripsi: deskripsi,
      slug: uniqueSlug,
      nama: nama,
      harga: harga,
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
      console.error("Error while creating paketwisata:", error);
      return res.status(500).json({ error: error.message });
    }
  }
};

exports.updatePaketWisata = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { deskripsi, nama, harga, id_desawisata } = req.body;
    //   cek apakah ada gambar di upload
    const gambar = req.file ? req.file.filename : null;

    // Pastikan paketwisata telah diinisialisasi sebelumnya
    const paketwisata = await PaketWisata.findByPk(id);

    if (!paketwisata) {
      throw new Error("PaketWisata tidak ditemukan");
    }
    if (nama) {
      paketwisata.nama = nama;

      let slug = slugify(nama, { lower: true, strict: true });

      let uniqueSlug = slug;
      let count = 1;
      while (await PaketWisata.findOne({ where: { slug: uniqueSlug, id: { [Op.ne]: id } } })) {
        uniqueSlug = `${slug}-${count}`;
        count++;
      }

      paketwisata.slug = uniqueSlug;
    }
    if (gambar) {
      // Cek apakah ada gambar sebelumnya, jika ada maka hapus gambar sebelumnya
      if (paketwisata.gambar) {
        const imagePath = path.join(
          __dirname,
          "../../uploads/resource/paketwisata",
          paketwisata.gambar
        );
        try {
          fs.unlinkSync(imagePath);
        } catch (error) {
          console.error("Error deleting previous image:", error);
        }
      }
      paketwisata.gambar = gambar;
    }
    if (deskripsi) {
      paketwisata.deskripsi = deskripsi;
    }
    if (harga) {
      paketwisata.harga = harga;
    }

    if (id_desawisata) {
      const desaWisata = await DesaWisata.findOne({
        where: { id: id_desawisata },
      });

      // Validasi desawisata
      if (!desaWisata) {
        throw new Error("Desa wisata tidak ditemukan");
      }
      paketwisata.id_desawisata = desaWisata.id;
    }

    await paketwisata.save();

    return res.status(200).json({ message: "PaketWisata berhasil diperbarui" });
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

exports.deletePaketWisata = async (req, res) => {
  try {
    const { id } = req.params;
    const paketwisata = await PaketWisata.findOne({ where: { id: id } });

    if (!paketwisata) {
      return res.status(404).json({ message: "PaketWisata tidak ditemukan" });
    }

    const gambarLama = paketwisata.gambar;

    const deletedCount = await PaketWisata.destroy({
      where: {
        id: id,
      },
    });
    if (deletedCount > 0) {
      if (gambarLama) {
        const imagePath = path.join(
          __dirname,
          "../../uploads/resource/paketwisata",
          gambarLama
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log("Foto PaketWisata berhasil dihapus:", gambarLama);
        } else {
          console.log("Foto PaketWisata tidak ditemukan:", gambarLama);
        }
      }
      return res.status(200).json({ message: "PaketWisata berhasil dihapus" });
    } else {
      return res.status(404).json({ message: "PaketWisata tidak ditemukan" });
    }
  } catch (error) {
    console.error("Error :", error);
    return res
      .status(500)
      .json({ error: error.message });
  }
};

exports.getOnePaketWisata = async (req, res) => {
  const { id } = req.params;
  try {
    const paketwisata = await PaketWisata.findOne({
      where: { id: id },
    });
    if (!paketwisata) {
      return res.status(404).json({ error: "PaketWisata tidak ditemukan" });
    }
    res.json(paketwisata);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getPaketWisataByIdDesa = async (req, res) => {
  const { id } = req.params;
  try {
    const desaWisata = await DesaWisata.findOne({ where: { id: id } });
    if (!desaWisata) {
      return res.status(404).json({ error: "Desa wisata tidak ditemukan" });
    }
    const paketwisata = await PaketWisata.findAll({ where: { id_desawisata: id } });
    if (!paketwisata) {
      return res.status(404).json({ error: "PaketWisata tidak ditemukan" });
    }
    res.json(paketwisata);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getAllPaketWisata = async (req, res) => {
  try {
    const paketwisataList = await PaketWisata.findAll({
      attributes: { exclude: [] },
    });
    res.json(paketwisataList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};