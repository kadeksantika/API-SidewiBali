const { DataTypes } = require('sequelize');
const db = require('../../config/database');

const kategoriDestinasi = db.define('tb_kategoridestinasi',{

    nama: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 50]
        }
    },
},
{
  freezeTableName:true
})
 
module.exports = kategoriDestinasi