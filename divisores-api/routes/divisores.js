const express = require('express');
const router = express.Router();

/**
 * Verifica si un número es primo
 * @param {number} n - Número a verificar
 * @returns {boolean} - true si es primo, false en caso contrario
 */
function esPrimo(n) {
    // Casos especiales
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    
    // Verificar divisibilidad hasta la raíz cuadrada de n
    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) {
            return false;
        }
    }
    return true;
}

/**
 * Obtiene todos los divisores propios de un número
 * @param {number} n - Número del cual obtener divisores
 * @returns {number[]} - Array con los divisores propios
 */
function obtenerDivisoresPropios(n) {
    const divisores = [];
    
    // Buscar divisores hasta la mitad del número
    for (let i = 1; i <= Math.floor(n / 2); i++) {
        if (n % i === 0) {
            divisores.push(i);
        }
    }
    
    // Excluir el 1 ya que buscamos divisores propios (excluyendo 1 y el mismo número)
    return divisores.filter(d => d !== n);
}

/**
 * @swagger
 * components:
 *   schemas:
 *     DivisorResponse:
 *       type: object
 *       properties:
 *         numero:
 *           type: integer
 *           description: Número analizado
 *           example: 45
 *         divisoresPropios:
 *           type: array
 *           items:
 *             type: integer
 *           description: Lista de divisores propios
 *           example: [1, 3, 5, 9, 15]
 *         divisoresPropiosPrimos:
 *           type: array
 *           items:
 *             type: integer
 *           description: Lista de divisores propios primos
 *           example: [3, 5]
 *         suma:
 *           type: integer
 *           description: Sumatoria de divisores propios primos
 *           example: 8
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensaje de error
 *           example: "El número debe ser un entero positivo"
 */

/**
 * @swagger
 * /api/divisores-primos/{numero}:
 *   get:
 *     summary: Calcula la sumatoria de divisores propios primos de un número
 *     description: |
 *       Esta endpoint calcula la sumatoria de todos los divisores propios de un número
 *       que son números primos. Los divisores propios excluyen al número mismo.
 *       
 *       **Nota técnica**: 
 *       - Un número primo es aquel que solo es divisible por 1 y por sí mismo
 *       - El número 1 no se considera primo por definición matemática
 *     tags:
 *       - Divisores
 *     parameters:
 *       - in: path
 *         name: numero
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número entero positivo a analizar
 *         example: 45
 *     responses:
 *       200:
 *         description: Resultado del cálculo exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DivisorResponse'
 *       400:
 *         description: Entrada inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/divisores-primos/:numero', (req, res) => {
  try {
    const numero = parseInt(req.params.numero);
    
    // Validación de entrada
    if (numero <= 0 || !Number.isInteger(numero)) {
      return res.status(400).json({ 
        error: 'El número debe ser un entero positivo' 
      });
    }
    
    // Obtener divisores propios
    const divisoresPropios = obtenerDivisoresPropios(numero);
    
    // Filtrar solo los primos y sumarlos
    const divisoresPrimos = divisoresPropios.filter(divisor => esPrimo(divisor));
    const suma = divisoresPrimos.reduce((acc, curr) => acc + curr, 0);
    
    // Devolver respuesta estructurada
    res.json({
      numero,
      divisoresPropios,
      divisoresPropiosPrimos: divisoresPrimos,
      suma
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
});

/**
 * @swagger
 * /api/divisores-primos/batch:
 *   post:
 *     summary: Calcula la sumatoria de divisores propios primos para múltiples números
 *     description: Procesa un lote de números y devuelve los resultados para cada uno
 *     tags:
 *       - Divisores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numeros:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *                 description: Array de números enteros positivos a analizar
 *                 example: [12, 28, 100, 13, 30]
 *     responses:
 *       200:
 *         description: Resultados de los cálculos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DivisorResponse'
 *       400:
 *         description: Entrada inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/divisores-primos/batch', (req, res) => {
  try {
    const { numeros } = req.body;
    
    if (!Array.isArray(numeros) || numeros.length === 0) {
      return res.status(400).json({ 
        error: 'Se requiere un array de números' 
      });
    }
    
    const resultados = [];
    
    for (const num of numeros) {
      if (num <= 0 || !Number.isInteger(num)) {
        resultados.push({
          numero: num,
          error: 'Número inválido, debe ser un entero positivo'
        });
        continue;
      }
      
      const divisoresPropios = obtenerDivisoresPropios(num);
      const divisoresPrimos = divisoresPropios.filter(divisor => esPrimo(divisor));
      const suma = divisoresPrimos.reduce((acc, curr) => acc + curr, 0);
      
      resultados.push({
        numero: num,
        divisoresPropios,
        divisoresPropiosPrimos: divisoresPrimos,
        suma
      });
    }
    
    res.json(resultados);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
});

module.exports = router;