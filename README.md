# Sistema Backend de Turnos y Reservas

API REST desarrollada con **Node.js, Express, MongoDB y Mongoose** para gestionar servicios y reservas.

El proyecto permite crear, consultar, actualizar y eliminar servicios, además de crear reservas y asociar servicios a cada una de ellas.

La aplicación utiliza una arquitectura en capas que separa las responsabilidades entre Routers, Controllers, Services, Repositories y DAOs.

---

## Tecnologías utilizadas

- Node.js
- JavaScript
- Express
- MongoDB Atlas
- Mongoose
- ES Modules
- dotenv
- Postman
- Git
- GitHub

---

## Arquitectura del proyecto

La aplicación utiliza el siguiente flujo:

```text
Request
   ↓
Router
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
DAO
   ↓
Mongoose
   ↓
MongoDB Atlas
```

Cada capa tiene una responsabilidad específica.

### Router

Define los endpoints de la API y conecta cada ruta con su Controller.

Los Routers no contienen reglas de negocio ni acceden directamente a la base de datos.

### Controller

Recibe las solicitudes HTTP, obtiene información desde:

- `req.params`
- `req.query`
- `req.body`

Luego llama al Service correspondiente y genera la respuesta HTTP.

Los Controllers son la capa que trabaja directamente con `req` y `res`.

### Service

Contiene las reglas de negocio de la aplicación.

Entre sus responsabilidades se encuentran:

- Validar campos obligatorios.
- Evitar la modificación del ID de un servicio.
- Aplicar filtros de servicios.
- Verificar que una reserva exista.
- Verificar que un servicio exista.
- Incrementar la cantidad cuando un servicio ya pertenece a una reserva.

Los Services no conocen detalles de MongoDB ni trabajan directamente con `req` o `res`.

### Repository

Los Repositories funcionan como intermediarios entre los Services y los DAOs.

De esta forma, los Services no necesitan conocer cómo se almacenan físicamente los datos.

### DAO

DAO significa **Data Access Object**.

Los DAOs son responsables del acceso directo a la persistencia mediante los modelos de Mongoose.

Utilizan operaciones como:

```javascript
Model.find();
Model.findById();
Model.create();
Model.findByIdAndUpdate();
Model.findByIdAndDelete();
```

Los DAOs no contienen reglas de negocio.

---

## Estructura del proyecto

```text
sistema-turnos/
│
├── src/
│   │
│   ├── config/
│   │   ├── env.config.js
│   │   └── db.config.js
│   │
│   ├── controllers/
│   │   ├── services.controller.js
│   │   └── bookings.controller.js
│   │
│   ├── services/
│   │   ├── services.service.js
│   │   └── bookings.service.js
│   │
│   ├── repositories/
│   │   ├── services.repository.js
│   │   └── bookings.repository.js
│   │
│   ├── dao/
│   │   ├── services.dao.js
│   │   └── bookings.dao.js
│   │
│   ├── models/
│   │   ├── service.model.js
│   │   ├── booking.model.js
│   │   └── message.model.js
│   │
│   ├── routes/
│   │   ├── services.router.js
│   │   └── bookings.router.js
│   │
│   └── app.js
│
├── server.js
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

---

# Persistencia con MongoDB

La aplicación utiliza **MongoDB Atlas** como base de datos y **Mongoose** como ODM.

La conexión se realiza desde:

```text
src/config/db.config.js
```

La URI de conexión se obtiene mediante la variable de entorno:

```env
MONGO_URI=
```

Las credenciales reales nunca se almacenan directamente en el código ni se incluyen en el repositorio.

---

# Modelos de Mongoose

## Service

Representa los servicios disponibles.

Campos principales:

```text
name
description
duration
price
category
available
```

MongoDB genera automáticamente un `_id` para cada servicio.

## Booking

Representa una reserva.

Campos principales:

```text
clientName
clientEmail
date
time
status
services
```

Los servicios asociados se almacenan como referencias:

```javascript
services: [
  {
    service: ObjectId,
    quantity: Number
  }
]
```

El campo `service` utiliza:

```javascript
ref: "Service"
```

Esto permite relacionar una reserva con un documento de la colección de servicios.

## Message

El proyecto también incluye un modelo `Message` preparado mediante Mongoose.

---

# Relaciones y populate

Las reservas almacenan referencias a los servicios mediante `ObjectId`.

Para obtener la información relacionada se utiliza:

```javascript
.populate("services.service")
```

MongoDB mantiene la referencia mediante ObjectId, mientras que `populate()` permite obtener los datos completos del servicio al realizar determinadas consultas.

---

# Instalación

Clonar el repositorio:

```bash
git clone https://github.com/EvelynFernandez93/sistema-turnos.git
```

Ingresar al proyecto:

```bash
cd sistema-turnos
```

Instalar las dependencias:

```bash
npm install
```

Crear un archivo `.env` en la raíz tomando `.env.example` como referencia:

```env
PORT=8080
NODE_ENV=development
MONGO_URI=tu_uri_de_conexion_a_mongodb
```

Ejecutar:

```bash
npm start
```

Al conectarse correctamente se mostrará:

```text
MongoDB conectado correctamente
Servidor escuchando en el puerto 8080
```

---

# API REST

## Servicios

### Obtener todos los servicios

```http
GET /api/services
```

También permite filtros:

```http
GET /api/services?available=true
GET /api/services?category=Consultas
```

### Obtener un servicio

```http
GET /api/services/:sid
```

`:sid` corresponde al `_id` generado por MongoDB.

### Crear un servicio

```http
POST /api/services
```

Ejemplo:

```json
{
  "name": "Consulta general",
  "description": "Consulta inicial de 30 minutos",
  "duration": 30,
  "price": 10000,
  "category": "Consultas",
  "available": true
}
```

### Actualizar un servicio

```http
PUT /api/services/:sid
```

Ejemplo:

```json
{
  "price": 12000
}
```

No se permite modificar manualmente `id` ni `_id`.

### Eliminar un servicio

```http
DELETE /api/services/:sid
```

---

# Reservas

## Crear una reserva

```http
POST /api/bookings
```

Ejemplo:

```json
{
  "clientName": "Cliente Prueba",
  "clientEmail": "cliente@prueba.com",
  "date": "2026-09-30",
  "time": "10:30",
  "status": "pending"
}
```

La reserva se crea inicialmente con:

```json
{
  "services": []
}
```

MongoDB genera automáticamente su `_id`.

## Obtener una reserva

```http
GET /api/bookings/:bid
```

`:bid` corresponde al `_id` de la reserva.

## Agregar un servicio a una reserva

```http
POST /api/bookings/:bid/services/:sid
```

Este endpoint no necesita Body.

Antes de agregar el servicio, la capa Service verifica:

1. Que la reserva exista.
2. Que el servicio exista.

Si todavía no pertenece a la reserva, se agrega con:

```json
{
  "service": "ObjectId-del-servicio",
  "quantity": 1
}
```

Si el mismo servicio se agrega nuevamente, no se duplica: se incrementa `quantity`.

```json
{
  "service": "ObjectId-del-servicio",
  "quantity": 2
}
```

Esta regla de negocio se encuentra en `bookings.service.js`.

---

# Códigos de estado HTTP

| Código | Significado |
|---|---|
| `200` | Operación realizada correctamente |
| `201` | Recurso creado correctamente |
| `400` | Datos incorrectos o incompletos |
| `404` | Recurso no encontrado |
| `500` | Error interno del servidor |

---

# Variables de entorno

El proyecto utiliza `dotenv`.

Variables requeridas:

```env
PORT=
NODE_ENV=
MONGO_URI=
```

El archivo `.env` contiene la configuración real y **no se incluye en GitHub**.

El repositorio proporciona `.env.example` como plantilla.

---

# Seguridad del repositorio

`.gitignore` evita subir información sensible y dependencias:

```gitignore
node_modules/
.env
```

Por lo tanto, el repositorio no incluye:

- `node_modules`
- `.env`
- credenciales de MongoDB Atlas

---

# Migración realizada

La versión anterior utilizaba FileSystem y archivos JSON:

```text
DAO
 ↓
FileSystem
 ↓
JSON
```

La persistencia fue migrada a:

```text
DAO
 ↓
Mongoose
 ↓
MongoDB Atlas
```

Los endpoints y la arquitectura general de la API se mantienen, mientras que los identificadores ahora corresponden a los `_id` generados por MongoDB.

Los archivos JSON utilizados anteriormente como persistencia fueron retirados del proyecto.

---

# Estado actual del proyecto

La API permite:

- Consultar servicios.
- Filtrar servicios por categoría y disponibilidad.
- Consultar servicios por `_id`.
- Crear servicios.
- Actualizar servicios.
- Eliminar servicios.
- Crear reservas.
- Consultar reservas por `_id`.
- Asociar servicios a reservas mediante referencias ObjectId.
- Utilizar `populate()` para recuperar información de servicios relacionados.
- Incrementar `quantity` cuando un servicio ya existe en una reserva.
- Persistir información mediante MongoDB Atlas.
- Utilizar Mongoose para definir Schemas y Models.
- Gestionar variables de entorno.
- Mantener una arquitectura separada en Routes, Controllers, Services, Repositories y DAOs.

---

## Autora

**Evelyn Fernandez**

Proyecto desarrollado como parte del curso de Backend.