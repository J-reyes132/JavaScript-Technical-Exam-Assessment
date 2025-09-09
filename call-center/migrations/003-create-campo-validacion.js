'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('campo_validacion', {
      id_campo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombre_campo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      etiqueta: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tipo_dato: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'string'
      },
      validacion_regex: {
        type: Sequelize.STRING,
        allowNull: true
      },
      es_sensible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      descripcion: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });

    // Agregar índices
    await queryInterface.addIndex('campo_validacion', ['nombre_campo']);
    await queryInterface.addIndex('campo_validacion', ['tipo_dato']);
    await queryInterface.addIndex('campo_validacion', ['es_sensible']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('campo_validacion');
  }
};
