'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tipo_validacion', {
      id_tipo_validacion: {
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
      descripcion: {
        type: Sequelize.STRING,
        allowNull: true
      },
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    });

    // Agregar índices
    await queryInterface.addIndex('tipo_validacion', ['nombre']);
    await queryInterface.addIndex('tipo_validacion', ['activo']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tipo_validacion');
  }
};
