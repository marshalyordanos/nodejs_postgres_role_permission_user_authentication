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
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,

        validate: {
          notEmpty: true,
        },
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        // allowNull defaults to true
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },

      address: {
        type: Sequelize.STRING,
      },

      email: {
        type: Sequelize.STRING,
        validate: {
          isEmail: true,
        },
        unique: true,
      },
      gender: {
        type: Sequelize.ENUM,
        values: ["male", "female"],
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      birthDate: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      passwordConfirm: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          notEmpty: false,
        },
        validate: {
          isValid(value) {
            if (value !== this.password) {
              throw new Error("is too larg hahahahaha");
            }
          },
        },
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      RoleId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Roles",
          key: "id",
        },
      },
      badge: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
