"use strict";
const { Model } = require("sequelize");
const { hashPass } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.HistoryBalance);
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { args: true, msg: "username already used" },
        validate: {
          notNull: { msg: "username is required" },
          notEmpty: { msg: "username is required" },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { args: true, msg: "email already used" },
        validate: {
          notNull: { msg: "email is required" },
          notEmpty: { msg: "email is required" },
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { args: true, msg: "phone already used" },
        validate: {
          notNull: { msg: "phone number is required" },
          notEmpty: { msg: "phone number is required" },
        },
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "fullName is required" },
          notNull: { msg: "fullName is required" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "password is required" },
          notEmpty: { msg: "password is required" },
        },
      },
      city_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "city is required" },
          notNull: { msg: "city is required" },
        },
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "address is required" },
          notEmpty: { msg: "address is required" },
        },
      },
      imageProfile: {
        type: DataTypes.STRING,
      },
      balance: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate(instance, options) {
          instance.balance = 0;
          instance.password = hashPass(instance.password);
        },
      },
    }
  );
  return User;
};
