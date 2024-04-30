const kategoriDestinasi = require("../models/kategoridestinasi");

exports.getAllKategoriDestinasi = async (req, res) => {
    try {
        const kategoriDestinasiList = await kategoriDestinasi.findAll({
            attributes: { exclude: [] }
        });
        res.json(kategoriDestinasiList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
 
exports.postKategoriDestinasi = async (req, res) => {
    try {
        const { nama } = req.body
        // return res.json(createAt);
        await kategoriDestinasi.create({
            nama: nama
        });

        return res.json({ msg: "Add successful"})
    } catch (error) {
        console.error(error);
        if (error.nama === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: 'Constraint Error' });
        }else {
            console.error("Error while creating account:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}