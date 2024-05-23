const { DataTypes } = require('sequelize');
const db = require('../../config/database');


const desaWisata = db.define('tb_desawisata',{
    nama: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        validate: {
            len: [1, 25]
        }
    },
    slug: {
        type: DataTypes.STRING,
        validate: {
          len: [1, 35],
        },
        allowNull: false,
      },
    alamat: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    gambar: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    deskripsi: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    maps: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    
    kategori: {
        type: DataTypes.ENUM('Rintisan', 'Berkembang', 'Maju','Mandiri'),
        allowNull: false
    },
    kabupaten: {
        type: DataTypes.ENUM('Badung', 'Bangli', 'Buleleng', 'Denpasar', 'Gianyar', 'Jembrana', 'Karangasem', 'Klungkung', 'Tabanan'),
        allowNull: false
    }
}, {
    freezeTableName:true
});

// Penanganan kesalahan saat menyinkronkan model dengan database
desaWisata.sync().then(() => {
    console.log('Model tb_desawisata telah disinkronkan dengan database.');
}).catch(error => {
    console.error('Gagal menyesuaikan model tb_desawisata dengan database:', error);
});

module.exports = desaWisata;