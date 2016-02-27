"use strict";

var passwordHash = require('password-hash')

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cpf: {
      type: DataTypes.STRING,
      unique: true
    },
    password_hash: {
      type: DataTypes.STRING
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    password: {
      type: DataTypes.VIRTUAL,
      set: function (val) {
        this.setDataValue('password', val);
        this.setDataValue('password_hash', passwordHash.generate(config.salt + val));
      },
      validate: {
        isLongEnough: function (val) {
          if (val.length < 7) {
            throw new Error("Please choose a longer password")
          }
        }
      }
    },
    token: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    }
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Ticket)
      }
    }
  });

  return User;
};