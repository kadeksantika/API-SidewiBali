const { DataTypes } = require("sequelize");
const db = require("../../config/database");

const assetDestinasi = db.define(
  "tb_assetdestinasi",
  {
    link: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    tipe: {
        type: DataTypes.ENUM('Gambar', 'Video'),
        allowNull: false,
        defaultValue: 'Gambar'
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
assetDestinasi
  .sync()
  .then(() => {
    console.log("Model tb_assetdestinasi telah disinkronkan dengan database.");
  })
  .catch((error) => {
    console.error("Gagal menyesuaikan model tb_assetdestinasi dengan database:", error);
  });

module.exports = assetDestinasi;
