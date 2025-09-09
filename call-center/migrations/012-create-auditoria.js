'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('auditoria', {
      id_auditoria: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      tabla_afectada: {
        type: Sequelize.STRING,
        allowNull: false
      },
      operacion: {
        type: Sequelize.STRING,
        allowNull: false
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      fecha_hora: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      datos_anteriores: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      datos_nuevos: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      ip_origen: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });

    // Agregar índices
    await queryInterface.addIndex('auditoria', ['tabla_afectada']);
    await queryInterface.addIndex('auditoria', ['operacion']);
    await queryInterface.addIndex('auditoria', ['id_usuario']);
    await queryInterface.addIndex('auditoria', ['fecha_hora']);
    await queryInterface.addIndex('auditoria', ['ip_origen']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('auditoria');
  }
};
