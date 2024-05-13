const { DataTypes } = require("sequelize");
const db = require("../../config/database");

const desaFavorit = db.define(
  "tb_desafavorit",
  {
    id_desawisata: {
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
desaFavorit
  .sync()
  .then(() => {
    console.log("Model tb_desafavorit telah disinkronkan dengan database.");
  })
  .catch((error) => {
    console.error("Gagal menyesuaikan model tb_desafavorit dengan database:", error);
  });

module.exports = desaFavorit;
