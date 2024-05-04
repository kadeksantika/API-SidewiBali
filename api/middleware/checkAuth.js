const jwt = require('jsonwebtoken');
const Akun = require("../models/akun");


module.exports.checkAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    Akun.findOne({ where: { token: token } })
    .then((akun) => {
        if (!akun) return res.sendStatus(403); // Token tidak ditemukan di database
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403); // Token tidak valid
            req.email = decoded.email;
            next();
        });
    })
    .catch((error) => {
        console.error(error);
        res.sendStatus(500); // Kesalahan saat mencari token di database
    });
};
