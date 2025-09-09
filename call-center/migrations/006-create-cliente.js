'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cliente', {
      id_cliente: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_banco: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'banco',
          key: 'id_banco'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tipo_cliente: {
        type: Sequelize.STRING,
        allowNull: true
      },
      numero_identificacion: {
        type: Sequelize.STRING,
        allowNull: true
      },
      nombre_completo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      razon_social: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fecha_registro: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Agregar índices
    await queryInterface.addIndex('cliente', ['id_banco']);
    await queryInterface.addIndex('cliente', ['numero_identificacion']);
    await queryInterface.addIndex('cliente', ['tipo_cliente']);
    await queryInterface.addIndex('cliente', ['fecha_registro']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cliente');
  }
};
