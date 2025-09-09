'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('validacion_llamada', {
      id_validacion: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_llamada: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'llamada',
          key: 'id_llamada'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_campo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'campo_validacion',
          key: 'id_campo'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      valor_proporcionado: {
        type: Sequelize.STRING,
        allowNull: true
      },
      valor_esperado: {
        type: Sequelize.STRING,
        allowNull: true
      },
      es_correcto: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      timestamp_validacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Agregar índices
    await queryInterface.addIndex('validacion_llamada', ['id_llamada']);
    await queryInterface.addIndex('validacion_llamada', ['id_campo']);
    await queryInterface.addIndex('validacion_llamada', ['es_correcto']);
    await queryInterface.addIndex('validacion_llamada', ['timestamp_validacion']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('validacion_llamada');
  }
};
