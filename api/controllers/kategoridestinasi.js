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

exports.getOneKategoriDestinasi = async (req, res) => {
    const { id } = req.params;
    try {
        const kategoridestinasi = await kategoriDestinasi.findAll({ where: { id:id } });
        if (!kategoridestinasi) {
            return res.status(404).json({ error: "Not found" });
        }
        res.json(kategoridestinasi);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.updateKategoriDestinasi = async(req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { nama } = req.body;

        // Pastikan Kategori Destinasi telah diinisialisasi sebelumnya
        const kategoridestinasi = await kategoriDestinasi.findByPk(id);
        
        if (!kategoridestinasi) {
            return res.status(404).json({ message: "Kategori destinasi tidak ditemukan" });
        }

        if (nama) {
            kategoridestinasi.nama = nama;
        }

        await kategoridestinasi.save();

        return res.status(200).json({ message: "Kategori destinasi berhasil diperbarui", updatedKategoriDestinasi: kategoridestinasi });
    } catch (error) {
        console.error("Error updating kategori destinasi:", error);
        return res.status(500).json({ message: "Terjadi kesalahan saat memperbarui kategori destinasi", error });
    }
};


exports.deleteKategoriDestinasi = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedkategoridestinasi = await kategoriDestinasi.destroy({
            where: {
                id: id
            }
        });
        if (deletedkategoridestinasi > 0) {
            return res.status(200).json({ message: "Kategori destinasi berhasil dihapus" });
        } else {
            return res.status(404).json({ message: "Kategori destinasi tidak ditemukan" });
        }
    } catch (error) {
        console.error("Error deleting kategori destinasi:", error);
        return res.status(500).json({ message: "Terjadi kesalahan saat menghapus kategori destinasi", error });
    }
};