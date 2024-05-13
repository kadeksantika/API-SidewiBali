const { DataTypes } = require("sequelize");
const db = require("../../config/database");

const notifikasi = db.define(
  "tb_notifikasi",
  {
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
notifikasi
  .sync()
  .then(() => {
    console.log("Model tb_notifikasi telah disinkronkan dengan database.");
  })
  .catch((error) => {
    console.error("Gagal menyesuaikan model tb_notifikasi dengan database:", error);
  });

module.exports = notifikasi;
