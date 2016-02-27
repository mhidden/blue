'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('events', 
      { 
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        description: {
          type: Sequelize.STRING,
          allowNull: false
        },
        organizer: {
          type: Sequelize.STRING,
          allowNull: false
        },
        date: {
          type: Sequelize.DATE,
          allowNull: false
        },
        capacity: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        type: {
          type: Sequelize.ENUM('show', 'balada', 'teatro', 'esporte'),
          allowNull: false
        },
        published: { 
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        }
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('events');
  }
};
