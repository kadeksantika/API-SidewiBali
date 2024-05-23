const notifikasi = require("../models/notifikasi");

exports.getAllNotifikasi = async (req, res) => {
    try {
        const notifikasiList = await notifikasi.findAll({
            attributes: { exclude: [] }
        });
        res.json(notifikasiList);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message});
    }
};
 
exports.postNotifikasi = async (req, res) => {
    try {
        const { deskripsi, status, id_akun } = req.body

        if(status != 1 && status !=0){
            throw new Error("Status diluar 0/1");
        }

        await notifikasi.create({
            deskripsi: deskripsi,
            status:status,
            id_akun:id_akun
        });

        return res.json({ msg: "Add successful"})
    } catch (error) {
        console.error(error);
        if (error.nama === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: 'Constraint Error' });
        }else {
            console.error("Error while creating account:", error);
            res.status(500).json({error: error.message});
        }
    }
}

exports.getOneNotifikasi = async (req, res) => {
    const { id } = req.params;
    try {
        const kategoridestinasi = await notifikasi.findAll({ where: { id:id } });
        if (!kategoridestinasi) {
            return res.status(404).json({ error: "Not found" });
        }
        res.json(kategoridestinasi);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message});
    }
}

exports.updateNotifikasi = async(req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { deskripsi, status } = req.body;

        const notif = await notifikasi.findByPk(id);
        
        if (!notif) {
            return res.status(404).json({ message: "Notifikasi tidak ditemukan" });
        }
        if(status != 1 && status != 0){
            throw new Error("Status diluar 0/1");
        }


        if (deskripsi) {
            notif.deskripsi = deskripsi;
        }
        if (status) {
            notif.status = status;
        }

        console.log(status);
        await notif.save();

        return res.status(200).json({ message: "Notifikasi berhasil diperbarui", updatedNotifikasi: notif });
    } catch (error) {
        console.error("Error updating notifikasi:", error);
        return res.status(500).json({ error: error.message });
    }
};


exports.deleteNotifikasi = async (req, res) => {
    try {
        const { id } = req.params;
        const deletednotifikasi = await notifikasi.destroy({
            where: {
                id: id
            }
        });
        if (deletednotifikasi > 0) {
            return res.status(200).json({ message: "Notifikasi berhasil dihapus" });
        } else {
            return res.status(404).json({ message: "Notifikasi tidak ditemukan" });
        }
    } catch (error) {
        console.error("Error deleting notifikasi:", error);
        return res.status(500).json({ error: error.message });
    }
};