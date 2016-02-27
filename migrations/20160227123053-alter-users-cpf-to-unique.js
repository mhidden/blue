'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'users',
      'cpf',
      {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'users',
      'cpf',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    );
  }
};
