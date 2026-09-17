# Sistema Backend de Turnos y Reservas

API REST desarrollada con **Node.js, Express y FileSystem** para gestionar servicios y reservas.

El proyecto permite crear, consultar, actualizar y eliminar servicios, además de crear reservas y asociar servicios a cada una de ellas.

Actualmente la aplicación utiliza una **arquitectura en capas**, separando las responsabilidades entre Routers, Controllers, Services, Repositories y DAOs.

Esta organización permite mantener el código desacoplado, escalable y preparado para futuras migraciones de persistencia, como MongoDB y Mongoose.

---

## Tecnologías utilizadas

- Node.js
- JavaScript
- Express
- ES Modules
- FileSystem (`fs/promises`)
- JSON
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
Archivo JSON
```

Cada capa tiene una responsabilidad específica.

### Router

Define los endpoints de la API y conecta cada ruta con su Controller.

Ejemplo:

```javascript
router.get("/", getServices);
router.get("/:sid", getServiceById);
router.post("/", createService);
router.put("/:sid", updateService);
router.delete("/:sid", deleteService);
```

Los Routers no contienen reglas de negocio ni acceden directamente a los datos.

---

### Controller

Recibe las solicitudes HTTP, obtiene información desde:

- `req.params`
- `req.query`
- `req.body`

Luego llama al Service correspondiente y genera la respuesta utilizando:

```javascript
res.status().json()
```

Ejemplo:

```javascript
export const getServiceById = async (req, res) => {
  try {
    const { sid } = req.params;

    const service = await getServiceByIdService(sid);

    if (!service) {
      return res.status(404).json({
        error: "Servicio no encontrado"
      });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};
```

Los Controllers son la única capa que trabaja directamente con `req` y `res`.

---

### Service

Contiene las reglas de negocio de la aplicación.

Los Services reciben datos desde los Controllers y utilizan los Repositories para consultar o modificar información.

No conocen `req`, `res`, FileSystem ni los archivos JSON.

Ejemplos de reglas de negocio:

- Validar campos obligatorios.
- Evitar la modificación del ID de un servicio.
- Aplicar filtros de servicios.
- Verificar que una reserva exista.
- Verificar que un servicio exista.
- Incrementar la cantidad de un servicio ya agregado a una reserva.

Una de las reglas principales del sistema es:

```javascript
if (existingService) {
  existingService.quantity += 1;
} else {
  booking.services.push({
    service: Number(serviceId),
    quantity: 1
  });
}
```

Esta lógica pertenece a `bookings.service.js`.

Si el mismo servicio se agrega nuevamente a una reserva, no se duplica el registro sino que aumenta su `quantity`.

---

### Repository

Los Repositories ofrecen una interfaz de acceso a los datos para los Services.

No contienen reglas de negocio y no acceden directamente a los archivos JSON.

Ejemplo:

```javascript
async getById(id) {
  return await this.dao.getById(id);
}
```

De esta forma, los Services no necesitan conocer cómo se almacenan físicamente los datos.

---

### DAO

DAO significa **Data Access Object**.

Es la capa responsable del acceso directo a la persistencia.

Actualmente los DAOs utilizan FileSystem para leer y escribir los archivos JSON mediante:

```javascript
fs.readFile()
```

y:

```javascript
fs.writeFile()
```

Por ejemplo:

```javascript
const data = await fs.readFile(this.path, "utf-8");

return JSON.parse(data);
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
│   │   └── env.config.js
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

Crear un archivo `.env` en la raíz del proyecto utilizando `.env.example` como referencia.

Ejemplo:

```env
PORT=8080
NODE_ENV=development
```

Ejecutar el servidor:

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

### Obtener todos los servicios

```http
GET /api/services
```

Ejemplo:

```http
GET http://localhost:8080/api/services
```

---

### Filtrar servicios

Se pueden utilizar query parameters.

Por disponibilidad:

```http
GET /api/services?available=true
```

Por categoría:

```http
GET /api/services?category=Consultas
```

Los parámetros son recibidos por el Controller y la lógica de filtrado es procesada por el Service.

---

### Obtener un servicio por ID

```http
GET /api/services/:sid
```

Ejemplo:

```http
GET /api/services/1
```

Si el servicio no existe:

```json
{
  "error": "Servicio no encontrado"
}
```

---

### Crear un servicio

```http
POST /api/services
```

Ejemplo de Body:

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

Los campos obligatorios son:

- `name`
- `description`
- `duration`
- `price`
- `category`
- `available`

Si faltan campos obligatorios, la API responde con `400 Bad Request`.

---

### Actualizar un servicio

```http
PUT /api/services/:sid
```

Ejemplo:

```http
PUT /api/services/1
```

Body:

```json
{
  "price": 12000
}
```

El ID del servicio no puede modificarse.

---

### Eliminar un servicio

```http
DELETE /api/services/:sid
```

Ejemplo:

```http
DELETE /api/services/1
```

---

# Reservas

## Crear una reserva

```http
POST /api/bookings
```

Ejemplo de Body:

```json
{
  "clientName": "Cliente Prueba",
  "clientEmail": "cliente@prueba.com",
  "date": "2026-09-20",
  "time": "11:00",
  "status": "pending"
}
```

La reserva se crea automáticamente con:

```json
{
  "services": []
}
```

y el ID es generado automáticamente por el sistema.

---

## Obtener una reserva por ID

```http
GET /api/bookings/:bid
```

Ejemplo:

```http
GET /api/bookings/1
```

Si la reserva no existe:

```json
{
  "error": "Reserva no encontrada"
}
```

---

## Agregar un servicio a una reserva

```http
POST /api/bookings/:bid/services/:sid
```

Ejemplo:

```http
POST /api/bookings/1/services/1
```

Este endpoint no necesita información en el Body.

Los IDs de la reserva y del servicio se obtienen mediante `req.params`.

Antes de agregar el servicio, la capa Service verifica:

1. Que la reserva exista.
2. Que el servicio exista.

Si el servicio todavía no pertenece a la reserva, se agrega:

```json
{
  "service": 1,
  "quantity": 1
}
```

Si el mismo servicio se agrega nuevamente:

```json
{
  "service": 1,
  "quantity": 2
}
```

La lógica de incremento de `quantity` se encuentra exclusivamente en `bookings.service.js`.

---

# Funciones por capa

## Services Controller

Expone:

```text
getServices
getServiceById
createService
updateService
deleteService
```

---

## Services Service

Expone:

```text
getServices
getServiceById
createService
updateService
deleteService
```

Contiene las validaciones y reglas de negocio relacionadas con los servicios.

---

## Services Repository

Expone:

```text
getAll
getById
create
update
delete
```

---

## Services DAO

Expone:

```text
getAll
getById
create
update
delete
```

Realiza la lectura y escritura de `services.json`.

---

## Bookings Controller

Expone:

```text
createBooking
getBookingById
addServiceToBooking
```

---

## Bookings Service

Expone:

```text
createBooking
getBookingById
addServiceToBooking
```

Contiene las reglas de negocio de las reservas, incluyendo el incremento de `quantity`.

---

## Bookings Repository

Expone:

```text
create
getById
update
```

---

## Bookings DAO

Expone:

```text
create
getById
update
```

Realiza la lectura y escritura de `bookings.json`.

---

# Persistencia

Actualmente la aplicación utiliza archivos JSON como mecanismo de persistencia:

```text
src/data/services.json
src/data/bookings.json
```

La lectura y escritura de estos archivos se realiza exclusivamente desde los DAOs utilizando `fs/promises`.

Esto permite que la información sobreviva al reinicio del servidor.

La arquitectura está preparada para que la persistencia pueda migrarse posteriormente hacia una base de datos sin mezclar esa implementación con Controllers o reglas de negocio.

---

# Códigos de estado HTTP

La API utiliza los siguientes códigos principales:

| Código | Significado |
|---|---|
| `200` | Operación realizada correctamente |
| `201` | Recurso creado correctamente |
| `400` | Datos incorrectos o incompletos |
| `404` | Recurso no encontrado |
| `500` | Error interno del servidor |

---

# Variables de entorno

El proyecto utiliza `dotenv` para gestionar variables de entorno.

Variables requeridas:

```env
PORT=
NODE_ENV=
```

El archivo `.env` no se incluye en el repositorio.

Se proporciona `.env.example` como referencia.

---

# Seguridad del repositorio

El archivo `.gitignore` evita subir información o dependencias que no deben formar parte del repositorio:

```gitignore
node_modules/
.env
```

Por lo tanto, el repositorio no incluye:

- `node_modules`
- `.env`
- credenciales reales

---

# Refactorización realizada

La primera versión de la aplicación concentraba el acceso a datos y las reglas de negocio dentro de Managers.

La arquitectura anterior era:

```text
Router
   ↓
Controller
   ↓
Manager
   ↓
JSON
```

Luego de la refactorización, los Managers fueron eliminados y sus responsabilidades fueron distribuidas correctamente.

La arquitectura actual es:

```text
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
JSON
```

Este cambio no modifica el comportamiento externo de la API ni sus endpoints.

El objetivo es separar responsabilidades y facilitar el mantenimiento, las pruebas y futuras modificaciones en el mecanismo de persistencia.

---

# Estado actual del proyecto

La API permite:

- Consultar servicios.
- Filtrar servicios por categoría y disponibilidad.
- Consultar servicios por ID.
- Crear servicios.
- Actualizar servicios.
- Eliminar servicios.
- Crear reservas.
- Consultar reservas por ID.
- Asociar servicios a reservas.
- Incrementar `quantity` cuando un servicio ya existe en una reserva.
- Validar reservas y servicios inexistentes.
- Persistir los datos mediante FileSystem.
- Gestionar variables de entorno.
- Separar rutas, Controllers, Services, Repositories y DAOs.

Todos los endpoints mantienen las mismas URLs utilizadas antes de la refactorización.

---

## Autora

**Evelyn Fernandez**

Proyecto desarrollado como parte del curso de Backend.