const { comparePass, hashPass } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const mailer = "https://mailer-hackbid-production.up.railway.app";
const axios = require("axios");
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
      if (regData) {
        await axios.post(mailer + `/register`, {
          mailto: regData.email,
          user: regData.fullName,
        });
      }

      const returnData = {
        ...regData,
        regData: delete regData.dataValues.password,
        regData: delete regData._previousDataValues.password,
      };

      res.status(201).json(returnData);
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
        id: dataLogin.id,
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
        attributes: { exclude: ["password", "updatedAt"] },
      });

      if (!dataId) throw { name: "not_found" };
      res.status(200).json(dataId);
    } catch (error) {
      next(error);
    }
  }

  static async getHistoryBalance(req, res, next) {
    // console.log("nasuk");
    try {
      const { userId } = req.params;
      const getHistory = await HistoryBalance.findAll({
        where: { UserId: userId },
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json(getHistory);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
