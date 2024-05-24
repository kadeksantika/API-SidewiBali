const Fasilitas = require("../models/fasilitas");
const DestinasiWisata = require("../models/destinasiwisata");

exports.postFasilitas = async (req, res) => {
  try {
    const { nama, id_destinasiwisata } = req.body;

    const destinasiwisata = await DestinasiWisata.findByPk(id_destinasiwisata);

    if (!destinasiwisata) {
        return res.status(404).json({ message: "Destinasi tidak ditemukan" });
    }

    await Fasilitas.create({
      nama: nama,
      id_destinasiwisata: id_destinasiwisata,
    });

    return res.json({ msg: "Add successful" });
  } catch (error) {
    console.error(error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: error.message });
    } else {
      console.error("Error while creating account:", error);
      return res.status(500).json({ error: error.message });
    }
  }
};

exports.updateFasilitas = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nama, id_destinasiwisata } = req.body;

    const destinasiwisata = await DestinasiWisata.findByPk(id_destinasiwisata);

    if (!destinasiwisata) {
        return res.status(404).json({ message: "Destinasi tidak ditemukan" });
    }

    const fasilitas = await Fasilitas.findByPk(id);

    if (!fasilitas) {
      throw new Error("fasilitas tidak ditemukan");
    }
    if (nama) {
      fasilitas.nama = nama;
    }
    if (id_destinasiwisata) {
      fasilitas.id_destinasiwisata = id_destinasiwisata;
    }

    await fasilitas.save();

    return res.status(200).json({ message: "Fasilitas berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating fasilitas:", error);
    return res.status(500).json({
      error: error.message
    });
  }
};

exports.deleteFasilitas = async (req, res) => {
  try {
    const { id } = req.params;
    const fasilitas = await Fasilitas.findOne({ where: { id: id } });

    if (!fasilitas) {
      return res.status(404).json({ message: "Fasilitas tidak ditemukan" });
    }

    const deletedaCount = await Fasilitas.destroy({
      where: {
        id: id,
      },
    });
    if (deletedaCount > 0) {
      return res.status(200).json({ message: "Fasilitas berhasil dihapus" });
    } else {
      return res.status(404).json({ message: "Fasilitas tidak ditemukan" });
    }
  } catch (error) {
    console.error("Error :", error);
    return res
      .status(500)
      .json({ error: error.message });
  }
};

exports.getOneFasilitas = async (req, res) => {
  const { id } = req.params;
  try {
    const fasilitas = await Fasilitas.findOne({ where: { id: id } });
    if (!fasilitas) {
      return res.status(404).json({ error: "Fasilitas tidak ditemukan" });
    }
    res.json(fasilitas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getFasilitasByIdDestinasi = async (req, res) => {
  const { id } = req.params;
  try {
    const fasilitas = await Fasilitas.findAll({ where: { id_destinasiwisata: id } });
    if (!fasilitas) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json(fasilitas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

exports.getAllFasilitas = async (req, res) => {
  try {
    const fasilitasList = await Fasilitas.findAll({
      attributes: { exclude: [] },
    });
    res.json(fasilitasList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

