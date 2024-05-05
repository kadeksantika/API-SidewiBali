// MODEL, GANTI SESUAI DENGAN YANG DIBUTUHKAN
const Akun = require("../models/akun");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.getAllAkun = async (req, res) => {
  try {
    const akunList = await Akun.findAll({
      attributes: { exclude: [] },
    });
    const accessTokenCookies = req.cookies.accessToken;
    console.log("Access token:", accessTokenCookies);
    res.json(akunList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOneAkun = async (req, res) => {
  const { id_akun } = req.params;
  try {
    const akun = await Akun.findOne({ where: { id: id_akun } });
    if (!akun) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.json(akun);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.postAkun = async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;
    const foto = req.file.filename;

    // Generate salt untuk hash password
    const salt = await bcrypt.genSalt();

    // Hash password menggunakan salt yang dihasilkan
    const hashPassword = await bcrypt.hash(password, salt);

    // Buat akun baru dengan password yang di-hash
    await Akun.create({
      nama: nama,
      email: email,
      password: hashPassword,
      foto: foto,
      role: role,
    });

    // Kirim respons bahwa registrasi berhasil
    res.json({ msg: "Registration successful" });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ error: "Email already exists" });
    } else if (error.name === "SequelizeValidationError") {
      res.status(400).json({ error: error.errors[0].message });
    } else {
      console.error("Error while creating account:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
exports.login = async (req, res) => {
  try {
    if (!req.body.password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (!req.body.email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const akun = await Akun.findAll({
      where: {
        email: req.body.email,
      },
    });

    const match = await bcrypt.compare(req.body.password, akun[0].password);

    if (!match) return res.status(400).json({ message: "Wrong Password" });

    const id = akun[0].id;
    const nama = akun[0].nama;
    const email = akun[0].email;
    const accessToken = jwt.sign(
      { id, nama, email },
      process.env.ACCESS_TOKEN_SECRET
    //   ,
    //   {
    //     expiresIn: "1d",
    //   }
    );
    await Akun.update(
      { token: accessToken },
      {
        where: {
          id: id,
        },
      }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
    //   maxAge: 24 * 60 * 60 * 1000,
    });

   
    res.json(accessToken);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// Login with refresh Token
// exports.login = async (req, res) => {
//     try {
//         if (!req.body.password) {
//             return res.status(400).json({ message: "Password are required" });
//         }
//         if (!req.body.email) {
//             return res.status(400).json({ message: "Email are required" });
//         }

//         const akun = await Akun.findAll({
//             where:{
//                 email: req.body.email
//             }
//         });

//         const match = await bcrypt.compare(req.body.password, akun[0].password);

//         if(!match) return res.status(400).json({message: "Wrong Password"});

//         const id = akun[0].id;
//         const nama = akun[0].nama;
//         const email = akun[0].email;
//         const accessToken = jwt.sign({id,nama,email},process.env.ACCESS_TOKEN_SECRET,{
//             expiresIn: '20s'
//         })
//         const refreshToken = jwt.sign({id,email},process.env.REFRESH_TOKEN_SECRET,{
//             expiresIn: '1d'
//         })
//         await Akun.update({token:refreshToken},{
//             where:{
//                 id:id
//             }
//         });
//         res.cookie('refreshToken',refreshToken,{
//             httpOnly:true,
//             maxAge:24*60*60*1000,
//             // secure: true
//         })
//         res.json(accessToken);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

exports.deleteAkun = async (req, res) => {
  try {
    const { id_akun } = req.params;
    const deletedAccountCount = await Akun.destroy({
      where: {
        id: id_akun,
      },
    });
    if (deletedAccountCount > 0) {
      return res.status(200).json({ message: "Akun berhasil dihapus" });
    } else {
      return res.status(404).json({ message: "Akun tidak ditemukan" });
    }
  } catch (error) {
    console.error("Error deleting account:", error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan saat menghapus akun", error });
  }
};

exports.updateAkun = async (req, res) => {
  try {
    const id_akun = parseInt(req.params.id_akun);
    const { nama, email, password, foto, role } = req.body;

    // Pastikan Akun telah diinisialisasi sebelumnya
    const akun = await Akun.findByPk(id_akun);

    if (!akun) {
      return res.status(404).json({ message: "Akun tidak ditemukan" });
    }

    if (nama) {
      akun.nama = nama;
    }
    if (email) {
      akun.email = email;
    }
    if (password) {
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      akun.password = hashPassword;
    }
    if (foto) {
      akun.foto = foto;
    }
    if (role) {
      akun.role = role;
    }

    await akun.save();

    return res
      .status(200)
      .json({ message: "Akun berhasil diperbarui", updatedAccount: akun });
  } catch (error) {
    console.error("Error updating account:", error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan saat memperbarui akun", error });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const akun = await Akun.findAll({
      where: {
        token: refreshToken,
      },
    });
    if (!akun[0]) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        const id = akun[0].id;
        const nama = akun[0].nama;
        const email = akun[0].email;
        const accessToken = jwt.sign(
          { id, nama, email },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "15s",
          }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
exports.logout = async (req, res) => {
  try {
    // return res.json()
    const accessToken = req.cookies.accessToken;

    if (!accessToken) return res.sendStatus(401);
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    const id = decoded.id;
    await Akun.update(
      { token: null },
      {
        where: {
          id: id,
        },
      }
    );
    res.clearCookie("accessToken");
    
    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

// logut tanpa refresh Token
// exports.logout = async(req,res)=>{
//     try {
//         const refreshToken = req.cookies.refreshToken;
//         if(!refreshToken) return res.sendStatus(204);
//         const akun = await Akun.findAll({
//             where:{
//                 token: refreshToken
//             }
//         });
//         if(!akun[0]) return res.sendStatus(204);
//         const id = akun[0].id;
//         await Akun.update({token:null},{
//             where:{
//                 id:id
//             }
//         });
//         res.clearCookie('refreshToken');
//         return res.sendStatus(200);
//     } catch (error) {
//         console.log(error)
//     }
// }