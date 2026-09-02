# Sistema Backend de Turnos y Reservas

API REST desarrollada con **Node.js, Express y FileSystem** para gestionar servicios y reservas de un sistema de turnos.

El proyecto permite crear, consultar, actualizar y eliminar servicios, además de crear reservas y asociar servicios a cada una de ellas.

La información se almacena de forma persistente en archivos JSON, por lo que los datos se mantienen aunque el servidor se reinicie.

## Tecnologías utilizadas

- Node.js
- JavaScript
- Express
- ECMAScript Modules (ESM)
- File System de Node.js
- dotenv
- JSON para persistencia de datos

## Instalación

1. Instalar las dependencias:

```bash
npm install
```

2. Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

3. Configurar las variables de entorno:

```env
PORT=8080
NODE_ENV=development
```

4. Iniciar el servidor:

```bash
npm start
```

El servidor quedará disponible en:

```text
http://localhost:8080
```

## Variables de entorno

El proyecto utiliza las siguientes variables:

- `PORT`: puerto en el que se ejecuta el servidor.
- `NODE_ENV`: entorno de ejecución de la aplicación.

Las variables son cargadas mediante `dotenv` y validadas al iniciar la aplicación.

El archivo `.env` no se incluye en el repositorio. El archivo `.env.example` sirve como referencia de las variables necesarias.

---

# API REST

La API gestiona dos recursos principales:

- `services`: servicios disponibles para reservar.
- `bookings`: reservas realizadas por los clientes.

---

## Servicios

Los servicios se almacenan de forma persistente en:

```text
src/data/services.json
```

Cada servicio tiene la siguiente estructura:

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

### Propiedades

- `id`: identificador único generado automáticamente.
- `name`: nombre del servicio.
- `description`: descripción del servicio.
- `duration`: duración del servicio.
- `price`: precio del servicio.
- `category`: categoría del servicio.
- `available`: indica si el servicio se encuentra disponible.

### Endpoints de servicios

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/services` | Obtiene todos los servicios |
| GET | `/api/services/:sid` | Obtiene un servicio por su id |
| POST | `/api/services` | Crea un nuevo servicio |
| PUT | `/api/services/:sid` | Actualiza un servicio |
| DELETE | `/api/services/:sid` | Elimina un servicio |

### Filtros

`GET /api/services` permite filtrar servicios utilizando query params.

Por categoría:

```text
GET /api/services?category=Consultas
```

Por disponibilidad:

```text
GET /api/services?available=true
```

También pueden combinarse:

```text
GET /api/services?category=Consultas&available=true
```

### Ejemplo de creación de un servicio

```json
{
  "name": "Consulta nutricional",
  "description": "Consulta personalizada de nutrición",
  "duration": 45,
  "price": 15000,
  "category": "salud",
  "available": true
}
```

El `id` no debe enviarse en el body porque es generado automáticamente por `ServiceManager`.

---

## Reservas

Las reservas se almacenan de forma persistente en:

```text
src/data/bookings.json
```

Cada reserva tiene la siguiente estructura:

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
      "quantity": 2
    }
  ]
}
```

### Propiedades

- `id`: identificador único generado automáticamente.
- `clientName`: nombre del cliente.
- `clientEmail`: correo electrónico del cliente.
- `date`: fecha de la reserva.
- `time`: horario de la reserva.
- `status`: estado de la reserva.
- `services`: array de servicios asociados a la reserva.

Cada elemento del array `services` tiene la siguiente estructura:

```json
{
  "service": 1,
  "quantity": 1
}
```

`service` almacena el identificador del servicio asociado.

Si el mismo servicio se agrega nuevamente a una reserva, no se crea un elemento duplicado. En su lugar, se incrementa el valor de `quantity`.

### Endpoints de reservas

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/bookings` | Crea una nueva reserva |
| GET | `/api/bookings/:bid` | Obtiene una reserva por su id |
| POST | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva |

### Ejemplo de creación de una reserva

```text
POST /api/bookings
```

Body:

```json
{
  "clientName": "Evelyn Fernandez",
  "clientEmail": "evelyn@email.com",
  "date": "2026-09-10",
  "time": "10:30",
  "status": "pending"
}
```

El `id` se genera automáticamente y la reserva se crea inicialmente con:

```json
"services": []
```

### Agregar un servicio a una reserva

Por ejemplo:

```text
POST /api/bookings/1/services/1
```

Agrega el servicio con `id: 1` a la reserva con `id: 1`.

Antes de realizar la operación, la API valida que tanto la reserva como el servicio existan.

La primera vez se almacena:

```json
{
  "service": 1,
  "quantity": 1
}
```

Si se realiza nuevamente la misma petición:

```text
POST /api/bookings/1/services/1
```

la cantidad se incrementa:

```json
{
  "service": 1,
  "quantity": 2
}
```

---

## Managers

La lógica de acceso y modificación de los datos se encuentra separada de las rutas mediante managers.

### ServiceManager

Ubicado en:

```text
src/managers/ServiceManager.js
```

Implementa:

- `getServices()`
- `getServiceById(id)`
- `addService(serviceData)`
- `updateService(id, updatedData)`
- `deleteService(id)`

### BookingManager

Ubicado en:

```text
src/managers/BookingManager.js
```

Implementa:

- `createBooking(bookingData)`
- `getBookingById(id)`
- `addServiceToBooking(bookingId, serviceId)`

---

## Persistencia con FileSystem

El proyecto utiliza el módulo `fs/promises` de Node.js para leer y escribir información de forma asíncrona.

Los datos se almacenan en:

```text
src/data/services.json
src/data/bookings.json
```

De esta manera, los servicios y reservas persisten aunque el servidor se detenga o reinicie.

---

## Estructura del proyecto

```text
sistema-turnos/
│
├── src/
│   ├── config/
│   │   └── env.config.js
│   │
│   ├── data/
│   │   ├── services.json
│   │   └── bookings.json
│   │
│   ├── managers/
│   │   ├── ServiceManager.js
│   │   └── BookingManager.js
│   │
│   ├── routes/
│   │   ├── services.router.js
│   │   └── bookings.router.js
│   │
│   └── app.js
│
├── server.js
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Ejecución

Para iniciar el servidor:

```bash
npm start
```

La aplicación carga las variables de entorno, inicia Express y habilita las rutas:

```text
/api/services
/api/bookings
```

Los endpoints pueden probarse utilizando herramientas como Postman.