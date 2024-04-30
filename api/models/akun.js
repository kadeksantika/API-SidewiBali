const { DataTypes } = require('sequelize');
const db = require('../../config/database');

const Akun = db.define('tb_akun',{
    nama: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        validate: {
            len: [1, 100]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [1, 50]
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 60]
        }
    },
    foto: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM('ADMIN', 'USER', 'SUPERADMIN'),
        allowNull: false,
        defaultValue: 'USER'
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    
}, {
    freezeTableName:true
});

// Penanganan kesalahan saat menyinkronkan model dengan database
Akun.sync().then(() => {
    console.log('Model tb_akun telah disinkronkan dengan database.');
}).catch(error => {
    console.error('Gagal menyesuaikan model tb_akun dengan database:', error);
});

module.exports = Akun;
