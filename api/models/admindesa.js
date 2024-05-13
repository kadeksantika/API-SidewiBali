const { DataTypes } = require("sequelize");
const db = require("../../config/database");

const adminDesa = db.define(
  "tb_admindesa",
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
adminDesa
  .sync()
  .then(() => {
    console.log("Model tb_adminDesa telah disinkronkan dengan database.");
  })
  .catch((error) => {
    console.error("Gagal menyesuaikan model tb_adminDesa dengan database:", error);
  });

module.exports = adminDesa;
