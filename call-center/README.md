# Call Center API

API para gestión de configuraciones de validación de clientes en un call center.

## Modelos Conectados

La implementación utiliza los siguientes modelos de Sequelize:

- **Banco**: Entidades bancarias
- **TipoValidacion**: Tipos de validación disponibles
- **ConfiguracionValidacion**: Configuraciones de validación por banco y tipo
- **ConfiguracionCampo**: Configuración específica de campos
- **CampoValidacion**: Definición de campos de validación

## Endpoints Implementados

### 1. POST /configuracion
Crea una nueva configuración de validación.

**Request Body:**
```json
{
  "banco": "BancoEjemplo",
  "tipoValidacion": "KYC",
  "campos": [
    {
      "campo": "nombre",
      "esObligatorio": true,
      "orden": 1
    },
    {
      "campo": "cedula",
      "esObligatorio": true,
      "orden": 2
    },
    {
      "campo": "telefono",
      "esObligatorio": false,
      "orden": 3
    }
  ],
  "camposMinimosRequeridos": 2
}
```

**Response:**
```json
{
  "mensaje": "Configuración creada exitosamente",
  "config": {
    "id_configuracion": 1,
    "banco": "BancoEjemplo",
    "tipoValidacion": "KYC",
    "camposMinimosRequeridos": 2,
    "campos": [
      {
        "campo": "nombre",
        "esObligatorio": true,
        "orden": 1
      }
    ],
    "activo": true
  }
}
```

### 2. GET /configuracion/:banco/:tipoValidacion
Obtiene una configuración existente.

**Example:** GET /configuracion/BancoEjemplo/KYC

**Response:**
```json
{
  "id_configuracion": 1,
  "banco": "BancoEjemplo",
  "tipoValidacion": "KYC",
  "camposMinimosRequeridos": 2,
  "campos": [
    {
      "campo": "nombre",
      "esObligatorio": true,
      "orden": 1
    }
  ],
  "activo": true,
  "fechaVigenciaInicio": "2025-01-01T00:00:00.000Z"
}
```

### 3. POST /validar/:banco/:tipoValidacion
Valida las respuestas del cliente contra los datos reales.

**Request Body:**
```json
{
  "respuestasCliente": {
    "nombre": "Juan Pérez",
    "cedula": "12345678",
    "telefono": "555-1234"
  },
  "datosReales": {
    "nombre": "Juan Pérez",
    "cedula": "12345678",
    "telefono": "555-5678"
  }
}
```

**Response:**
```json
{
  "estadoValidacion": "PARCIAL",
  "camposCorrectos": 2,
  "camposRequeridos": 2,
  "camposObligatoriosCorrectos": 2,
  "totalCamposObligatorios": 2,
  "cumpleMinimos": true,
  "porcentajeExito": 67,
  "detalleValidaciones": [
    {
      "campo": "nombre",
      "valorProporcionado": "Juan Pérez",
      "valorEsperado": "Juan Pérez",
      "esCorrecto": true,
      "esObligatorio": true,
      "motivo": "Correcto"
    },
    {
      "campo": "telefono",
      "valorProporcionado": "555-1234",
      "valorEsperado": "555-5678",
      "esCorrecto": false,
      "esObligatorio": false,
      "motivo": "Valor incorrecto"
    }
  ],
  "configuracion": {
    "banco": "BancoEjemplo",
    "tipoValidacion": "KYC",
    "camposMinimosRequeridos": 2
  }
}
```

## Estados de Validación

- **EXITOSA**: Todos los campos obligatorios correctos y cumple mínimos
- **PARCIAL**: Cumple mínimos pero no todos los obligatorios
- **FALLIDA**: No cumple los mínimos requeridos

## Características Implementadas

1. **Transacciones**: Uso de transacciones de base de datos para operaciones complejas
2. **Validaciones**: Validación de datos de entrada y lógica de negocio
3. **Asociaciones**: Relaciones apropiadas entre modelos Sequelize
4. **Manejo de errores**: Captura y manejo apropiado de errores
5. **Flexibilidad**: Campos opcionales y obligatorios configurables
6. **Auditabilidad**: Estructura preparada para auditoría de cambios

## Instalación y Uso

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
   - Copiar el archivo `.env.example` a `.env` en la raíz del proyecto
   - Configurar las credenciales de la base de datos MySQL
   ```bash
   cp .env.example .env
   ```
   
3. Configurar base de datos MySQL según las variables del archivo `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=callcenter
   DB_USER=root
   DB_PASSWORD=your_password
   DB_DIALECT=mysql
   ```

4. Ejecutar la aplicación:
```bash
npm start
```

5. Acceder a la documentación Swagger en: http://localhost:3002/api-docs

## Variables de Entorno

El sistema utiliza las siguientes variables de entorno:

### Base de Datos
- `DB_HOST`: Host de la base de datos (default: localhost)
- `DB_PORT`: Puerto de la base de datos (default: 3306)
- `DB_NAME`: Nombre de la base de datos (default: callcenter)
- `DB_USER`: Usuario de la base de datos (default: root)
- `DB_PASSWORD`: Contraseña de la base de datos
- `DB_DIALECT`: Dialecto de la base de datos (default: mysql)

### Aplicación
- `CALL_CENTER_PORT`: Puerto para la API del call center (default: 3002)
- `NODE_ENV`: Entorno de ejecución (development/production)
- `DB_SSL`: Habilitar SSL para la conexión a BD (true/false)
