'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('campo_validacion', [
      {
        nombre_campo: 'nombre',
        etiqueta: 'Nombre Completo',
        tipo_dato: 'string',
        es_sensible: false,
        descripcion: 'Nombre completo del cliente'
      },
      {
        nombre_campo: 'cedula',
        etiqueta: 'Cédula/DNI',
        tipo_dato: 'string',
        validacion_regex: '^[0-9]{8,10}$',
        es_sensible: true,
        descripcion: 'Número de identificación del cliente'
      },
      {
        nombre_campo: 'telefono',
        etiqueta: 'Teléfono',
        tipo_dato: 'string',
        validacion_regex: '^[0-9\\-\\+\\s\\(\\)]{7,15}$',
        es_sensible: false,
        descripcion: 'Número de teléfono del cliente'
      },
      {
        nombre_campo: 'email',
        etiqueta: 'Correo Electrónico',
        tipo_dato: 'string',
        validacion_regex: '^[\\w\\.-]+@[\\w\\.-]+\\.[a-zA-Z]{2,}$',
        es_sensible: false,
        descripcion: 'Dirección de correo electrónico'
      },
      {
        nombre_campo: 'fecha_nacimiento',
        etiqueta: 'Fecha de Nacimiento',
        tipo_dato: 'date',
        es_sensible: true,
        descripcion: 'Fecha de nacimiento del cliente'
      },
      {
        nombre_campo: 'direccion',
        etiqueta: 'Dirección',
        tipo_dato: 'string',
        es_sensible: false,
        descripcion: 'Dirección de residencia'
      },
      {
        nombre_campo: 'numero_cuenta',
        etiqueta: 'Número de Cuenta',
        tipo_dato: 'string',
        validacion_regex: '^[0-9]{10,20}$',
        es_sensible: true,
        descripcion: 'Número de cuenta bancaria'
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('campo_validacion', null, {});
  }
};
