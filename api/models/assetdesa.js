const { DataTypes } = require("sequelize");
const db = require("../../config/database");

const assetDesa = db.define(
  "tb_assetdesa",
  {
    link: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    tipe: {
        type: DataTypes.ENUM('Foto', 'Video'),
        allowNull: false,
        defaultValue: 'Foto'
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
assetDesa
  .sync()
  .then(() => {
    console.log("Model tb_assetdesa telah disinkronkan dengan database.");
  })
  .catch((error) => {
    console.error("Gagal menyesuaikan model tb_assetdesa dengan database:", error);
  });

module.exports = assetDesa;
