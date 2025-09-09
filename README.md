# JavaScript Technical Exam Assessment

Proyecto que contiene múltiples APIs con documentación Swagger para examen técnico.

## 🚀 Instalación y Configuración

### 1. Configuración Inicial
```bash
# Clonar el repositorio
git clone <repository-url>
cd JavaScript-Technical-Exam-Assessment

# Instalar todas las dependencias
npm run install:all
```

### 2. Configuración de Variables de Entorno
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar las variables según tu configuración
nano .env
```

### 3. Configurar Base de Datos MySQL (solo para call-center)
```bash
# Opción 1: Setup automático (recomendado)
npm run db:setup

# Opción 2: Manual
# Crear base de datos manualmente si es necesario
mysql -u root -p -e "CREATE DATABASE callcenter;"

# Ejecutar migraciones
npm run db:migrate
```

## 🔧 Variables de Entorno

El archivo `.env` debe contener las siguientes variables:

### Base de Datos (Call Center)
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=callcenter
DB_USER=root
DB_PASSWORD=your_password_here
DB_DIALECT=mysql
```

### Puertos de Aplicación
```env
CALL_CENTER_PORT=3002
DIVISORES_PORT=3001
NODE_ENV=development
```

### SSL Database (Opcional)
```env
DB_SSL=false
DB_SSL_CA=
DB_SSL_KEY=
DB_SSL_CERT=
```

## 📊 APIs Disponibles

### 1. Divisores API (Puerto 3001)
- **Endpoint**: `/api/divisores-propios-primos/:numero`
- **Descripción**: Calcula divisores propios primos de un número
- **Swagger**: http://localhost:3001/api-docs

### 2. Call Center API (Puerto 3002)
- **Endpoints**:
  - `POST /configuracion` - Crear configuración de validación
  - `GET /configuracion/:banco/:tipoValidacion` - Obtener configuración
  - `POST /validar/:banco/:tipoValidacion` - Validar respuestas de cliente
- **Descripción**: Gestión de configuraciones de validación para call centers
- **Swagger**: http://localhost:3002/api-docs

## 🗄 Comandos de Base de Datos

### Setup Inicial (Recomendado)
```bash
# Configura automáticamente la base de datos completa
npm run db:setup
```

### Comandos de Migración
```bash
# Ejecutar migraciones pendientes
npm run db:migrate

# Reset completo de base de datos (desarrollo)
npm run db:reset
```

**📄 Guía Detallada**: Ver [MIGRATION-GUIDE.md](./call-center/MIGRATION-GUIDE.md) para información completa.

## 🎃 Ejecutar las Aplicaciones

### Opción 1: Ejecutar todo simultáneamente
```bash
npm run start:all
```

### Opción 2: Ejecutar individualmente
```bash
# Solo Divisores API
npm run start:divisores

# Solo Call Center API
npm run start:callcenter
```

### Opción 3: Ejecutar directamente
```bash
# Divisores API
cd divisores-api && npm start

# Call Center API
cd call-center && npm start
```

## 📋 Endpoints de Salud

Ambas APIs incluyen endpoints de salud:
- Divisores: http://localhost:3001/health
- Call Center: http://localhost:3002/health

## 🛠 Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Swagger** - Documentación de API
- **Sequelize** - ORM para base de datos
- **MySQL** - Base de datos relacional
- **dotenv** - Gestión de variables de entorno

## 📚 Documentación Detallada

- [Call Center API](./call-center/README.md) - Documentación específica del call center
- [Divisores API](./divisores-api/) - API de cálculo de divisores

## ⚡ Características Destacadas

### Call Center API
-  Conexión a base de datos MySQL con Sequelize
-  Transacciones para operaciones complejas  
-  Validaciones de lógica de negocio
-  Asociaciones entre modelos
-  Manejo robusto de errores
-  Configuración flexible por variables de entorno

### Divisores API
-  Algoritmo optimizado para cálculo de divisores
-  Validación de entrada
-  Respuestas estructuradas

## 🔍 Testing

```bash
# Prueba rápida de conexión
curl http://localhost:3001/health
curl http://localhost:3002/health

# Prueba funcional - Divisores
curl http://localhost:3001/api/divisores-propios-primos/12

# Prueba funcional - Call Center (crear configuración)
curl -X POST http://localhost:3002/configuracion \
  -H "Content-Type: application/json" \
  -d '{"banco":"TestBank","tipoValidacion":"KYC","campos":[{"campo":"nombre","esObligatorio":true,"orden":1}]}'
```

## 📝 Notas Importantes

1. **Base de Datos**: Solo la API del call-center requiere MySQL
2. **Puertos**: Asegúrate de que los puertos 3001 y 3002 estén disponibles
3. **Variables de Entorno**: El archivo `.env` no se incluye en git por seguridad
4. **Logging**: En development se muestran los logs de Sequelize
5. **Archivo Readme**: Este archivo se hizo con ayuda de copilot
