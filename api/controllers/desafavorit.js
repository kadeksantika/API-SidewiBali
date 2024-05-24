const DesaFavorit = require("../models/desafavorit");
const akun = require("../models/akun");
const desaWisata = require("../models/desawisata");

exports.getAllDesaFavorit = async (req, res) => {
    try {
        const DesaFavoritList = await DesaFavorit.findAll({
            attributes: { exclude: [] }
        });
        res.json(DesaFavoritList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.postDesaFavorit = async (req, res) => {
    try {
        const { id_akun, id_desawisata } = req.body

        const desawisata = await desaWisata.findByPk(id_desawisata);

        if (!desawisata) {
            return res.status(404).json({ message: "Favorit tidak ditemukan" });
        }
        const akunlist = await akun.findByPk(id_akun);

        if (!akunlist) {
            return res.status(404).json({ message: "akun tidak ditemukan" });
        }

        await DesaFavorit.create({
            id_akun: id_akun,
            id_desawisata: id_desawisata
        });

        return res.json({ msg: "Add successful" })
    } catch (error) {
        console.error(error);
        // if (error.DesaFavorit === 'SequelizeUniqueConstraintError') {
        //     res.status(400).json({ error: 'Constraint Error' });
        // }else {
        console.error("Error while creating desafavorit:", error);
        res.status(500).json({ error: error.message });
        // }
    }
}

exports.getOneDesaFavorit = async (req, res) => {
    const { id } = req.params;
    try {
        const desafavorit = await DesaFavorit.findAll({ where: { id: id } });
        if (!desafavorit) {
            return res.status(404).json({ error: "Not found" });
        }
        res.json(desafavorit);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
exports.getDesaFavoritByIdAkun = async (req, res) => {
    const { id } = req.params;
    // return res.json(id)
    try {
        const desafavorit = await DesaFavorit.findAll({ where: { id_akun: id } });
        if (!desafavorit) {
            return res.status(404).json({ error: "Not found" });
        }
        res.json(desafavorit);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.updateDesaFavorit = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { id_akun, id_desawisata } = req.body

        // Pastikan Kategori Destinasi telah diinisialisasi sebelumnya
        const desafavorit = await DesaFavorit.findByPk(id);

        if (!desafavorit) {
            return res.status(404).json({ message: "Favorit tidak ditemukan" });
        }

        const desawisata = await desaWisata.findByPk(id_desawisata);

        if (!desawisata) {
            return res.status(404).json({ message: "Desa wisata tidak ditemukan" });
        }
        const akunlist = await akun.findByPk(id_akun);

        if (!akunlist) {
            return res.status(404).json({ message: "akun tidak ditemukan" });
        }
        if (id_akun) {
            desafavorit.id_akun = id_akun
        }
        if (id_desawisata) {
            desafavorit.id_desawisata = id_desawisata
        }

        await desafavorit.save();

        return res.status(200).json({ message: "desa favorit berhasil diperbarui", updatedDesaFavorit: desafavorit });
    } catch (error) {
        console.error("Error updating desa favorit:", error);
        return res.status(500).json({ error: error.message });
    }
};


exports.deleteDesaFavorit = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteddesafavorit = await DesaFavorit.destroy({
            where: {
                id: id
            }
        });
        if (deleteddesafavorit > 0) {
            return res.status(200).json({ message: "desa favorit berhasil dihapus" });
        } else {
            return res.status(404).json({ message: "desa favorit tidak ditemukan" });
        }
    } catch (error) {
        console.error("Error deleting desa favorit:", error);
        return res.status(500).json({error: error.message});
    }
};