const { DataTypes } = require("sequelize");
const db = require("../../config/database");

const destinasiFavorit = db.define(
  "tb_destinasifavorit",
  {
    id_destinasiwisata: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_akun: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

// Penanganan kesalahan saat menyinkronkan model dengan database
destinasiFavorit
  .sync()
  .then(() => {
    console.log("Model tb_destinasifavorit telah disinkronkan dengan database.");
  })
  .catch((error) => {
    console.error("Gagal menyesuaikan model tb_destinasifavorit dengan database:", error);
  });

module.exports = destinasiFavorit;
