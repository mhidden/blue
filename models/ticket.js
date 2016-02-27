"use strict";

module.exports = function(sequelize, DataTypes) {
  var Ticket = sequelize.define("Ticket", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        Ticket.belongsTo(models.Event);
        Ticket.belongsTo(models.User);
      }
    }
  });

  return Ticket;
};