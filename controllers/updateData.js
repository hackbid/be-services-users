const midTransaction = require("../helpers/midtrans");
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
      res.status(200).json({ message: "success update image" });
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }
  static async payment(req, res, next) {
    try {
      const { balance } = req.body;
      const { userId } = req.params;
      const data = await User.findByPk(userId);
      const dataUser = {
        ...data,
      };
      delete dataUser.password;
      const Tokentrans = await midTransaction(dataUser, balance);
      console.log(Tokentrans);
      res.status(200).json(Tokentrans);
    } catch (error) {
      next(error);
    }
  }
  static async addBalance(req, res, next) {
    try {
      const { userId } = req.params;
      const { balance } = req.body;
      const data = await User.findByPk(userId);
      const dataUser = {
        ...data,
      };
      delete dataUser.password;
      const result = Number(data.balance) + Number(balance);
      await User.update({ balance: result }, { where: { id: userId } });
      await HistoryBalance.create({
        UserId: userId,
        initialBalance: data.balance,
        transaction: balance,
        status: "in",
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
      console.log("masuk");
      const { userId } = req.params;
      const { balance } = req.body;
      const data = await User.findByPk(userId);
      const result = Number(data.balance) - Number(balance);
      if (result < 0) throw { name: "balance_0" };
      await User.update({ balance: result }, { where: { id: userId } });
      await HistoryBalance.create({
        UserId: userId,
        initialBalance: data.balance,
        transaction: balance,
        status: "out",
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
  static async reportWD(req, res, next) {
    try {
      const { userId } = req.params;
      const { balance } = req.body;
      const data = await User.findByPk(userId);
      const result = Number(data.balance) - Number(balance);
      if (result < 0) throw { name: "balance_0" };
      const reportWD = await HistoryBalance.create({
        UserId: userId,
        initialBalance: data.balance,
        transaction: balance,
        status: "pending",
      });
      res.status(200).json({ message: "transaction on progress" });
    } catch (error) {
      next(error);
    }
  }
  static async approveWD(req, res, next) {
    try {
      const { id } = req.params;
      await HistoryBalance.update({ status: "out" }, { where: { id } });
      const findHistory = await HistoryBalance.findByPk(id);
      if (!findHistory) throw { name: "notReport" };
      if (findHistory.status === "out") {
        const data = await User.findByPk(findHistory.dataValues.UserId);
        const result =
          Number(data.dataValues.balance) -
          Number(findHistory.dataValues.transaction);
        if (result < 0) throw { name: "balance_0" };
        await User.update(
          { balance: result },
          { where: { id: findHistory.dataValues.UserId } }
        );
      }
      res.status(200).send("Withdrawal request approved successfully");
    } catch (error) {
      next(error);
    }
  }
  static async getReportWD(req, res, next) {
    try {
      const wdReported = await HistoryBalance.findAll({
        where: { status: "pending" },
      });
      if (!wdReported) throw { name: "notReport" };
      res.status(200).json(wdReported);
    } catch (error) {
      next(error);
    }
  }
  static async rejectWD(req, res, next) {
    try {
      const { id } = req.params;
      const findHistory = await HistoryBalance.findByPk(id);
      if (!findHistory) throw { name: "notReport" };
      await HistoryBalance.update({ status: "rejected" }, { where: { id } });
      res.status(200).json({ message: "success reject withdraw" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ControllerUpdate;
