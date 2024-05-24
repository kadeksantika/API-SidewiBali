const Produk = require("../models/produk");
const DesaWisata = require("../models/desawisata");
const fs = require("fs");
const path = require("path");
const slugify = require('slugify');
const { Op } = require("sequelize")

exports.postProduk = async (req, res) => {
  try {
    const { deskripsi, nama, harga, id_desawisata } = req.body;
    //   cek apakah ada gambar di upload
    const gambar = req.file ? req.file.filename : null;

    let slug = slugify(nama, { lower: true, strict: true });

    let uniqueSlug = slug;
    let count = 1;
    while (await Produk.findOne({ where: { slug: uniqueSlug } })) {
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

    await Produk.create({
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
      console.error("Error while creating produk:", error);
      return res.status(500).json({ error: error.message });
    }
  }
};

exports.updateProduk = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { deskripsi, nama, harga, id_desawisata } = req.body;
    //   cek apakah ada gambar di upload
    const gambar = req.file ? req.file.filename : null;

    // Pastikan produk telah diinisialisasi sebelumnya
    const produk = await Produk.findByPk(id);

    if (!produk) {
      throw new Error("Produk tidak ditemukan");
    }
    if (nama) {
      produk.nama = nama;

      let slug = slugify(nama, { lower: true, strict: true });

      let uniqueSlug = slug;
      let count = 1;
      while (await Produk.findOne({ where: { slug: uniqueSlug, id: { [Op.ne]: id } } })) {
        uniqueSlug = `${slug}-${count}`;
        count++;
      }

      produk.slug = uniqueSlug;
    }
    if (gambar) {
      // Cek apakah ada gambar sebelumnya, jika ada maka hapus gambar sebelumnya
      if (produk.gambar) {
        const imagePath = path.join(
          __dirname,
          "../../uploads/resource/produk",
          produk.gambar
        );
        try {
          fs.unlinkSync(imagePath);
        } catch (error) {
          console.error("Error deleting previous image:", error);
        }
      }
      produk.gambar = gambar;
    }
    if (deskripsi) {
      produk.deskripsi = deskripsi;
    }
    if (harga) {
      produk.harga = harga;
    }

    if (id_desawisata) {
      const desaWisata = await DesaWisata.findOne({
        where: { id: id_desawisata },
      });

      // Validasi desawisata
      if (!desaWisata) {
        throw new Error("Desa wisata tidak ditemukan");
      }
      produk.id_desawisata = desaWisata.id;
    }

    await produk.save();

    return res.status(200).json({ message: "Produk berhasil diperbarui" });
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

exports.deleteProduk = async (req, res) => {
  try {
    const { id } = req.params;
    const produk = await Produk.findOne({ where: { id: id } });

    if (!produk) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    const gambarLama = produk.gambar;

    const deletedCount = await Produk.destroy({
      where: {
        id: id,
      },
    });
    if (deletedCount > 0) {
      if (gambarLama) {
        const imagePath = path.join(
          __dirname,
          "../../uploads/resource/produk",
          gambarLama
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log("Foto Produk berhasil dihapus:", gambarLama);
        } else {
          console.log("Foto Produk tidak ditemukan:", gambarLama);
        }
      }
      return res.status(200).json({ message: "Produk berhasil dihapus" });
    } else {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }
  } catch (error) {
    console.error("Error :", error);
    return res
      .status(500)
      .json({ error: error.message });
  }
};

exports.getOneProduk = async (req, res) => {
  const { id } = req.params;
  try {
    const produk = await Produk.findOne({
      where: { id: id },
    });
    if (!produk) {
      return res.status(404).json({ error: "Produk tidak ditemukan" });
    }
    res.json(produk);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getProdukByIdDesa = async (req, res) => {
  const { id } = req.params;
  try {
    const desaWisata = await DesaWisata.findOne({ where: { id: id } });
    if (!desaWisata) {
      return res.status(404).json({ error: "Desa wisata tidak ditemukan" });
    }
    const produk = await Produk.findAll({ where: { id_desawisata: id } });
    if (!produk) {
      return res.status(404).json({ error: "Produk tidak ditemukan" });
    }
    res.json(produk);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getAllProduk = async (req, res) => {
  try {
    const produkList = await Produk.findAll({
      attributes: { exclude: [] },
    });
    res.json(produkList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};