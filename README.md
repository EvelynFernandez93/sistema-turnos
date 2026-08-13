# Sistema de Turnos y Reservas

Proyecto Backend desarrollado con Node.js para administrar los servicios de un sistema de turnos y reservas.

El proyecto implementa una clase `ServiceManager` que permite obtener, buscar, agregar, actualizar y eliminar servicios. Los datos se almacenan de forma persistente en un archivo JSON.

## Tecnologías utilizadas

- Node.js
- JavaScript
- ECMAScript Modules (ESM)
- dotenv
- File System de Node.js

## Instalación

1. Instalar las dependencias:

```bash
npm install
```

2. Crear un archivo `.env` en la raíz del proyecto tomando como referencia el archivo `.env.example`.

3. Configurar las variables de entorno:

```env
PORT=8080
NODE_ENV=development
```

4. Ejecutar el proyecto:

```bash
npm start
```

## Variables de entorno

El proyecto utiliza las siguientes variables de entorno:

- `PORT`: puerto utilizado por la aplicación.
- `NODE_ENV`: entorno en el que se ejecuta la aplicación.

Las variables de entorno son cargadas utilizando `dotenv` y se validan al iniciar la aplicación.

Si alguna de las variables obligatorias no se encuentra definida, la aplicación lanza un error indicando cuál es la variable faltante.

El archivo `.env` no se incluye en el repositorio. Se proporciona `.env.example` como referencia de las variables necesarias.

## Recurso Services

Los servicios se almacenan en:

`src/data/services.json`

Cada servicio posee la siguiente estructura:

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

### Propiedades de un servicio

- `id`: identificador único del servicio. Se genera automáticamente.
- `name`: nombre del servicio.
- `description`: descripción del servicio.
- `duration`: duración del servicio.
- `price`: precio del servicio.
- `category`: categoría a la que pertenece el servicio.
- `available`: indica si el servicio se encuentra disponible.

## ServiceManager

La clase `ServiceManager`, ubicada en `src/managers/ServiceManager.js`, es la encargada de administrar los servicios.

Implementa los siguientes métodos:

### getServices()

Obtiene y devuelve todos los servicios almacenados.

```javascript
const services = await serviceManager.getServices();
```

### getServiceById(id)

Busca un servicio utilizando su identificador.

```javascript
const service = await serviceManager.getServiceById(1);
```

Si el servicio no existe, devuelve `null`.

### addService(serviceData)

Agrega un nuevo servicio.

```javascript
const newService = await serviceManager.addService({
  name: "Consulta general",
  description: "Consulta inicial de 30 minutos",
  duration: 30,
  price: 10000,
  category: "Consultas",
  available: true
});
```

El método valida que estén presentes los siguientes campos obligatorios:

- `name`
- `description`
- `duration`
- `price`
- `category`
- `available`

El `id` no debe enviarse al crear un servicio, ya que es generado automáticamente por `ServiceManager`.

### updateService(id, updatedData)

Actualiza los datos de un servicio existente.

Por ejemplo:

```javascript
const updatedService = await serviceManager.updateService(1, {
  price: 12000,
  duration: 45
});
```

El método no permite modificar el `id` del servicio.

Si el servicio solicitado no existe, devuelve `null`.

### deleteService(id)

Elimina un servicio utilizando su identificador.

```javascript
const deletedService = await serviceManager.deleteService(1);
```

Si el servicio no existe, devuelve `null`.

## Estructura del proyecto

```text
sistema-turnos/
│
├── src/
│   ├── config/
│   │   └── env.config.js
│   │
│   ├── data/
│   │   └── services.json
│   │
│   ├── managers/
│   │   └── ServiceManager.js
│   │
│   └── app.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Ejecución

Para iniciar el proyecto:

```bash
npm start
```

La aplicación carga y valida las variables de entorno e inicializa el `ServiceManager` para acceder a los servicios almacenados.