const AssetDesa = require("../models/assetdesa");
const DesaWisata = require("../models/desawisata");
const fs = require("fs");
const path = require("path");

exports.postAssetDesa = async (req, res) => {
  const { tipe, id_desawisata } = req.body;
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

    const desawisata = await DesaWisata.findByPk(id_desawisata);
    if (!desawisata) {
      throw new Error("Desa wisata tidak ditemukan");
    }

    await AssetDesa.create({
      link: link,
      tipe: tipe,
      id_desawisata: id_desawisata,
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
      console.error("Error while creating assetDesa:", error);
      return res.status(500).json({ error: error.message });
    }
  }
};

exports.updateAssetDesa = async (req, res) => {
  const id = parseInt(req.params.id);
  const { tipe, id_desawisata } = req.body;
  let link = null;

  try {
    const desawisata = await DesaWisata.findByPk(id_desawisata);
    if (!desawisata) {
      throw new Error("desa wisata tidak ditemukan");
    }

    const assetDesa = await AssetDesa.findByPk(id);

    if (!assetDesa) {
      throw new Error("AssetDesa tidak ditemukan");
    }
    

    // Mendapatkan value link berdasarkan tipe, jika foto maka dari res.file, jika video maka dari res.body
    if (tipe == "Foto") {
      link = req.file ? req.file.filename : null;
    } else {
      link = req.body.link;
    }

    if (link) {
      // Delete foto lama jika tipenya foto
      if (assetDesa.tipe == "Foto") {
        const imagePath = path.join(
          __dirname,
          "../../uploads/resource/assetDesa",
          assetDesa.link
        );
        try {
          fs.unlinkSync(imagePath);
        } catch (error) {
          console.error("Error deleting previous image:", error);
        }
      }
      console.log(assetDesa.tipe)
      assetDesa.link = link;
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
      assetDesa.tipe = tipe;
    }

    if (id_desawisata) {
      assetDesa.id_desawisata = id_desawisata;
    }

    await assetDesa.save();

    return res.status(200).json({ message: "AssetDesa berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating assetDesa:", error);

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

exports.deleteAssetDesa = async (req, res) => {
  try {
    const { id } = req.params;
    const assetDesa = await AssetDesa.findOne({ where: { id: id } });

    if (!assetDesa) {
      return res.status(404).json({ message: "Desa Wisata tidak ditemukan" });
    }

    const gambarDesawisataLama = assetDesa.gambar;

    const deletedDesawisataCount = await AssetDesa.destroy({
      where: {
        id: id,
      },
    });
    if (deletedDesawisataCount > 0) {
      if (gambarDesawisataLama) {
        const imagePath = path.join(__dirname, "../../uploads/resource/assetDesa", gambarDesawisataLama);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log("Foto AssetDesa berhasil dihapus:", gambarDesawisataLama);
        } else {
          console.log("Foto AssetDesa tidak ditemukan:", gambarDesawisataLama);
        }
      }
      return res.status(200).json({ message: "AssetDesa berhasil dihapus" });
    } else {
      return res.status(404).json({ message: "AssetDesa tidak ditemukan" });
    }
  } catch (error) {
    console.error("Error :", error);
    return res
      .status(500)
      .json({error: error.message });
  }
};

exports.getOneAssetDesa = async (req, res) => {
  const { id } = req.params;
  try {
    const assetDesa = await AssetDesa.findOne({ where: { id: id } });
    if (!assetDesa) {
      return res.status(404).json({ error: "AssetDesa tidak ditemukan" });
    }
    res.json(assetDesa);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getAssetDesaByIdDesa = async (req, res) => {
  const { id } = req.params;
  try {
    const desaWisata = await DesaWisata.findOne({ where: { id: id } });
    if (!desaWisata) {
      return res.status(404).json({ error: "Desa wisata tidak ditemukan" });
    }
    const assetDesa = await AssetDesa.findAll({ where: { id_desawisata: id } });
    if (!assetDesa) {
      return res.status(404).json({ error: "AssetDesa tidak ditemukan" });
    }
    res.json(assetDesa);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getAllAssetDesa = async (req, res) => {
  try {
    const assetDesaList = await AssetDesa.findAll({
      attributes: { exclude: [] },
    });
    res.json(assetDesaList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

