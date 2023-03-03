const bcrypt = require("bcryptjs");

const hashPass = (pass) => bcrypt.hashSync(pass, 10);
const comparePass = (pass, hash) => bcrypt.compareSync(pass, hash);

module.exports = { hashPass, comparePass };
