'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn(
      'events',
      'type',
      'event_type'
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn(
      'events',
      'event_type',
      'event'
    );
  }
};
