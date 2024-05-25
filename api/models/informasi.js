const { DataTypes } = require('sequelize');
const db = require("../../config/database");

const informasi = db.define(
  "tb_informasi",
  {
    no_telp: {
        type: DataTypes.STRING,
        validate: {
            len: [1, 15]
        }
    },
    no_wa: {
        type: DataTypes.STRING,
        validate: {
            len: [1, 15]
        }
    },
    facebook: {
        type: DataTypes.STRING,
        validate: {
            len: [1, 100]
        }
    },
    instagram: {
        type: DataTypes.STRING,
        validate: {
            len: [1, 100]
        }
    },
    website: {
        type: DataTypes.STRING,
        validate: {
            len: [1, 100]
        }
    },
    email: {
        type: DataTypes.STRING,
        validate: {
            len: [1, 100]
        }
    },
    id_desawisata: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
  },
  {
    freezeTableName: true,
  }
);


// Penanganan kesalahan saat menyinkronkan model dengan database
informasi
  .sync()
  .then(() => {
    console.log("Model tb_informasi telah disinkronkan dengan database.");
  })
  .catch((error) => {
    console.error(
      "Gagal menyesuaikan model tb_informasi dengan database:",
      error
    );
  });

module.exports = informasi;
