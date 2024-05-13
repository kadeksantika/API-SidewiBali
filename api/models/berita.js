const { DataTypes } = require("sequelize");
const db = require("../../config/database");

const berita = db.define(
  "tb_berita",
  {
    judul: {
      type: DataTypes.STRING,
      validate: {
        len: [1, 50],
      },
      allowNull: false,
    },
    gambar: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isi_berita: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      validate: {
        len: [1, 60],
      },
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
berita
  .sync()
  .then(() => {
    console.log("Model tb_berita telah disinkronkan dengan database.");
  })
  .catch((error) => {
    console.error("Gagal menyesuaikan model tb_berita dengan database:", error);
  });

module.exports = berita;
