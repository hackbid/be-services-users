const jwt = require("jsonwebtoken");
const kode = process.env.CODE_JWT;

const signToken = (payload) => jwt.sign(payload, kode);
const verivyToken = (token) => jwt.verify(token, kode);

module.exports = { signToken, verivyToken };
