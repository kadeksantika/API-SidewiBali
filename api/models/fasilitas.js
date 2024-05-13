const { DataTypes } = require("sequelize");
const db = require("../../config/database");

const fasilitas = db.define(
  "tb_fasilitas",
  {
    nama: {
      type: DataTypes.STRING,
        validate: {
            len: [1, 50]
        },
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
fasilitas
  .sync()
  .then(() => {
    console.log("Model tb_fasilitas telah disinkronkan dengan database.");
  })
  .catch((error) => {
    console.error("Gagal menyesuaikan model tb_fasilitas dengan database:", error);
  });

module.exports = fasilitas;
