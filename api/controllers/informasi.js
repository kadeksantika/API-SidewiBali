const DesaWisata = require("../models/desawisata");
const Informasi = require("../models/informasi");

exports.postInformasi = async (req, res) => {
  try {
    const {no_telp,no_wa,facebook,instagram,website,email , id_desawisata} = req.body;

    const desaWisata = await DesaWisata.findByPk(id_desawisata);
    if (!desaWisata) {
      throw new Error("desaWisata tidak ditemukan");
    }

    await Informasi.create({
      no_telp: no_telp,
      no_wa: no_wa,
      facebook: facebook,
      instagram: instagram,
      website: website,
      email: email,
      id_desawisata: id_desawisata,
    });

    return res.json({ msg: "Add successful" });
  } catch (error) {
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
    const {no_telp,no_wa,facebook,instagram,website,email , id_desawisata} = req.body;

    const informasi = await Informasi.findByPk(id);

    if (!informasi) {
      throw new Error("informasi tidak ditemukan");
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
      const desaWisata = await DesaWisata.findByPk(id_desawisata);
      if (!desaWisata) {
        throw new Error("desaWisata tidak ditemukan");
      }
      informasi.id_desawisata = desaWisata.id;
    }

    await informasi.save();

    return res.status(200).json({ message: "Informasi berhasil diperbarui" });
  } catch (error) {
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
  
      const deletedaCount = await Informasi.destroy({
        where: {
          id: id,
        },
      });
      if (deletedaCount > 0) {
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
  exports.getInformasiByIdDesa = async (req, res) => {
    const { id } = req.params;
    try {
      const informasi = await Informasi.findOne({ where: { id_desawisata: id} });
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

  