const { DataTypes } = require("sequelize");
const db = require("../../config/database");

const kategoriDestinasi = db.define(
  "tb_kategoridestinasi",
  {
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50],
      },
    },
  },
  {
    freezeTableName: true,
  }
);

kategoriDestinasi
  .sync()
  .then(() => {
    console.log("Model tb_akun telah disinkronkan dengan database.");
  })
  .catch((error) => {
    console.error("Gagal menyesuaikan model tb_akun dengan database:", error);
  });

module.exports = kategoriDestinasi;
