const { comparePass, hashPass } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User, HistoryBalance } = require("../models");
class Controller {
  static async register(req, res, next) {
    try {
      const { username, email, phone, fullName, password, city_id, address } =
        req.body;
      const regData = await User.create({
        username,
        email,
        phone,
        fullName,
        password,
        city_id,
        address,
      });

      res.status(201).json({
        username: regData.username,
        message: "Success Created",
      });
    } catch (error) {
      next(error);
    }
  }
  static async updateImage(req, res, next) {
    try {
      const { userId } = req.params;
      const { imageProfile } = req.body;
      const updateImage = await User.update(
        { imageProfile },
        { where: { id: userId } }
      );
      if (!updateImage) throw { name: "notImage" };
    } catch (error) {
      next(error);
    }
  }
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || email == "") {
        res.status(400).json({ message: "email is require" });
      }
      if (!password || password == "") {
        res.status(400).json({ message: "password is require" });
      }
      const dataLogin = await User.findOne({ where: { email } });
      // console.log(dataLogin);
      if (!dataLogin) throw { name: "invalid" };
      if (!comparePass(password, dataLogin.password)) throw { name: "invalid" };
      const token = signToken({
        id: dataLogin.id,
        username: dataLogin.username,
      });
      res.status(200).json({
        access_key: token,
        username: dataLogin.username,
        email: dataLogin.email,
      });
    } catch (error) {
      next(error);
    }
  }
  static async getUser(req, res, next) {
    try {
      const dataUser = await User.findAll({
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      });
      res.status(200).json(dataUser);
    } catch (error) {
      next(error);
    }
  }
  static async getUserId(req, res, next) {
    try {
      const { id } = req.params;

      const dataId = await User.findByPk(id, {
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      });

      if (!dataId) throw { name: "not_found" };
      res.status(200).json(dataId);
    } catch (error) {
      next(error);
    }
  }
  static async addBalance(req, res, next) {
    try {
      const { userId } = req.params;
      const { balance } = req.body;
      const data = await User.findByPk(userId);
      const result = Number(data.balance) + Number(balance);
      const updateBalance = await User.update(
        { balance: result },
        { where: { id: userId } }
      );
      await HistoryBalance.create({
        UserId: userId,
        initialBalance: data.balance,
        transaction: balance,
        status: "credit",
      });
      const finalBalance = await User.findByPk(userId);
      res
        .status(200)
        .json({ message: `balance terUpdate ${finalBalance.balance}` });
      console.log(updateBalance);
    } catch (error) {
      next(error);
    }
  }
  static async reducedBalance(req, res, next) {
    try {
      const { userId } = req.params;
      const { balance } = req.body;
      const data = await User.findByPk(userId);
      const result = Number(data.balance) - Number(balance);
      if (result < 0) throw { name: "balance_0" };
      const updateBalance = await User.update(
        { balance: result },
        { where: { id: userId } }
      );
      await HistoryBalance.create({
        UserId: userId,
        initialBalance: data.balance,
        transaction: balance,
        status: "debit",
      });
      const finalBalance = await User.findByPk(userId);
      res
        .status(200)
        .json({ message: `balance terUpdate ${finalBalance.balance}` });
      console.log(updateBalance);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
