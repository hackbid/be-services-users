const { comparePass, hashPass } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User, HistoryBalance } = require("../models");

class ControllerUpdate {
  static async updateImage(req, res, next) {
    try {
      const { userId } = req.params;
      const { imageProfile } = req.body;
      const updateImage = await User.update(
        { imageProfile },
        { where: { id: userId } }
      );
      // if (!updateImage) throw { name: "notImage" };
      if (!imageProfile) throw { name: "notImage" };
      res.status(200).json({message:'success update image'})
    } catch (error) {
        // console.log(error);
      next(error);
    }
  }
  static async addBalance(req, res, next) {
      try {
          const { userId } = req.params;
          const { balance } = req.body;
        //   console.log(req.body);
      const data = await User.findByPk(userId);
      const result = Number(data.balance) + Number(balance);
      await User.update(
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
      // console.log(updateBalance);
    } catch (error) {
        // console.log(error);
        
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
     await User.update(
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
      // console.log(updateBalance);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ControllerUpdate;
