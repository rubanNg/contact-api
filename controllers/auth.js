const express = require("express");
const { connectToDatabase } = require('../mongodb'); 
const jwt = require("jsonwebtoken");


const TOKEN_SECRET = '09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611';
const authRouter = express.Router();

authRouter.post('/', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const user = await connection.db.collection("users").findOne({ login: req.body.login });
    if (!isValidUser(req.body, user)) {
      res.status(404).json({ message: 'Не верный логин или пароль' });
    } else {
      const token = generateAccessToken({ user: user.login, role: 'admin' });
      res.status(200).json({ login: user.login, token: token });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});


function generateAccessToken(username) {
  return jwt.sign(username, TOKEN_SECRET, { expiresIn: '100d' });
}


function isValidUser(body, user) {
  if (!user || user.password !== body.password) {
    return false;
  }
  return true;
}

module.exports = authRouter;