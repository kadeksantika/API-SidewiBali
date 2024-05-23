const adminDesa = require("../models/admindesa");
const akun = require("../models/akun");
const desaWisata = require("../models/desawisata");

exports.getAllAdminDesa = async (req, res) => {
    try {
        const adminDesaList = await adminDesa.findAll({
            attributes: { exclude: [] }
        });
        res.json(adminDesaList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.postAdminDesa = async (req, res) => {
    try {
        const { id_akun, id_desawisata } = req.body

        const desawisata = await desaWisata.findByPk(id_desawisata);

        if (!desawisata) {
            return res.status(404).json({ message: "desa wisata tidak ditemukan" });
        }
        const akunlist = await akun.findByPk(id_akun);

        if (!akunlist) {
            return res.status(404).json({ message: "akun tidak ditemukan" });
        }

        const checkAdminDesaByAkun = await adminDesa.findOne({
            where: {
                id_akun: id_akun
            }
        });
        if (checkAdminDesaByAkun) {
            return res.status(404).json({ message: "akun sudah menjadi suatu Admin desa" });
        }
        const checkAdminDesaByDesa = await adminDesa.findOne({
            where: {
                id_desawisata: id_desawisata
            }
        });
        if (checkAdminDesaByDesa) {
            return res.status(404).json({ message: "desa sudah memiliki Admin desa" });
        }

        await adminDesa.create({
            id_akun: id_akun,
            id_desawisata: id_desawisata
        });

        return res.json({ msg: "Add successful" })
    } catch (error) {
        console.error(error);
        // if (error.adminDesa === 'SequelizeUniqueConstraintError') {
        //     res.status(400).json({ error: 'Constraint Error' });
        // }else {
        console.error("Error while creating admindesa:", error);
        res.status(500).json({ error: error.message });
        // }
    }
}

exports.getOneAdminDesa = async (req, res) => {
    const { id } = req.params;
    try {
        const admindesa = await adminDesa.findAll({ where: { id: id } });
        if (!admindesa) {
            return res.status(404).json({ error: "Not found" });
        }
        res.json(admindesa);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
exports.getAdminDesaByIdAkun = async (req, res) => {
    const { id } = req.params;
    // return res.json(id)
    try {
        const admindesa = await adminDesa.findAll({ where: { id_akun: id } });
        if (!admindesa) {
            return res.status(404).json({ error: "Not found" });
        }
        res.json(admindesa);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.updateAdminDesa = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { id_akun, id_desawisata } = req.body

        // Pastikan Kategori Destinasi telah diinisialisasi sebelumnya
        const admindesa = await adminDesa.findByPk(id);

        if (!admindesa) {
            return res.status(404).json({ message: "admin desa tidak ditemukan" });
        }

        const desawisata = await desaWisata.findByPk(id_desawisata);

        if (!desawisata) {
            return res.status(404).json({ message: "desa wisata tidak ditemukan" });
        }
        const akunlist = await akun.findByPk(id_akun);

        if (!akunlist) {
            return res.status(404).json({ message: "akun tidak ditemukan" });
        }
        if (id_akun) {
            const checkAdminDesaByAkun = await adminDesa.findOne({
                where: {
                    id_akun: id_akun
                }
            });
            if (checkAdminDesaByAkun) {
                return res.status(404).json({ message: "akun sudah menjadi suatu Admin desa" });
            }
            admindesa.id_akun = id_akun
        }
        if (id_desawisata) {
            const checkAdminDesaByDesa = await adminDesa.findOne({
                where: {
                    id_desawisata: id_desawisata
                }
            });
            if (checkAdminDesaByDesa) {
                return res.status(404).json({ message: "desa sudah memiliki Admin desa" });
            }
            admindesa.id_desawisata = id_desawisata
        }

        await admindesa.save();

        return res.status(200).json({ message: "admin desa berhasil diperbarui", updatedAdminDesa: admindesa });
    } catch (error) {
        console.error("Error updating admin desa:", error);
        return res.status(500).json({ error: error.message });
    }
};


exports.deleteAdminDesa = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedadmindesa = await adminDesa.destroy({
            where: {
                id: id
            }
        });
        if (deletedadmindesa > 0) {
            return res.status(200).json({ message: "admin desa berhasil dihapus" });
        } else {
            return res.status(404).json({ message: "admin desa tidak ditemukan" });
        }
    } catch (error) {
        console.error("Error deleting admin desa:", error);
        return res.status(500).json({error: error.message});
    }
};