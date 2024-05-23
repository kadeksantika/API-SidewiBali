const AssetDestinasi = require("../models/assetdestinasi");
const DestinasiWisata = require("../models/destinasiwisata");
const fs = require("fs");
const path = require("path");

exports.postAssetDestinasi = async (req, res) => {
  const { tipe, id_destinasiwisata } = req.body;
  let link = null;

  try {
    if (
      !Object.values([
        "Foto",
        "Video",
      ]).includes(tipe)
    ) {
      throw new Error("Tipe hanya Foto & Video !");
    }

    // Mendapatkan value link berdasarkan tipe, jika foto maka dari res.file, jika video maka dari res.body
    if (tipe == "Foto") {
      link = req.file ? req.file.filename : null;
    } else {
      link = req.body.link;
    }

    const destinasiwisata = await DestinasiWisata.findByPk(id_destinasiwisata);
    if (!destinasiwisata) {
      throw new Error("Destinasi wisata tidak ditemukan");
    }

    await AssetDestinasi.create({
      link: link,
      tipe: tipe,
      id_destinasiwisata: id_destinasiwisata,
    });

    console.log(tipe);
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
      console.error("Error while creating assetDestinasi:", error);
      return res.status(500).json({ error: error.message });
    }
  }
};

exports.updateAssetDestinasi = async (req, res) => {
  const id = parseInt(req.params.id);
  const { tipe, id_destinasiwisata } = req.body;
  let link = null;

  try {
    const destinasiwisata = await DestinasiWisata.findByPk(id_destinasiwisata);
    if (!destinasiwisata) {
      throw new Error("Destinasi wisata tidak ditemukan");
    }

    const assetDestinasi = await AssetDestinasi.findByPk(id);

    if (!assetDestinasi) {
      throw new Error("AssetDestinasi tidak ditemukan");
    }
    

    // Mendapatkan value link berdasarkan tipe, jika foto maka dari res.file, jika video maka dari res.body
    if (tipe == "Foto") {
      link = req.file ? req.file.filename : null;
    } else {
      link = req.body.link;
    }

    if (link) {
      // Delete foto lama jika tipenya foto
      if (assetDestinasi.tipe == "Foto") {
        const imagePath = path.join(
          __dirname,
          "../../uploads/resource/assetDestinasi",
          assetDestinasi.link
        );
        try {
          fs.unlinkSync(imagePath);
        } catch (error) {
          console.error("Error deleting previous image:", error);
        }
      }
      console.log(assetDestinasi.tipe)
      assetDestinasi.link = link;
    }

    if (tipe) {
      if (
        !Object.values([
          "Foto",
          "Video",
        ]).includes(tipe)
      ) {
        throw new Error("Tipe hanya Foto & Video !");
      }
      assetDestinasi.tipe = tipe;
    }

    if (id_destinasiwisata) {
      assetDestinasi.id_destinasiwisata = id_destinasiwisata;
    }

    await assetDestinasi.save();

    return res.status(200).json({ message: "AssetDestinasi berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating assetDestinasi:", error);

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

exports.deleteAssetDestinasi = async (req, res) => {
  try {
    const { id } = req.params;
    const assetDestinasi = await AssetDestinasi.findOne({ where: { id: id } });

    if (!assetDestinasi) {
      return res.status(404).json({ message: "Desa Wisata tidak ditemukan" });
    }

    const gambarDesawisataLama = assetDestinasi.gambar;

    const deletedDesawisataCount = await AssetDestinasi.destroy({
      where: {
        id: id,
      },
    });
    if (deletedDesawisataCount > 0) {
      if (gambarDesawisataLama) {
        const imagePath = path.join(__dirname, "../../uploads/resource/assetDestinasi", gambarDesawisataLama);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log("Foto AssetDestinasi berhasil dihapus:", gambarDesawisataLama);
        } else {
          console.log("Foto AssetDestinasi tidak ditemukan:", gambarDesawisataLama);
        }
      }
      return res.status(200).json({ message: "AssetDestinasi berhasil dihapus" });
    } else {
      return res.status(404).json({ message: "AssetDestinasi tidak ditemukan" });
    }
  } catch (error) {
    console.error("Error :", error);
    return res
      .status(500)
      .json({ error: error.message });
  }
};

exports.getOneAssetDestinasi = async (req, res) => {
  const { id } = req.params;
  try {
    const assetDestinasi = await AssetDestinasi.findOne({ where: { id: id } });
    if (!assetDestinasi) {
      return res.status(404).json({ error: "AssetDestinasi tidak ditemukan" });
    }
    res.json(assetDestinasi);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getAssetDestinasiByIdDesa = async (req, res) => {
  const { id } = req.params;
  try {
    const desaWisata = await DestinasiWisata.findOne({ where: { id: id } });
    if (!desaWisata) {
      return res.status(404).json({ error: "Destinasi wisata tidak ditemukan" });
    }
    const assetDestinasi = await AssetDestinasi.findAll({ where: { id_destinasiwisata: id } });
    if (!assetDestinasi) {
      return res.status(404).json({ error: "AssetDestinasi tidak ditemukan" });
    }
    res.json(assetDestinasi);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getAllAssetDestinasi = async (req, res) => {
  try {
    const assetDestinasiList = await AssetDestinasi.findAll({
      attributes: { exclude: [] },
    });
    res.json(assetDestinasiList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

