'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('banco', {
      id_banco: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      codigo_banco: {
        type: Sequelize.STRING,
        allowNull: true
      },
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      fecha_creacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Agregar índices
    await queryInterface.addIndex('banco', ['nombre']);
    await queryInterface.addIndex('banco', ['codigo_banco']);
    await queryInterface.addIndex('banco', ['activo']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('banco');
  }
};
