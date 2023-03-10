"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      phone: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      fullName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      city_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      address: {
        type: Sequelize.TEXT,
      },
      imageProfile: {
        type: Sequelize.STRING,
      },
      balance: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
