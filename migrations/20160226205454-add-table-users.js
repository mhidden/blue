'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('users', 
      { 
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        cpf: {
          type: Sequelize.STRING,
        },
        password_hash: {
          type: Sequelize.STRING
        },
        admin: {
          type: Sequelize.BOOLEAN
        },
        token: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4
        }
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};
