# Sistema Backend de Turnos y Reservas

API REST desarrollada con **Node.js, Express y FileSystem** para gestionar servicios y reservas de un sistema de turnos.

El proyecto permite crear, consultar, actualizar y eliminar servicios, además de crear reservas y asociar servicios a cada una de ellas.

La API está organizada utilizando una arquitectura separada en **Routers, Controllers y Managers**, permitiendo dividir responsabilidades y mantener un código más claro, escalable y fácil de mantener.

La información se almacena de forma persistente en archivos JSON, por lo que los datos se mantienen aunque el servidor se reinicie.

---

## Tecnologías utilizadas

- Node.js
- JavaScript
- Express
- ES Modules
- FileSystem (`fs/promises`)
- JSON
- dotenv
- Postman para pruebas de endpoints

---

## Arquitectura del proyecto

La aplicación utiliza una separación de responsabilidades en tres capas principales:

```text
Request
   ↓
Router
   ↓
Controller
   ↓
Manager
   ↓
JSON
```

### Routers

Los routers definen los endpoints de la API y los conectan con las funciones correspondientes de los controllers.

No contienen lógica de negocio ni acceden directamente a los archivos JSON.

### Controllers

Los controllers reciben las peticiones HTTP y se encargan de:

- Leer `req.params`
- Leer `req.query`
- Leer `req.body`
- Llamar a los managers
- Manejar errores
- Devolver respuestas mediante `res.status().json()`

### Managers

Los managers contienen la lógica relacionada con los datos.

Se encargan de:

- Leer archivos JSON
- Buscar registros
- Crear registros
- Actualizar registros
- Eliminar registros
- Persistir los cambios mediante FileSystem

Los managers no utilizan `req` ni `res`.

---

## Estructura del proyecto

```text
sistema-turnos/
│
├── src/
│   ├── config/
│   │   └── env.config.js
│   │
│   ├── controllers/
│   │   ├── services.controller.js
│   │   └── bookings.controller.js
│   │
│   ├── managers/
│   │   ├── ServiceManager.js
│   │   └── BookingManager.js
│   │
│   ├── routes/
│   │   ├── services.router.js
│   │   └── bookings.router.js
│   │
│   ├── data/
│   │   ├── services.json
│   │   └── bookings.json
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

## Instalación

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

Crear un archivo `.env` tomando como referencia `.env.example`.

Ejemplo:

```env
PORT=8080
NODE_ENV=development
```

Iniciar el servidor:

```bash
npm start
```

El servidor estará disponible en:

```text
http://localhost:8080
```

---

# API REST

## Servicios

Un servicio tiene la siguiente estructura:

```json
{
  "id": 1,
  "name": "Consulta general",
  "description": "Consulta inicial de 30 minutos",
  "duration": 30,
  "price": 10000,
  "category": "Consultas",
  "available": true
}
```

### Endpoints de servicios

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/services` | Obtener todos los servicios |
| GET | `/api/services/:sid` | Obtener un servicio por ID |
| POST | `/api/services` | Crear un servicio |
| PUT | `/api/services/:sid` | Actualizar un servicio |
| DELETE | `/api/services/:sid` | Eliminar un servicio |

---

### Filtros

`GET /api/services` permite utilizar query parameters.

Por categoría:

```text
GET /api/services?category=Consultas
```

Por disponibilidad:

```text
GET /api/services?available=true
```

También pueden combinarse.

---

### Crear un servicio

```http
POST /api/services
```

Ejemplo de body:

```json
{
  "name": "Consulta nutricional",
  "description": "Consulta personalizada",
  "duration": 45,
  "price": 15000,
  "category": "Consultas",
  "available": true
}
```

El ID se genera automáticamente.

---

## Reservas

Una reserva tiene la siguiente estructura:

```json
{
  "id": 1,
  "clientName": "Evelyn Fernandez",
  "clientEmail": "evelyn@email.com",
  "date": "2026-09-10",
  "time": "10:30",
  "status": "pending",
  "services": [
    {
      "service": 1,
      "quantity": 1
    }
  ]
}
```

### Endpoints de reservas

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/bookings` | Crear una reserva |
| GET | `/api/bookings/:bid` | Obtener una reserva por ID |
| POST | `/api/bookings/:bid/services/:sid` | Agregar un servicio a una reserva |

---

### Crear una reserva

```http
POST /api/bookings
```

Ejemplo de body:

```json
{
  "clientName": "Evelyn Fernandez",
  "clientEmail": "evelyn@email.com",
  "date": "2026-09-10",
  "time": "10:30",
  "status": "pending"
}
```

La reserva se crea inicialmente con:

```json
"services": []
```

---

### Agregar un servicio a una reserva

```http
POST /api/bookings/:bid/services/:sid
```

Ejemplo:

```text
POST /api/bookings/1/services/1
```

Antes de agregar el servicio, el controller valida que:

1. La reserva exista.
2. El servicio exista.

La existencia del servicio se verifica mediante `ServiceManager`.

Si el servicio todavía no está agregado:

```json
{
  "service": 1,
  "quantity": 1
}
```

Si el mismo servicio se agrega nuevamente, se incrementa `quantity`:

```json
{
  "service": 1,
  "quantity": 2
}
```

---

## Controllers

### services.controller.js

Contiene las funciones:

- `getServices`
- `getServiceById`
- `createService`
- `updateService`
- `deleteService`

Estas funciones interactúan con `ServiceManager`.

### bookings.controller.js

Contiene las funciones:

- `createBooking`
- `getBookingById`
- `addServiceToBooking`

Estas funciones interactúan con `BookingManager`.

`addServiceToBooking` también utiliza `ServiceManager` para verificar que el servicio solicitado exista.

---

## Managers

### ServiceManager

Administra la información almacenada en `services.json`.

Principales operaciones:

- Obtener servicios
- Buscar servicios por ID
- Crear servicios
- Actualizar servicios
- Eliminar servicios
- Generar IDs automáticamente

### BookingManager

Administra la información almacenada en `bookings.json`.

Principales operaciones:

- Crear reservas
- Buscar reservas por ID
- Agregar servicios a una reserva
- Incrementar la cantidad cuando un servicio ya está agregado
- Persistir los cambios en el archivo JSON

---

## Persistencia

La aplicación utiliza FileSystem mediante:

```javascript
fs/promises
```

Los datos se almacenan en:

```text
src/data/services.json
src/data/bookings.json
```

Esto permite que la información permanezca guardada aunque el servidor sea reiniciado.

---

## Códigos de estado utilizados

La API utiliza códigos HTTP para indicar el resultado de cada operación:

- `200 OK`: operación realizada correctamente.
- `201 Created`: recurso creado correctamente.
- `400 Bad Request`: datos inválidos o incompletos.
- `404 Not Found`: servicio o reserva no encontrada.
- `500 Internal Server Error`: error interno del servidor.

---

## Variables de entorno

Las variables utilizadas por el proyecto son:

```env
PORT=
NODE_ENV=
```

El archivo `.env` no se incluye en el repositorio.

Se proporciona `.env.example` como referencia para configurar el proyecto.

---

## Ejecución

Para iniciar el servidor:

```bash
npm start
```

El comando ejecuta:

```bash
node server.js
```

Una vez iniciado correctamente se mostrará:

```text
Servidor escuchando en el puerto 8080
```

---

## Estado del proyecto

Actualmente la API cuenta con:

- Gestión CRUD de servicios.
- Creación y consulta de reservas.
- Asociación de servicios a reservas.
- Incremento de cantidad de servicios repetidos.
- Persistencia mediante archivos JSON.
- Configuración mediante variables de entorno.
- Arquitectura separada en Routers, Controllers y Managers.
- Manejo de respuestas y códigos HTTP.