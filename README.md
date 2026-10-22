# Sistema Backend de Turnos y Reservas

API REST desarrollada con **Node.js, Express, MongoDB Atlas y Mongoose** para la gestión de servicios y reservas.

Este proyecto fue desarrollado como parte de la formación en Desarrollo Backend, incorporando progresivamente arquitectura por capas, persistencia de datos, validaciones, consultas avanzadas, vistas dinámicas y comunicación en tiempo real.

**Repositorio:** [Sistema de Turnos y Reservas - GitHub](https://github.com/EvelynFernandez93/sistema-turnos)

---

## 1. Descripción del proyecto

El **Sistema Backend de Turnos y Reservas** permite administrar servicios y registrar reservas asociadas a dichos servicios.

La aplicación implementa operaciones CRUD sobre servicios, creación y consulta de reservas, relaciones entre colecciones de MongoDB y validación de datos antes de su almacenamiento.

También incorpora vistas dinámicas mediante Handlebars y actualizaciones en tiempo real utilizando Socket.io.

### Funcionalidades principales

- Crear, consultar, actualizar y eliminar servicios.
- Crear reservas para clientes.
- Consultar reservas por identificador.
- Agregar servicios a reservas existentes.
- Administrar cantidades de servicios asociados a una reserva.
- Filtrar servicios por categoría y disponibilidad.
- Paginar resultados.
- Ordenar servicios por distintos campos.
- Validar datos mediante Zod.
- Validar identificadores ObjectId de MongoDB.
- Relacionar reservas y servicios mediante referencias.
- Recuperar información relacionada utilizando `populate()`.
- Renderizar vistas dinámicas con Handlebars.
- Actualizar la interfaz en tiempo real mediante Socket.io.

> **Alcance:** la actualización en tiempo real está implementada para la creación de servicios. La aplicación todavía no incorpora autenticación, gestión completa de disponibilidad horaria ni prevención de reservas superpuestas.

---

## 2. Tecnologías utilizadas

### Backend

- Node.js
- JavaScript ES Modules
- Express.js

### Base de datos

- MongoDB Atlas
- Mongoose

### Validaciones

- Zod

### Vistas dinámicas

- Handlebars
- Express Handlebars

### Comunicación en tiempo real

- Socket.io

### Configuración

- dotenv

### Herramientas de desarrollo

- Visual Studio Code
- Git
- GitHub
- Postman

---

## 3. Arquitectura del proyecto

El proyecto utiliza una **arquitectura organizada por capas**, con el objetivo de separar responsabilidades, mejorar el mantenimiento del código y facilitar futuras ampliaciones.

### Flujo general

```text
Cliente / Postman
       |
       v
     Routes
       |
       v
 Middlewares Zod
       |
       v
   Controllers
       |
       v
     Services
       |
       v
   Repositories
       |
       v
       DAO
       |
       v
 Mongoose Models
       |
       v
  MongoDB Atlas
```

### Routes

Definen los endpoints disponibles y conectan cada petición HTTP con su controlador correspondiente.

También incorporan los middlewares de validación.

### Middlewares

Interceptan las peticiones antes de llegar a los controladores.

En este proyecto se utilizan para validar los datos enviados mediante `req.body` y los identificadores recibidos mediante `req.params`.

### Controllers

Reciben las peticiones HTTP, extraen los parámetros necesarios, ejecutan los servicios correspondientes y generan las respuestas.

### Services

Contienen la lógica de negocio de la aplicación.

Por ejemplo:

- Crear una reserva.
- Comprobar que una reserva exista.
- Comprobar que un servicio exista.
- Agregar un servicio a una reserva.
- Incrementar la cantidad de un servicio existente.
- Preparar filtros y opciones de paginación.

### Repositories

Proporcionan una interfaz de acceso a los datos y permiten desacoplar la lógica de negocio de la implementación de persistencia.

### DAO

**Data Access Object.**

Es la capa encargada de ejecutar las operaciones sobre MongoDB mediante Mongoose.

### Models

Definen la estructura de los documentos almacenados en MongoDB y sus validaciones.

---

## 4. Estructura del proyecto

La aplicación se encuentra organizada de la siguiente manera:

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
│   │   └── booking.model.js
│   │
│   ├── routes/
│   │   ├── services.router.js
│   │   ├── bookings.router.js
│   │   └── views.router.js
│   │
│   ├── middlewares/
│   │   └── validate.middleware.js
│   │
│   ├── schemas/
│   │   ├── services.schema.js
│   │   └── bookings.schema.js
│   │
│   ├── utils/
│   │   └── ValidationError.js
│   │
│   ├── public/
│   │   ├── css/
│   │   │   └── styles.css
│   │   └── js/
│   │       └── socket.js
│   │
│   ├── views/
│   │   ├── layouts/
│   │   │   └── main.handlebars
│   │   ├── services.handlebars
│   │   └── availability.handlebars
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

## 5. Instalación y configuración

### Requisitos previos

Es necesario tener instalado:

- Node.js
- npm
- Git

También se necesita acceso a una base de datos MongoDB Atlas.

### Clonar el repositorio

```bash
git clone https://github.com/EvelynFernandez93/sistema-turnos.git
```

### Acceder al proyecto

```bash
cd sistema-turnos
```

### Instalar dependencias

```bash
npm install
```

### Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto.

Ejemplo:

```env
PORT=8080
NODE_ENV=development
MONGO_URI=mongodb+srv://USUARIO:CONTRASENA@CLUSTER.mongodb.net/sistema_turnos?retryWrites=true&w=majority
```

Reemplazar los valores de ejemplo por las credenciales correspondientes de MongoDB Atlas.

El archivo `.env` contiene información sensible y no debe subirse a GitHub.

También es necesario configurar correctamente el acceso de red en MongoDB Atlas.

### Ejecutar el servidor

```bash
npm start
```

Cuando la aplicación inicia correctamente, la terminal muestra mensajes similares a:

```text
MongoDB conectado correctamente
Servidor escuchando en el puerto 8080
```

---

## 6. API REST - Servicios

**Ruta base:**

```http
/api/services
```

### Endpoints disponibles

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/services` | Obtener todos los servicios |
| GET | `/api/services/:sid` | Obtener un servicio por ID |
| POST | `/api/services` | Crear un servicio |
| PUT | `/api/services/:sid` | Actualizar un servicio |
| DELETE | `/api/services/:sid` | Eliminar un servicio |

### 6.1. Obtener servicios

```http
GET /api/services
```

Devuelve los servicios almacenados en MongoDB junto con información de paginación.

### 6.2. Obtener un servicio por ID

```http
GET /api/services/:sid
```

El parámetro `sid` representa el identificador del servicio.

### 6.3. Crear un servicio

```http
POST /api/services
```

Ejemplo de body:

```json
{
  "name": "Consulta general",
  "description": "Consulta de atención general",
  "duration": 30,
  "price": 10000,
  "category": "Consultas",
  "available": true
}
```

**Respuesta esperada:**

```http
201 Created
```

### 6.4. Actualizar un servicio

```http
PUT /api/services/:sid
```

Ejemplo:

```json
{
  "price": 15000,
  "duration": 45
}
```

Permite actualizar los campos enviados sin necesidad de modificar todos los datos del servicio.

### 6.5. Eliminar un servicio

```http
DELETE /api/services/:sid
```

Elimina el servicio correspondiente al identificador indicado.

---

## 7. Consultas avanzadas de servicios

El endpoint `GET /api/services` admite filtros, paginación y ordenamiento.

### Parámetros disponibles

| Parámetro | Descripción | Ejemplo |
|---|---|---|
| `category` | Filtrar por categoría | Consultas |
| `available` | Filtrar por disponibilidad | true |
| `page` | Número de página | 1 |
| `limit` | Resultados por página | 5 |
| `sortBy` | Campo de ordenamiento | price |
| `order` | Dirección del ordenamiento | asc |

### Campos permitidos para `sortBy`

- `name`
- `price`
- `duration`
- `category`
- `createdAt`

### Valores permitidos para `order`

- `asc`: ascendente.
- `desc`: descendente.

### Ejemplo: filtrar por categoría

```http
GET /api/services?category=Consultas
```

### Ejemplo: filtrar por disponibilidad

```http
GET /api/services?available=true
```

### Ejemplo: paginación

```http
GET /api/services?page=2&limit=5
```

### Ejemplo: ordenar por precio descendente

```http
GET /api/services?sortBy=price&order=desc
```

### Ejemplo: combinar filtros

```http
GET /api/services?category=Consultas&available=true&page=1&limit=5&sortBy=price&order=asc
```

### Respuesta paginada

Ejemplo ilustrativo:

```json
{
  "results": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Consulta general",
      "description": "Consulta de atención general",
      "duration": 30,
      "price": 10000,
      "category": "Consultas",
      "available": true
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 5,
    "totalPages": 1,
    "hasPrevPage": false,
    "hasNextPage": false
  }
}
```

### Metadatos de paginación

| Propiedad | Descripción |
|---|---|
| `total` | Cantidad total de documentos que coinciden con los filtros |
| `page` | Página actual |
| `limit` | Cantidad máxima de resultados por página |
| `totalPages` | Número total de páginas |
| `hasPrevPage` | Indica si existe una página anterior |
| `hasNextPage` | Indica si existe una página siguiente |

La paginación se implementa mediante métodos de Mongoose:

```javascript
find()
sort()
skip()
limit()
countDocuments()
```

---

## 8. API REST - Reservas

**Ruta base:**

```http
/api/bookings
```

### Endpoints disponibles

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/bookings` | Crear una reserva |
| GET | `/api/bookings/:bid` | Obtener una reserva por ID |
| POST | `/api/bookings/:bid/services/:sid` | Agregar un servicio a una reserva |

### 8.1. Crear una reserva

```http
POST /api/bookings
```

Ejemplo:

```json
{
  "clientName": "María González",
  "clientEmail": "maria@example.com",
  "date": "2026-10-20",
  "time": "10:30",
  "status": "pending",
  "services": []
}
```

**Respuesta esperada:**

```http
201 Created
```

La reserva se almacena en MongoDB y recibe un identificador generado automáticamente.

Los servicios pueden agregarse posteriormente mediante el endpoint correspondiente.

### 8.2. Obtener una reserva por ID

```http
GET /api/bookings/:bid
```

El parámetro `bid` representa el identificador de la reserva.

Este endpoint recupera la reserva y sus servicios relacionados mediante `populate()`.

### 8.3. Agregar un servicio a una reserva

```http
POST /api/bookings/:bid/services/:sid
```

Parámetros:

- `bid`: identificador de la reserva.
- `sid`: identificador del servicio.

Ejemplo de body:

```json
{
  "quantity": 2
}
```

Si el servicio no está asociado a la reserva, se agrega.

Si ya existe, se incrementa su cantidad.

Cuando no se especifica `quantity`, se utiliza el valor predeterminado `1`.

**Respuesta esperada:**

```http
200 OK
```

---

## 9. Relaciones entre reservas y servicios

MongoDB es una base de datos NoSQL orientada a documentos.

En este proyecto, las reservas se relacionan con los servicios mediante referencias `ObjectId`.

### Estructura de una reserva

Ejemplo:

```json
{
  "clientName": "María González",
  "clientEmail": "maria@example.com",
  "date": "2026-10-20",
  "time": "10:30",
  "status": "pending",
  "services": [
    {
      "service": "507f1f77bcf86cd799439011",
      "quantity": 2
    }
  ]
}
```

El campo `service` contiene una referencia al documento correspondiente en la colección de servicios.

### Uso de populate()

Mongoose permite recuperar la información relacionada mediante:

```javascript
const booking = await Booking.findById(id)
  .populate("services.service");
```

### Resultado

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "clientName": "María González",
  "clientEmail": "maria@example.com",
  "date": "2026-10-20",
  "time": "10:30",
  "status": "pending",
  "services": [
    {
      "service": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Consulta general",
        "description": "Consulta de atención general",
        "duration": 30,
        "price": 10000,
        "category": "Consultas",
        "available": true
      },
      "quantity": 2
    }
  ]
}
```

Esta relación permite mantener los datos de los servicios centralizados en su propia colección.

---

## 10. Validaciones con Zod

El proyecto utiliza **Zod** para validar la información recibida antes de ejecutar las operaciones de negocio.

Los esquemas se encuentran en:

```text
src/schemas/services.schema.js
src/schemas/bookings.schema.js
```

El middleware reutilizable se encuentra en:

```text
src/middlewares/validate.middleware.js
```

### Validaciones de servicios

Al crear o actualizar servicios se comprueba:

- Nombre obligatorio.
- Descripción obligatoria.
- Duración mayor que cero.
- Precio no negativo.
- Categoría obligatoria.
- Disponibilidad de tipo booleano.
- Rechazo de propiedades no permitidas.

### Validaciones de reservas

Al crear una reserva se comprueba:

- Nombre del cliente obligatorio.
- Correo electrónico con formato válido.
- Fecha con formato `YYYY-MM-DD`.
- Hora con formato `HH:mm`.
- Estado permitido.
- Estructura de los servicios asociados.

### Estados admitidos

- `pending`
- `confirmed`
- `cancelled`

### Validación de cantidades

Al agregar servicios a una reserva:

- La cantidad debe ser numérica.
- Debe ser un número entero.
- Debe ser mayor que cero.
- Si se omite, se utiliza `1`.

### Validación de ObjectId

Los identificadores de las reservas y los servicios se validan antes de realizar las operaciones correspondientes.

### Ejemplo de petición inválida

```json
{
  "clientName": "",
  "clientEmail": "correo-invalido",
  "date": "20/10/2026",
  "time": "30:90",
  "status": "pending",
  "services": []
}
```

**Respuesta esperada:**

```http
400 Bad Request
```

Ejemplo ilustrativo de respuesta:

```json
{
  "error": "Datos inválidos",
  "details": [
    {
      "field": "clientName",
      "message": "El nombre del cliente es obligatorio"
    },
    {
      "field": "clientEmail",
      "message": "El email no tiene un formato válido"
    }
  ]
}
```

El middleware impide que los datos inválidos lleguen a la capa de persistencia.

---

## 11. Vistas dinámicas con Handlebars

El proyecto incorpora **Handlebars** como motor de plantillas para generar contenido HTML desde el servidor.

### Vista de servicios

```http
GET /views/services
```

Permite visualizar los servicios almacenados en MongoDB.

URL:

```text
http://localhost:8080/views/services
```

### Vista de disponibilidad

```http
GET /views/availability
```

Permite consultar información sobre la disponibilidad de los servicios.

URL:

```text
http://localhost:8080/views/availability
```

### Ventajas de Handlebars

- Renderizado de HTML desde el servidor.
- Separación entre presentación y lógica.
- Reutilización de plantillas.
- Integración con Express.
- Visualización de información obtenida de MongoDB.

---

## 12. Comunicación en tiempo real con Socket.io

El proyecto utiliza **Socket.io** para establecer comunicación bidireccional entre el servidor y los clientes conectados.

### Funcionamiento

Cuando se crea un servicio mediante:

```http
POST /api/services
```

El servidor emite el evento:

```javascript
io.emit("serviceCreated", {
  message: "Se creó un nuevo servicio",
  service: newService
});
```

Los clientes conectados pueden escuchar el evento:

```javascript
socket.on("serviceCreated", (data) => {
  console.log(data.service);
});
```

La vista de servicios utiliza JavaScript del lado del cliente para incorporar el nuevo servicio sin necesidad de recargar manualmente la página.

### Actualización del DOM

El archivo:

```text
src/public/js/socket.js
```

Escucha el evento `serviceCreated` y genera dinámicamente una tarjeta HTML con la información del nuevo servicio.

Para ello se utilizan métodos como:

```javascript
document.createElement()
document.getElementById()
element.appendChild()
```

También se utiliza `textContent` para incorporar los datos como texto y evitar interpretarlos como HTML.

### Prevención de duplicados

Cada tarjeta posee un identificador asociado al ID del servicio:

```html
id="service-{{_id}}"
```

Antes de incorporar un servicio, el cliente comprueba si ya existe una tarjeta con ese identificador.

### Beneficios

- Actualización en tiempo real.
- Comunicación entre servidor y clientes.
- Mejor experiencia de usuario.
- Integración con las operaciones de la API REST.
- Visualización de nuevos servicios sin actualizar manualmente la página.

**Importante:** el evento implementado corresponde a la creación de servicios. Las actualizaciones y eliminaciones no se sincronizan automáticamente mediante Socket.io en esta versión.

---

## 13. Códigos de estado HTTP

La API utiliza códigos HTTP para informar el resultado de las operaciones.

| Código | Significado |
|---|---|
| 200 | Operación realizada correctamente |
| 201 | Recurso creado correctamente |
| 400 | Datos inválidos o petición incorrecta |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

---

## 14. Pruebas con Postman

Los endpoints fueron probados utilizando **Postman**.

### Pruebas de servicios

- Obtener servicios.
- Obtener un servicio por ID.
- Crear un servicio.
- Actualizar un servicio.
- Eliminar un servicio.
- Filtrar servicios.
- Paginar resultados.
- Ordenar por precio y otros campos.
- Rechazar datos inválidos.

### Pruebas de reservas

- Crear una reserva.
- Obtener una reserva por ID.
- Agregar un servicio a una reserva.
- Incrementar cantidades.
- Rechazar cantidades inválidas.
- Validar identificadores ObjectId.
- Recuperar servicios relacionados mediante `populate()`.

### Pruebas de vistas y tiempo real

- Acceder a las vistas de Handlebars.
- Mostrar información obtenida de MongoDB.
- Crear un servicio desde Postman.
- Recibir el evento `serviceCreated`.
- Actualizar la vista sin recargar la página.

### Procedimiento para probar Socket.io

1. Iniciar el servidor mediante `npm start`.
2. Abrir `http://localhost:8080/views/services`.
3. Abrir la consola del navegador mediante F12.
4. Crear un nuevo servicio desde Postman.
5. Verificar que la API responda con el código HTTP `201`.
6. Comprobar que el navegador reciba el evento `serviceCreated`.
7. Verificar que el nuevo servicio aparezca en la interfaz sin presionar F5.

---

## 15. Seguridad y buenas prácticas

El proyecto incorpora las siguientes prácticas de organización y seguridad:

- Uso de variables de entorno.
- Exclusión de credenciales mediante `.gitignore`.
- Validaciones con Zod.
- Separación de responsabilidades.
- Validaciones de Mongoose.
- Uso de referencias ObjectId.
- Manejo de errores HTTP.
- Organización modular del código.
- Uso de ES Modules.
- Separación de configuración y lógica de negocio.

### Archivos que no deben subirse al repositorio

```text
node_modules/
.env
```

El archivo `.env.example` puede incluirse como referencia, siempre que no contenga credenciales reales.

### Verificación de seguridad con Git

Durante la revisión final del proyecto se comprobó que el archivo `.env` no estaba siendo rastreado por Git y que la regla correspondiente de `.gitignore` funcionaba correctamente.

Comandos utilizados:

```bash
git ls-files .env
```

```bash
git check-ignore -v .env
```

```bash
git log --all --oneline -- .env
```

Estas comprobaciones permiten revisar la protección del archivo de configuración y su presencia en el historial local disponible.

**Nota:** para publicar una aplicación en producción también sería necesario incorporar controles adicionales, como autenticación, autorización y medidas de seguridad específicas del entorno.

---

## 16. Evolución del proyecto

El sistema fue desarrollado progresivamente durante las distintas entregas del curso Backend.

### Etapa 1: Persistencia con FileSystem

Implementación inicial de gestores de servicios y almacenamiento mediante archivos JSON.

### Etapa 2: API REST con Express

Creación de endpoints HTTP para administrar servicios.

### Etapa 3: Gestión de reservas

Incorporación de reservas y asociación de servicios.

### Etapa 4: Arquitectura por capas

Separación del proyecto en:

- Routes.
- Controllers.
- Services.
- Repositories.
- DAO.

### Etapa 5: MongoDB Atlas y Mongoose

Migración de la persistencia a una base de datos MongoDB Atlas.

Definición de modelos y relaciones entre documentos.

### Etapa 6: Handlebars y Socket.io

Incorporación de vistas dinámicas y comunicación en tiempo real.

### Etapa 7: Consultas avanzadas y validaciones

Implementación de:

- Filtros.
- Paginación.
- Ordenamiento.
- Validaciones con Zod.
- Validación de ObjectId.
- Relaciones mediante `populate()`.

---

## 17. Posibles mejoras futuras

El proyecto puede ampliarse incorporando:

- Autenticación y autorización de usuarios.
- Inicio de sesión con JWT.
- Roles y permisos.
- Gestión de disponibilidad por fechas y horarios.
- Confirmación y cancelación de reservas.
- Validación de conflictos de horarios.
- Paginación de reservas.
- Pruebas automatizadas.
- Documentación de API con Swagger.
- Despliegue en un entorno de producción.

---

## 18. Autora

**Evelyn Fernández**

Proyecto desarrollado como parte de la formación en Desarrollo Backend, aplicando conceptos de JavaScript, Node.js, Express, MongoDB, Mongoose, arquitectura por capas y desarrollo de APIs REST.

---

## 19. Repositorio

**GitHub:**

https://github.com/EvelynFernandez93/sistema-turnos