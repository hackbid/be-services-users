const { User } = require("../models");
const checkUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const findUser = await User.findByPk(userId);
    if (!findUser) throw { name: "not_found" };
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkUser;
