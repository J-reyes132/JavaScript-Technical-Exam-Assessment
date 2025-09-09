const express = require('express');
const router = express.Router();

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
router.post('/configuracion', (req, res) => {
    const { banco, tipoValidacion, campos, camposMinimosRequeridos } = req.body;
    if (!banco || !tipoValidacion || !Array.isArray(campos)) {
        return res.status(400).json({ error: 'Datos insuficientes' });
    }
    const config = gestor.crear(banco, tipoValidacion);
    campos.forEach(c => config.agregarCampo(c.campo, c.esObligatorio, c.orden));
    if (camposMinimosRequeridos) {
        try {
            config.establecerMinimosRequeridos(camposMinimosRequeridos);
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    }
    res.json({ mensaje: 'Configuración creada', config });
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
router.get('/configuracion/:banco/:tipoValidacion', (req, res) => {
    const { banco, tipoValidacion } = req.params;
    const config = gestor.obtener(banco, tipoValidacion);
    if (!config) return res.status(404).json({ error: 'No encontrada' });
    res.json(config);
});

/**
 * @swagger
 * /validar/{banco}/{tipoValidacion}:
 *   post:
 *     summary: Validar respuestas del cliente
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               respuestasCliente:
 *                 type: object
 *               datosReales:
 *                 type: object
 *     responses:
 *       200:
 *         description: Resultado de la validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Configuración no encontrada
 */
router.post('/validar/:banco/:tipoValidacion', (req, res) => {
    const { banco, tipoValidacion } = req.params;
    const { respuestasCliente, datosReales } = req.body;
    const config = gestor.obtener(banco, tipoValidacion);
    if (!config) return res.status(404).json({ error: 'Configuración no encontrada' });
    const resultado = config.validarRespuestas(respuestasCliente, datosReales);
    res.json(resultado);
});

module.exports = router;
