const { DataTypes } = require('sequelize');
const db = require('../../config/database');
const KategoriDestinasi = require('./kategoridestinasi');
const DesaWisata = require('./desawisata');

const destinasiWisata = db.define('tb_destinasiwisata',{
    nama: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        validate: {
            len: [1, 25]
        }
    },
    gambar: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    deskripsi: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    id_kategoridestinasi: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_desawisata: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName:true
});

destinasiWisata.hasOne(KategoriDestinasi, { foreignKey: 'id' });
destinasiWisata.belongsTo(DesaWisata, { foreignKey: 'id_desawisata' });

// Penanganan kesalahan saat menyinkronkan model dengan database
destinasiWisata.sync().then(() => {
    console.log('Model tb_destinasiwisata telah disinkronkan dengan database.');
}).catch(error => {
    console.error('Gagal menyesuaikan model tb_destinasiwisata dengan database:', error);
});

module.exports = destinasiWisata;