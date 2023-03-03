"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class HistoryBalance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      HistoryBalance.belongsTo(models.User);
    }
  }
  HistoryBalance.init(
    {
      UserId: DataTypes.INTEGER,
      initialBalance: DataTypes.INTEGER,
      transaction: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "HistoryBalance",
    }
  );
  return HistoryBalance;
};
