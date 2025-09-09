# 📊 Guía de Migraciones - Call Center Database

Esta guía te explica cómo crear y gestionar las tablas de la base de datos usando migraciones de Sequelize.

## 🚀 Configuración Inicial

### 1. Verificar Variables de Entorno
Asegúrate de tener configurado tu archivo `.env` con las credenciales correctas de MySQL:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=callcenter
DB_USER=root
DB_PASSWORD=tu_password
DB_DIALECT=mysql
```

### 2. Instalar Dependencias
```bash
# Desde la raíz del proyecto
npm run install:all

# O específicamente para call-center
cd call-center && npm install
```

## 🗄️ Comandos de Base de Datos

### Configuración Completa (Recomendado para primera vez)
```bash
# Desde la raíz del proyecto - hace todo automáticamente
npm run db:setup
```

Este comando ejecuta en secuencia:
1. `db:create` - Crea la base de datos
2. `db:migrate` - Ejecuta todas las migraciones
3. `db:seed` - Inserta datos iniciales

### Comandos Individuales

#### Crear Base de Datos
```bash
cd call-center
npm run db:create
```

#### Ejecutar Migraciones
```bash
# Ejecutar todas las migraciones pendientes
cd call-center
npm run db:migrate

# Desde la raíz del proyecto
npm run db:migrate
```

#### Rollback de Migraciones
```bash
cd call-center

# Deshacer la última migración
npm run db:migrate:undo

# Deshacer TODAS las migraciones (¡CUIDADO!)
npm run db:migrate:undo:all
```

#### Seeders (Datos Iniciales)
```bash
cd call-center

# Ejecutar todos los seeders
npm run db:seed

# Deshacer todos los seeders
npm run db:seed:undo
```

#### Reset Completo de Base de Datos
```bash
# Desde la raíz - deshace todo y lo recrea
npm run db:reset
```

## 📋 Tablas que se Crean

Las migraciones crean las siguientes tablas en orden:

1. **banco** - Entidades bancarias
2. **tipo_validacion** - Tipos de validación (KYC, AML, etc.)
3. **campo_validacion** - Campos disponibles para validar
4. **configuracion_validacion** - Configuraciones por banco y tipo
5. **configuracion_campo** - Campos específicos por configuración
6. **cliente** - Información de clientes
7. **agente** - Agentes del call center
8. **llamada** - Registro de llamadas
9. **validacion_llamada** - Resultados de validaciones por llamada
10. **tipo_cuenta** - Tipos de cuenta bancaria
11. **configuracion_tipo_cuenta** - Relación configuración-tipo cuenta
12. **auditoria** - Log de cambios en el sistema

## 🌱 Datos Iniciales (Seeders)

Los seeders insertan:

### Campos de Validación Básicos
- nombre, cedula, telefono, email
- fecha_nacimiento, direccion, numero_cuenta

### Tipos de Validación
- **KYC** - Know Your Customer
- **AML** - Anti Money Laundering  
- **BASIC** - Validación básica
- **ENHANCED** - Validación mejorada
- **QUICK** - Validación rápida

## 🔍 Verificar el Estado

### Ver Migraciones Ejecutadas
```bash
cd call-center
npx sequelize-cli db:migrate:status
```

### Verificar Tablas Creadas
```sql
-- Conectarse a MySQL y ejecutar:
USE callcenter;
SHOW TABLES;
```

### Verificar Datos Iniciales
```sql
SELECT * FROM campo_validacion;
SELECT * FROM tipo_validacion;
```

## ⚠️ Solución de Problemas

### Error: Base de Datos No Existe
```bash
# Crear manualmente la base de datos
mysql -u root -p
CREATE DATABASE callcenter;
exit

# Luego ejecutar migraciones
npm run db:migrate
```

### Error: Credenciales Incorrectas
1. Verifica tu archivo `.env`
2. Prueba la conexión a MySQL manualmente
3. Asegúrate de que el usuario tenga permisos

### Error: Tabla Ya Existe
```bash
# Ver qué migraciones se han ejecutado
cd call-center
npx sequelize-cli db:migrate:status

# Si necesitas empezar de cero
npm run db:migrate:undo:all
npm run db:migrate
```

### Error: Puerto Ocupado
Cambia los puertos en tu `.env`:
```env
DB_PORT=3307  # Si 3306 está ocupado
```

## 🚦 Flujo Recomendado para Desarrollo

### Primera Configuración
```bash
# 1. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 2. Setup completo
npm run db:setup

# 3. Iniciar la aplicación
npm run start:callcenter
```

### Desarrollo Diario
```bash
# Si hay nuevas migraciones
npm run db:migrate

# Iniciar aplicación
npm run start:callcenter
```

### Reset para Testing
```bash
# Resetear todo y empezar limpio
npm run db:reset
```

## 📝 Crear Nuevas Migraciones

Si necesitas agregar nuevas tablas o modificar existentes:

```bash
cd call-center

# Crear nueva migración
npx sequelize-cli migration:generate --name add-nueva-tabla

# Crear nuevo seeder
npx sequelize-cli seed:generate --name add-datos-iniciales
```
Nota: El archivo readme fue hecho con ayuda de copilot :)

## 🔗 Enlaces Útiles

- [Documentación Sequelize CLI](https://sequelize.org/docs/v6/other-topics/migrations/)
- [Documentación MySQL](https://dev.mysql.com/doc/)
- [Variables de Entorno](.env.example)

---

**💡 Tip**: Siempre haz backup de tu base de datos antes de ejecutar `db:reset` o `db:migrate:undo:all` en producción.
