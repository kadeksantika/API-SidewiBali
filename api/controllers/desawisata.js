const DesaWisata = require("../models/desawisata");

exports.postDesaWisata = async (req, res) => {
  try {
    const { nama, alamat, deskripsi, maps, kategori, kabupaten } = req.body;
    const gambar = req.file ? req.file.filename : null;

    await DesaWisata.create({
      nama: nama,
      alamat: alamat,
      deskripsi: deskripsi,
      gambar: gambar,
      maps: maps,
      kategori: kategori,
      kabupaten: kabupaten,
    });

    return res.json({ msg: "Add successful" });
  } catch (error) {
    console.error(error);
    if (error.nama === "SequelizeUniqueConstraintError") {
      res.status(400).json({ error: "Constraint Error" });
    } else {
      console.error("Error while creating account:", error);
      res.status(500).json({ error: error });
    }
  }
};
