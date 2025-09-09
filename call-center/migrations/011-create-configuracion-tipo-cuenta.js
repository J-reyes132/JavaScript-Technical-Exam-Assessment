'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('configuracion_tipo_cuenta', {
      id_config_tipo_cuenta: {
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
      id_tipo_cuenta: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tipo_cuenta',
          key: 'id_tipo_cuenta'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    });

    // Agregar índices
    await queryInterface.addIndex('configuracion_tipo_cuenta', ['id_configuracion']);
    await queryInterface.addIndex('configuracion_tipo_cuenta', ['id_tipo_cuenta']);
    await queryInterface.addIndex('configuracion_tipo_cuenta', ['activo']);
    
    // Índice único para evitar duplicados
    await queryInterface.addIndex('configuracion_tipo_cuenta', 
      ['id_configuracion', 'id_tipo_cuenta'], 
      {
        unique: true,
        name: 'unique_config_tipo_cuenta'
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('configuracion_tipo_cuenta');
  }
};
