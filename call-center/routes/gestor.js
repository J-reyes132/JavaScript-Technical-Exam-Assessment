const express = require('express');
const router = express.Router();
const { 
  Banco, 
  TipoValidacion, 
  ConfiguracionValidacion, 
  ConfiguracionCampo, 
  CampoValidacion,
  sequelize 
} = require('../models/Index');

/**
 * @swagger
 * tags:
 *   name: Call Center
 *   description: API para gestionar configuraciones de clientes en un call center
 */

/**
 * @swagger
 * /configuracion:
 *   post:
 *     summary: Crear una configuración
 *     tags: [Configuracion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               banco:
 *                 type: string
 *               tipoValidacion:
 *                 type: string
 *               campos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     campo:
 *                       type: string
 *                     esObligatorio:
 *                       type: boolean
 *                     orden:
 *                       type: integer
 *               camposMinimosRequeridos:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Configuración creada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 config:
 *                   type: object
 *       400:
 *         description: Datos insuficientes o error de validación
 */
router.post('/configuracion', async (req, res) => {
    try {
        const { banco, tipoValidacion, campos, camposMinimosRequeridos } = req.body;
        
        if (!banco || !tipoValidacion || !Array.isArray(campos)) {
            return res.status(400).json({ error: 'Datos insuficientes' });
        }

        // Validar que camposMinimosRequeridos no sea mayor que el número de campos obligatorios
        const camposObligatorios = campos.filter(c => c.esObligatorio).length;
        if (camposMinimosRequeridos && camposMinimosRequeridos > camposObligatorios) {
            return res.status(400).json({ 
                error: 'Los campos mínimos requeridos no pueden ser mayores que los campos obligatorios' 
            });
        }

        const transaction = await sequelize.transaction();
        
        try {
            // Buscar o crear banco
            const [bancoRecord] = await Banco.findOrCreate({
                where: { nombre: banco },
                defaults: {
                    nombre: banco,
                    codigo_banco: banco.toUpperCase(),
                    activo: true,
                    fecha_creacion: new Date()
                },
                transaction
            });

            // Buscar o crear tipo de validación
            const [tipoValidacionRecord] = await TipoValidacion.findOrCreate({
                where: { nombre: tipoValidacion },
                defaults: {
                    nombre: tipoValidacion,
                    descripcion: `Validación ${tipoValidacion}`,
                    activo: true
                },
                transaction
            });

            // Crear configuración de validación
            const configuracion = await ConfiguracionValidacion.create({
                id_banco: bancoRecord.id_banco,
                id_tipo_validacion: tipoValidacionRecord.id_tipo_validacion,
                campos_minimos_requeridos: camposMinimosRequeridos || camposObligatorios,
                activo: true,
                fecha_vigencia_inicio: new Date()
            }, { transaction });

            // Procesar cada campo
            const camposConfig = [];
            for (const campo of campos) {
                // Buscar o crear campo de validación
                const [campoValidacion] = await CampoValidacion.findOrCreate({
                    where: { nombre_campo: campo.campo },
                    defaults: {
                        nombre_campo: campo.campo,
                        etiqueta: campo.campo,
                        tipo_dato: 'string',
                        es_sensible: false,
                        descripcion: `Campo ${campo.campo}`
                    },
                    transaction
                });

                // Crear configuración del campo
                const configCampo = await ConfiguracionCampo.create({
                    id_configuracion: configuracion.id_configuracion,
                    id_campo: campoValidacion.id_campo,
                    orden_presentacion: campo.orden || 1,
                    es_obligatorio: campo.esObligatorio || false
                }, { transaction });

                camposConfig.push({
                    campo: campo.campo,
                    esObligatorio: campo.esObligatorio || false,
                    orden: campo.orden || 1
                });
            }

            await transaction.commit();

            const response = {
                id_configuracion: configuracion.id_configuracion,
                banco: banco,
                tipoValidacion: tipoValidacion,
                camposMinimosRequeridos: configuracion.campos_minimos_requeridos,
                campos: camposConfig,
                activo: true
            };

            res.json({ mensaje: 'Configuración creada exitosamente', config: response });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error('Error creando configuración:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/**
 * @swagger
 * /configuracion/{banco}/{tipoValidacion}:
 *   get:
 *     summary: Obtener configuración por banco y tipo de validación
 *     tags: [Configuracion]
 *     parameters:
 *       - in: path
 *         name: banco
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: tipoValidacion
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Configuración encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: No encontrada
 */
router.get('/configuracion/:banco/:tipoValidacion', async (req, res) => {
    try {
        const { banco, tipoValidacion } = req.params;
        
        // Buscar la configuración con sus relaciones
        const configuracion = await ConfiguracionValidacion.findOne({
            include: [
                {
                    model: Banco,
                    where: { nombre: banco },
                    required: true
                },
                {
                    model: TipoValidacion,
                    where: { nombre: tipoValidacion },
                    required: true
                },
                {
                    model: ConfiguracionCampo,
                    include: [{
                        model: CampoValidacion
                    }],
                    required: false
                }
            ],
            where: { activo: true }
        });

        if (!configuracion) {
            return res.status(404).json({ error: 'Configuración no encontrada' });
        }

        // Formatear la respuesta
        const campos = configuracion.ConfiguracionCampos ? 
            configuracion.ConfiguracionCampos.map(configCampo => ({
                campo: configCampo.CampoValidacion.nombre_campo,
                esObligatorio: configCampo.es_obligatorio,
                orden: configCampo.orden_presentacion
            })) : [];

        const response = {
            id_configuracion: configuracion.id_configuracion,
            banco: banco,
            tipoValidacion: tipoValidacion,
            camposMinimosRequeridos: configuracion.campos_minimos_requeridos,
            campos: campos,
            activo: configuracion.activo,
            fechaVigenciaInicio: configuracion.fecha_vigencia_inicio,
            fechaVigenciaFin: configuracion.fecha_vigencia_fin
        };

        res.json(response);
    } catch (error) {
        console.error('Error obteniendo configuración:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/**
 * @swagger
 * /validar/{banco}/{tipoValidacion}:
 *   post:
 *     summary: Validar respuestas del cliente contra datos reales
 *     description: |
 *       Valida las respuestas proporcionadas por el cliente comparándolas con los datos reales del sistema.
 *       Utiliza la configuración específica del banco y tipo de validación para determinar qué campos validar
 *       y cuáles son obligatorios. Retorna un análisis completo con estados de validación y detalles por campo.
 *     tags: [Validacion]
 *     parameters:
 *       - in: path
 *         name: banco
 *         required: true
 *         description: Nombre del banco configurado en el sistema
 *         schema:
 *           type: string
 *           example: "BancoEjemplo"
 *       - in: path
 *         name: tipoValidacion
 *         required: true
 *         description: Tipo de validación configurado (KYC, AML, BASIC, etc.)
 *         schema:
 *           type: string
 *           example: "KYC"
 *     requestBody:
 *       required: true
 *       description: Datos del cliente y valores reales para comparación
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - respuestasCliente
 *               - datosReales
 *             properties:
 *               respuestasCliente:
 *                 type: object
 *                 description: Respuestas proporcionadas por el cliente durante la llamada
 *                 additionalProperties: true
 *                 example:
 *                   nombre: "Juan Pérez"
 *                   cedula: "12345678"
 *                   telefono: "555-1234"
 *                   email: "juan@example.com"
 *               datosReales:
 *                 type: object
 *                 description: Datos reales del cliente almacenados en el sistema
 *                 additionalProperties: true
 *                 example:
 *                   nombre: "Juan Pérez"
 *                   cedula: "12345678"
 *                   telefono: "555-5678"
 *                   email: "juan@example.com"
 *     responses:
 *       200:
 *         description: Validación completada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estadoValidacion:
 *                   type: string
 *                   enum: ["EXITOSA", "PARCIAL", "FALLIDA"]
 *                   description: |
 *                     - EXITOSA: Todos los campos obligatorios correctos y cumple mínimos
 *                     - PARCIAL: Cumple mínimos pero no todos los obligatorios
 *                     - FALLIDA: No cumple los mínimos requeridos
 *                   example: "PARCIAL"
 *                 camposCorrectos:
 *                   type: integer
 *                   description: Número total de campos validados correctamente
 *                   example: 3
 *                 camposRequeridos:
 *                   type: integer
 *                   description: Número mínimo de campos requeridos para validación exitosa
 *                   example: 2
 *                 camposObligatoriosCorrectos:
 *                   type: integer
 *                   description: Número de campos obligatorios validados correctamente
 *                   example: 2
 *                 totalCamposObligatorios:
 *                   type: integer
 *                   description: Total de campos obligatorios en la configuración
 *                   example: 2
 *                 cumpleMinimos:
 *                   type: boolean
 *                   description: Indica si cumple con el número mínimo de campos correctos
 *                   example: true
 *                 porcentajeExito:
 *                   type: integer
 *                   description: Porcentaje de campos validados correctamente (0-100)
 *                   example: 75
 *                 detalleValidaciones:
 *                   type: array
 *                   description: Detalle de validación por cada campo procesado
 *                   items:
 *                     type: object
 *                     properties:
 *                       campo:
 *                         type: string
 *                         description: Nombre del campo validado
 *                         example: "nombre"
 *                       valorProporcionado:
 *                         type: string
 *                         description: Valor proporcionado por el cliente
 *                         example: "Juan Pérez"
 *                       valorEsperado:
 *                         type: string
 *                         description: Valor real esperado del sistema
 *                         example: "Juan Pérez"
 *                       esCorrecto:
 *                         type: boolean
 *                         description: Indica si el valor proporcionado es correcto
 *                         example: true
 *                       esObligatorio:
 *                         type: boolean
 *                         description: Indica si el campo es obligatorio
 *                         example: true
 *                       motivo:
 *                         type: string
 *                         description: Descripción del resultado de la validación
 *                         enum: ["Correcto", "Valor incorrecto", "Campo obligatorio no proporcionado"]
 *                         example: "Correcto"
 *                 configuracion:
 *                   type: object
 *                   description: Información de la configuración utilizada
 *                   properties:
 *                     banco:
 *                       type: string
 *                       example: "BancoEjemplo"
 *                     tipoValidacion:
 *                       type: string
 *                       example: "KYC"
 *                     camposMinimosRequeridos:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "respuestasCliente y datosReales son requeridos"
 *       404:
 *         description: Configuración no encontrada para el banco y tipo de validación especificados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Configuración no encontrada"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor"
 */
router.post('/validar/:banco/:tipoValidacion', async (req, res) => {
    try {
        const { banco, tipoValidacion } = req.params;
        const { respuestasCliente, datosReales } = req.body;

        if (!respuestasCliente || !datosReales) {
            return res.status(400).json({ error: 'respuestasCliente y datosReales son requeridos' });
        }

        // Buscar la configuración
        const configuracion = await ConfiguracionValidacion.findOne({
            include: [
                {
                    model: Banco,
                    where: { nombre: banco },
                    required: true
                },
                {
                    model: TipoValidacion,
                    where: { nombre: tipoValidacion },
                    required: true
                },
                {
                    model: ConfiguracionCampo,
                    include: [{
                        model: CampoValidacion
                    }],
                    required: false
                }
            ],
            where: { activo: true }
        });

        if (!configuracion) {
            return res.status(404).json({ error: 'Configuración no encontrada' });
        }

        // Realizar validaciones
        const resultadosValidacion = [];
        let camposCorrectos = 0;
        let camposObligatoriosCorrectos = 0;
        let camposObligatorios = 0;

        for (const configCampo of configuracion.ConfiguracionCampos || []) {
            const nombreCampo = configCampo.CampoValidacion.nombre_campo;
            const esObligatorio = configCampo.es_obligatorio;
            
            if (esObligatorio) {
                camposObligatorios++;
            }

            const valorCliente = respuestasCliente[nombreCampo];
            const valorReal = datosReales[nombreCampo];
            
            // Verificar si el cliente proporcionó una respuesta
            const clienteRespondio = valorCliente !== undefined && valorCliente !== null && valorCliente !== '';
            
            // Si es obligatorio y no respondió
            if (esObligatorio && !clienteRespondio) {
                resultadosValidacion.push({
                    campo: nombreCampo,
                    valorProporcionado: valorCliente,
                    valorEsperado: valorReal,
                    esCorrecto: false,
                    esObligatorio: true,
                    motivo: 'Campo obligatorio no proporcionado'
                });
                continue;
            }

            // Si no es obligatorio y no respondió, no validar
            if (!esObligatorio && !clienteRespondio) {
                continue;
            }

            // Comparar valores (convertir a string para comparación)
            const valorClienteStr = String(valorCliente || '').toLowerCase().trim();
            const valorRealStr = String(valorReal || '').toLowerCase().trim();
            const esCorrecto = valorClienteStr === valorRealStr;
            
            if (esCorrecto) {
                camposCorrectos++;
                if (esObligatorio) {
                    camposObligatoriosCorrectos++;
                }
            }

            resultadosValidacion.push({
                campo: nombreCampo,
                valorProporcionado: valorCliente,
                valorEsperado: valorReal,
                esCorrecto: esCorrecto,
                esObligatorio: esObligatorio,
                motivo: esCorrecto ? 'Correcto' : 'Valor incorrecto'
            });
        }

        // Verificar si cumple con los campos mínimos requeridos
        const camposMinimosRequeridos = configuracion.campos_minimos_requeridos;
        const cumpleMinimos = camposCorrectos >= camposMinimosRequeridos;
        
        // Determinar estado de validación
        let estadoValidacion;
        if (camposObligatoriosCorrectos === camposObligatorios && cumpleMinimos) {
            estadoValidacion = 'EXITOSA';
        } else if (camposCorrectos >= camposMinimosRequeridos) {
            estadoValidacion = 'PARCIAL';
        } else {
            estadoValidacion = 'FALLIDA';
        }

        const resultado = {
            estadoValidacion: estadoValidacion,
            camposCorrectos: camposCorrectos,
            camposRequeridos: camposMinimosRequeridos,
            camposObligatoriosCorrectos: camposObligatoriosCorrectos,
            totalCamposObligatorios: camposObligatorios,
            cumpleMinimos: cumpleMinimos,
            porcentajeExito: configuracion.ConfiguracionCampos?.length > 0 ? 
                Math.round((camposCorrectos / configuracion.ConfiguracionCampos.length) * 100) : 0,
            detalleValidaciones: resultadosValidacion,
            configuracion: {
                banco: banco,
                tipoValidacion: tipoValidacion,
                camposMinimosRequeridos: camposMinimosRequeridos
            }
        };

        res.json(resultado);
    } catch (error) {
        console.error('Error validando respuestas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
