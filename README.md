# Sistema Backend de Turnos y Reservas

Proyecto backend desarrollado con **Node.js, Express, MongoDB Atlas, Mongoose, Handlebars y Socket.io**.

El sistema permite administrar servicios y reservas mediante una API REST, persistir la información en MongoDB Atlas, renderizar vistas dinámicas con Handlebars y actualizar información en tiempo real utilizando Socket.io.

---

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Handlebars
- express-handlebars
- Socket.io
- dotenv
- JavaScript
- HTML
- CSS

---

## Arquitectura del proyecto

El proyecto utiliza una arquitectura en capas para separar responsabilidades:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
DAO
  ↓
Models
  ↓
MongoDB Atlas
```

### Routes

Definen las rutas disponibles y delegan el procesamiento a los controllers.

### Controllers

Reciben las solicitudes HTTP, obtienen los datos necesarios de `req` y coordinan la respuesta utilizando los services.

### Services

Contienen la lógica de negocio de la aplicación.

### Repositories

Actúan como una capa de abstracción entre los services y el acceso a datos.

### DAO

Realizan las operaciones de persistencia utilizando los modelos de Mongoose.

### Models

Definen la estructura de los documentos almacenados en MongoDB.

---

## Estructura del proyecto

```text
sistema-turnos/
│
├── src/
│   │
│   ├── config/
│   │   ├── db.config.js
│   │   ├── env.config.js
│   │   └── socket.config.js
│   │
│   ├── controllers/
│   │   ├── services.controller.js
│   │   ├── bookings.controller.js
│   │   └── views.controller.js
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
│   │   ├── bookings.router.js
│   │   └── views.router.js
│   │
│   ├── views/
│   │   ├── layouts/
│   │   │   └── main.handlebars
│   │   ├── services.handlebars
│   │   └── availability.handlebars
│   │
│   ├── public/
│   │   ├── css/
│   │   │   └── styles.css
│   │   └── js/
│   │       └── socket.js
│   │
│   └── app.js
│
├── server.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

# API REST

## Servicios

### Obtener todos los servicios

```http
GET /api/services
```

Permite obtener todos los servicios almacenados en MongoDB.

También admite filtros mediante query params:

```http
GET /api/services?category=Consultas
```

```http
GET /api/services?available=true
```

---

### Obtener un servicio por ID

```http
GET /api/services/:sid
```

---

### Crear un servicio

```http
POST /api/services
```

Ejemplo:

```json
{
  "name": "Consulta general",
  "description": "Consulta general de atención",
  "duration": 30,
  "price": 10000,
  "category": "Consultas",
  "available": true
}
```

Cuando se crea correctamente un servicio, el servidor también emite un evento mediante Socket.io para actualizar la vista de servicios en tiempo real.

---

### Actualizar un servicio

```http
PUT /api/services/:sid
```

---

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
  "clientName": "Nombre del cliente",
  "clientEmail": "cliente@email.com",
  "date": "2026-10-10",
  "time": "10:30",
  "status": "pending"
}
```

Al crear una reserva, el array `services` se inicializa vacío.

---

## Obtener una reserva por ID

```http
GET /api/bookings/:bid
```

Los servicios relacionados con una reserva se recuperan mediante `populate()` de Mongoose.

---

## Agregar un servicio a una reserva

```http
POST /api/bookings/:bid/services/:sid
```

Si el servicio todavía no existe dentro de la reserva, se agrega con:

```json
{
  "service": "ObjectId",
  "quantity": 1
}
```

Si el servicio ya existe en la reserva, se incrementa su cantidad.

---

# MongoDB Atlas y Mongoose

La persistencia de datos se realiza utilizando **MongoDB Atlas**.

Mongoose se utiliza para definir los modelos y realizar las operaciones sobre la base de datos.

Los modelos principales son:

- `Service`
- `Booking`
- `Message`

Las reservas almacenan referencias a servicios mediante `ObjectId` y `ref`.

Ejemplo:

```js
service: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Service"
}
```

Posteriormente, Mongoose permite recuperar la información relacionada mediante:

```js
.populate("services.service")
```

---

# Vistas con Handlebars

El proyecto utiliza **Handlebars** como motor de plantillas del lado del servidor.

## Vista de servicios

```http
GET /views/services
```

Renderiza los servicios almacenados en MongoDB mostrando:

- nombre
- descripción
- duración
- precio
- categoría
- disponibilidad

Los datos no se encuentran hardcodeados en la vista. Se obtienen mediante la arquitectura existente:

```text
MongoDB
   ↓
Model
   ↓
DAO
   ↓
Repository
   ↓
Service
   ↓
Views Controller
   ↓
Handlebars
```

---

## Vista de disponibilidad

```http
GET /views/availability
```

Muestra información sobre la disponibilidad de los servicios registrados en MongoDB.

Incluye:

- nombre
- categoría
- duración
- estado de disponibilidad

---

# Comunicación en tiempo real con Socket.io

Socket.io permite mantener una comunicación en tiempo real entre el servidor y el navegador.

Cuando se crea un servicio mediante:

```http
POST /api/services
```

el servidor emite el evento:

```js
serviceCreated
```

El archivo:

```text
src/public/js/socket.js
```

escucha ese evento y agrega el nuevo servicio a la vista sin necesidad de recargar la página.

El flujo es:

```text
Cliente / Postman
      ↓
POST /api/services
      ↓
Controller
      ↓
Service
      ↓
Repository
      ↓
DAO
      ↓
MongoDB Atlas
      ↓
serviceCreated
      ↓
Socket.io
      ↓
socket.js
      ↓
DOM del navegador
      ↓
Vista actualizada sin recargar
```

De esta manera, **Handlebars realiza el renderizado inicial de la vista** y **Socket.io permite actualizar posteriormente la interfaz en tiempo real**.

---

# Variables de entorno

Crear un archivo `.env` en la raíz del proyecto.

Ejemplo:

```env
PORT=8080
NODE_ENV=development
MONGO_URI=tu_uri_de_mongodb_atlas
```

El archivo `.env` no debe subirse al repositorio.

El proyecto incluye `.env.example` como referencia:

```env
PORT=
NODE_ENV=
MONGO_URI=
```

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

Configurar las variables de entorno en `.env`.

Iniciar el servidor:

```bash
npm start
```

Si la conexión es correcta, la consola mostrará mensajes similares a:

```text
MongoDB conectado correctamente
Servidor escuchando en el puerto 8080
```

---

# Pruebas

La API REST puede probarse utilizando **Postman**.

Las vistas pueden visualizarse desde el navegador:

```text
http://localhost:8080/views/services
```

```text
http://localhost:8080/views/availability
```

Para comprobar Socket.io:

1. Abrir `/views/services` en el navegador.
2. Crear un nuevo servicio mediante `POST /api/services`.
3. El nuevo servicio aparecerá automáticamente en la vista.
4. No es necesario recargar la página.

---

# Seguridad

El proyecto utiliza variables de entorno para proteger información sensible.

El archivo `.gitignore` evita subir:

```text
node_modules/
.env
```

No deben incluirse credenciales ni la URI privada de MongoDB Atlas en el repositorio.

---

# Estado actual

El proyecto cuenta con:

- API REST para servicios.
- API REST para reservas.
- Persistencia mediante MongoDB Atlas.
- Modelado mediante Mongoose.
- Referencias entre reservas y servicios.
- Arquitectura en capas.
- Vistas dinámicas con Handlebars.
- Vista de servicios.
- Vista de disponibilidad.
- Comunicación en tiempo real mediante Socket.io.
- Actualización automática de nuevos servicios sin recargar la página.