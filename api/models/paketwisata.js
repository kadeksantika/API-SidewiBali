const { DataTypes } = require("sequelize");
const db = require("../../config/database");

const paketWisata = db.define(
  "tb_paketwisata",
  {
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50],
      },
    },
    gambar: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    harga: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_desawisata: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

// Penanganan kesalahan saat menyinkronkan model dengan database
paketWisata
  .sync()
  .then(() => {
    console.log("Model tb_paketwisata telah disinkronkan dengan database.");
  })
  .catch((error) => {
    console.error(
      "Gagal menyesuaikan model tb_paketwisata dengan database:",
      error
    );
  });

module.exports = paketWisata;
