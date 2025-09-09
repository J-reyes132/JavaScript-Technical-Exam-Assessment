'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('configuracion_validacion', {
      id_configuracion: {
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
      id_tipo_validacion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tipo_validacion',
          key: 'id_tipo_validacion'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      campos_minimos_requeridos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      fecha_vigencia_inicio: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      fecha_vigencia_fin: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Agregar índices
    await queryInterface.addIndex('configuracion_validacion', ['id_banco']);
    await queryInterface.addIndex('configuracion_validacion', ['id_tipo_validacion']);
    await queryInterface.addIndex('configuracion_validacion', ['activo']);
    await queryInterface.addIndex('configuracion_validacion', ['fecha_vigencia_inicio']);
    await queryInterface.addIndex('configuracion_validacion', ['fecha_vigencia_fin']);
    
    // Índice único para evitar duplicados por banco y tipo de validación activo
    await queryInterface.addIndex('configuracion_validacion', 
      ['id_banco', 'id_tipo_validacion', 'activo'], 
      {
        unique: true,
        name: 'unique_banco_tipo_validacion_activo'
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('configuracion_validacion');
  }
};
