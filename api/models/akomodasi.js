const { DataTypes } = require("sequelize");
const db = require("../../config/database");

const akomodasi = db.define(
  "tb_akomodasi",
  {
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 25],
      },
    },
    slug: {
      type: DataTypes.STRING,
      validate: {
        len: [1, 35],
      },
      allowNull: false,
    },
    gambar: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    kategori: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50],
      },
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
akomodasi
  .sync()
  .then(() => {
    console.log("Model tb_akomodasi telah disinkronkan dengan database.");
  })
  .catch((error) => {
    console.error(
      "Gagal menyesuaikan model tb_akomodasi dengan database:",
      error
    );
  });

module.exports = akomodasi;
