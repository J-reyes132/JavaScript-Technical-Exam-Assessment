'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('llamada', {
      id_llamada: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_cliente: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cliente',
          key: 'id_cliente'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_agente: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'agente',
          key: 'id_agente'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fecha_hora_inicio: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      fecha_hora_fin: {
        type: Sequelize.DATE,
        allowNull: true
      },
      motivo_llamada: {
        type: Sequelize.STRING,
        allowNull: true
      },
      estado_validacion: {
        type: Sequelize.STRING,
        allowNull: true
      },
      campos_correctos: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      campos_requeridos: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      }
    });

    // Agregar índices
    await queryInterface.addIndex('llamada', ['id_cliente']);
    await queryInterface.addIndex('llamada', ['id_agente']);
    await queryInterface.addIndex('llamada', ['fecha_hora_inicio']);
    await queryInterface.addIndex('llamada', ['fecha_hora_fin']);
    await queryInterface.addIndex('llamada', ['estado_validacion']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('llamada');
  }
};
