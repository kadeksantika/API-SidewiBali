const ReviewDestinasi = require("../models/reviewdestinasi");
const DestinasiWisata = require("../models/destinasiwisata");
const Akun = require("../models/akun");

exports.postReviewDestinasi = async (req, res) => {
  try {
    const {review, id_destinasiwisata, id_akun } = req.body;
    let setujui = req.body.setujui
    let rating = req.body.rating

    const destinasiWisata = await DestinasiWisata.findOne({
      where: { id: id_destinasiwisata },
    });

    const akun = await Akun.findOne({
      where: { id: id_akun },
    });

    // Validasi destinasiWisata
    if (!destinasiWisata) {
      throw new Error("Destinasi tidak ditemukan");
    }
    // Validasi akun
    if (!akun) {
      throw new Error("Akun tidak ditemukan");
    }

    if(rating > 5){
      rating = 5;
    }
    if(rating < 1){
      rating = 1;
    }
    
    // Validasi status setujui
    if(setujui){
      if (setujui != 1 && setujui != 0) {
        throw new Error("Status setujui hanya 0 & 1 !");
      }
    }else{
      setujui = 0;
    }

    await ReviewDestinasi.create({
      rating: rating,
      review: review,
      setujui: setujui,
      id_destinasiwisata: destinasiWisata.id,
      id_akun: akun.id,
    });

    return res.json({ msg: "Add successful" });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Constraint Error" });
    } else {
      console.error("Error while creating review:", error);
      return res.status(500).json({ error: error.message });
    }
  }
};

exports.updateReviewDestinasi = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { rating, review, setujui, id_destinasiwisata, id_akun } = req.body;

    const reviewDestinasi = await ReviewDestinasi.findOne({
      where: { id: id },
    });

    if (rating) {
      reviewDestinasi.rating = rating;
    }
    if (setujui) {
      // Validasi status setujui
      if (setujui != 1 && setujui != 0) {
        throw new Error("Status setujui hanya 0 & 1 !");
      }
      reviewDestinasi.setujui = setujui;
    }
    if (review) {
      reviewDestinasi.review = review;
    }
    if (id_destinasiwisata) {
      const destinasiWisata = await DestinasiWisata.findOne({
        where: { id: id_destinasiwisata },
      });
      // Validasi reviewDestinasi
      if (!destinasiWisata) {
        throw new Error("Destinasi tidak ditemukan");
      }
      reviewDestinasi.id_destinasiwisata = destinasiWisata.id;
    }
    if (id_akun) {
      const akun = await Akun.findOne({
        where: { id: id_akun },
      });

      // Validasi akun
      if (!akun) {
        throw new Error("Akun tidak ditemukan");
      }
      reviewDestinasi.id_akun = akun.id;
    }

    await reviewDestinasi.save();

    return res.status(200).json({ message: "Review destinasi berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating :", error);
    return res.status(500).json({
      error: error.message
    });
  }
};

exports.deleteReviewDestinasi = async (req, res) => {
  try {
    const { id } = req.params;
    const reviewDestinasi = await ReviewDestinasi.findOne({ where: { id: id } });

    if (!reviewDestinasi) {
      return res.status(404).json({ message: "Review Destinasi tidak ditemukan" });
    }

    const deletedCount = await ReviewDestinasi.destroy({
      where: {
        id: id,
      },
    });
    if (deletedCount > 0) {
      return res.status(200).json({ message: "Review destinasi berhasil dihapus" });
    } else {
      return res.status(404).json({ message: "Review destinasi tidak ditemukan" });
    }
  } catch (error) {
    console.error("Error :", error);
    return res
      .status(500)
      .json({ error: error.message });
  }
};

exports.getOneReviewDestinasi = async (req, res) => {
  const { id } = req.params;
  try {
    const reviewDestinasi = await ReviewDestinasi.findOne({
      where: { id: id },
    });
    if (!reviewDestinasi) {
      return res.status(404).json({ error: "Review destinasi tidak ditemukan" });
    }
    res.json(reviewDestinasi);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getReviewDestinasiByIdAkun = async (req, res) => {
  const { id } = req.params;
  try {
    const reviewDestinasi = await ReviewDestinasi.findAll({
      where: { id_akun: id },
    });
    if (!reviewDestinasi) {
      return res.status(404).json({ error: "Review destinasi tidak ditemukan" });
    }
    res.json(reviewDestinasi);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getReviewDestinasiByIdDestinasi = async (req, res) => {
  const { id } = req.params;
  try {
    const reviewDestinasi = await ReviewDestinasi.findAll({
      where: { id_destinasiwisata: id },
    });
    if (!reviewDestinasi) {
      return res.status(404).json({ error: "Review destinasi tidak ditemukan" });
    }
    res.json(reviewDestinasi);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getAllReviewDestinasi = async (req, res) => {
  try {
    const reviewDestinasiList = await ReviewDestinasi.findAll({
      attributes: { exclude: [] },
    });
    res.json(reviewDestinasiList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
