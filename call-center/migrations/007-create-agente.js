'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('agente', {
      id_agente: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      codigo_empleado: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      nombre_completo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    });

    // Agregar índices
    await queryInterface.addIndex('agente', ['codigo_empleado']);
    await queryInterface.addIndex('agente', ['email']);
    await queryInterface.addIndex('agente', ['activo']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('agente');
  }
};
