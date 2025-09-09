'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('configuracion_campo', {
      id_config_campo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_configuracion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'configuracion_validacion',
          key: 'id_configuracion'
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
      orden_presentacion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      es_obligatorio: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      valor_por_defecto: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });

    // Agregar índices
    await queryInterface.addIndex('configuracion_campo', ['id_configuracion']);
    await queryInterface.addIndex('configuracion_campo', ['id_campo']);
    await queryInterface.addIndex('configuracion_campo', ['orden_presentacion']);
    await queryInterface.addIndex('configuracion_campo', ['es_obligatorio']);
    
    // Índice único para evitar duplicados de campo en la misma configuración
    await queryInterface.addIndex('configuracion_campo', 
      ['id_configuracion', 'id_campo'], 
      {
        unique: true,
        name: 'unique_configuracion_campo'
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('configuracion_campo');
  }
};
