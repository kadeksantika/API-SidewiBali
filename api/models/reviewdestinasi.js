const { DataTypes } = require("sequelize");
const db = require("../../config/database");

const reviewDestinasi = db.define(
  "tb_reviewdestinasi",
  {
    review: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    setujui: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_akun: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_destinasiwisata: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

// Penanganan kesalahan saat menyinkronkan model dengan database
reviewDestinasi
  .sync()
  .then(() => {
    console.log("Model tb_reviewdestinasi telah disinkronkan dengan database.");
  })
  .catch((error) => {
    console.error(
      "Gagal menyesuaikan model tb_reviewdestinasi dengan database:",
      error
    );
  });

module.exports = reviewDestinasi;
