const DestinasiFavorit = require("../models/destinasifavorit");
const akun = require("../models/akun");
const DestinasiWisata = require("../models/destinasiwisata");

exports.getAllDestinasiFavorit = async (req, res) => {
    try {
        const DestinasiFavoritList = await DestinasiFavorit.findAll({
            attributes: { exclude: [] }
        });
        res.json(DestinasiFavoritList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.postDestinasiFavorit = async (req, res) => {
    try {
        const { id_akun, id_destinasiwisata } = req.body

        const destinasiwisata = await DestinasiWisata.findByPk(id_destinasiwisata);

        if (!destinasiwisata) {
            return res.status(404).json({ message: "Destinasi wisata tidak ditemukan" });
        }
        const akunlist = await akun.findByPk(id_akun);

        if (!akunlist) {
            return res.status(404).json({ message: "akun tidak ditemukan" });
        }

        await DestinasiFavorit.create({
            id_akun: id_akun,
            id_destinasiwisata: id_destinasiwisata
        });

        return res.json({ msg: "Add successful" })
    } catch (error) {
        console.error(error);
        // if (error.DestinasiFavorit === 'SequelizeUniqueConstraintError') {
        //     res.status(400).json({ error: 'Constraint Error' });
        // }else {
        console.error("Error while creating destinasifavorit:", error);
        res.status(500).json({ error: error.message });
        // }
    }
}

exports.getOneDestinasiFavorit = async (req, res) => {
    const { id } = req.params;
    try {
        const destinasifavorit = await DestinasiFavorit.findAll({ where: { id: id } });
        if (!destinasifavorit) {
            return res.status(404).json({ error: "Not found" });
        }
        res.json(destinasifavorit);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
exports.getDestinasiFavoritByIdAkun = async (req, res) => {
    const { id } = req.params;
    // return res.json(id)
    try {
        const destinasifavorit = await DestinasiFavorit.findAll({ where: { id_akun: id } });
        if (!destinasifavorit) {
            return res.status(404).json({ error: "Not found" });
        }
        res.json(destinasifavorit);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.updateDestinasiFavorit = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { id_akun, id_destinasiwisata } = req.body

        // Pastikan Kategori Destinasi telah diinisialisasi sebelumnya
        const destinasifavorit = await DestinasiFavorit.findByPk(id);

        if (!destinasifavorit) {
            return res.status(404).json({ message: "destinasi favorit tidak ditemukan" });
        }

        const destinasiwisata = await DestinasiWisata.findByPk(id_destinasiwisata);

        if (!destinasiwisata) {
            return res.status(404).json({ message: "Destinasi wisata tidak ditemukan" });
        }
        const akunlist = await akun.findByPk(id_akun);

        if (!akunlist) {
            return res.status(404).json({ message: "akun tidak ditemukan" });
        }
        if (id_akun) {
            destinasifavorit.id_akun = id_akun
        }
        if (id_destinasiwisata) {
            destinasifavorit.id_destinasiwisata = id_destinasiwisata
        }

        await destinasifavorit.save();

        return res.status(200).json({ message: "destinasi favorit berhasil diperbarui", updatedDestinasiFavorit: destinasifavorit });
    } catch (error) {
        console.error("Error updating destinasi favorit:", error);
        return res.status(500).json({ error: error.message });
    }
};


exports.deleteDestinasiFavorit = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteddestinasifavorit = await DestinasiFavorit.destroy({
            where: {
                id: id
            }
        });
        if (deleteddestinasifavorit > 0) {
            return res.status(200).json({ message: "destinasi favorit berhasil dihapus" });
        } else {
            return res.status(404).json({ message: "destinasi favorit tidak ditemukan" });
        }
    } catch (error) {
        console.error("Error deleting destinasi favorit:", error);
        return res.status(500).json({error: error.message});
    }
};