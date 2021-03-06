"use strict";

module.exports = function(sequelize, DataTypes) {
  var Event = sequelize.define("Event", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    organizer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        inFuture: function (val) {
          if (val < new Date()) {
            throw new Error("Please choose date in future");
          }
        }
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    event_type: {
      type: DataTypes.ENUM('show', 'balada', 'teatro', 'esporte'),
      allowNull: false
    },
    published: { 
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        canPublish: function (val) {
          if (new Date() > this.date) {
            throw new Error("You cannot publish past events");
          }
        }
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        Event.hasMany(models.Ticket)
      }
    }
  });

  return Event;
};