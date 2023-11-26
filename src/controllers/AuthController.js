const express = require("express");
const UserModel = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.json");

const router = express.Router();



const generateToken =  (user = {}) => {

    user.lastAccessedAt = new Date();
    
    
  return jwt.sign(
    {
      _id: user._id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastAccessedAt: user.lastAccessedAt,
    },
    authConfig.secret,
    {
      expiresIn: '30m',
    }
  );
};

router.post("/register", async (req, res) => {
  try {
    const { email, cell } = req.body;

    if (await UserModel.findOne({ email })) {
      return res.status(400).json({
        msg: "E-mail já existente",
      });
    }

    const existingUser = await UserModel.findOne({
      'cell.number': cell.number,
      'cell.ddd': cell.ddd,
    });

    if (existingUser) {
      return res.status(400).json({
        msg: "Já existe um usuário com o mesmo número e DDD",
      });
    }

    const user = await UserModel.create(req.body);
    user.password = undefined;
    user.name = undefined;
    user.cell = undefined;
    user.email = undefined;

    return res.json({
      msg: "Registrado com sucesso!",
      user,
      token: generateToken(user),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Erro no servidor." });
  }
});

router.post("/authenticate", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        msg: 'Usuário não encontrado',
      });
    }

    if (!(await bcryptjs.compare(password, user.password))) {
      return res.status(400).send({
        msg: 'Senha inválida',
      });
    }

    
    await user.save();

    
    user.password = undefined;
    user.name = undefined;
    user.cell = undefined;
    user.email = undefined;

    return res.json({
      user,
      token: generateToken(user),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

module.exports = router;