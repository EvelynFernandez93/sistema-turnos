// ========================================
// CONEXIÓN CON SOCKET.IO
// ========================================

const socket = io();

socket.on("connect", () => {
  console.log("Conectado al servidor mediante Socket.io");
});

socket.on("disconnect", () => {
  console.log("Desconectado del servidor Socket.io");
});

// ========================================
// EVENTO: SERVICIO CREADO
// ========================================

socket.on("serviceCreated", (data) => {

  console.log("Nuevo servicio recibido:", data);

  // Obtener contenedor de servicios
  const servicesContainer =
    document.getElementById("services-container");

  // Evitar errores si estamos en otra vista
  if (!servicesContainer) {
    return;
  }

  // Obtener el servicio recibido
  const service = data?.service;

  // Validar que el servicio exista y tenga un ID
  if (!service || typeof service._id !== "string") {
    console.error(
      "El servicio recibido no tiene un ID válido"
    );

    return;
  }

  // ========================================
  // EVITAR TARJETAS DUPLICADAS
  // ========================================

  const existingCard = document.getElementById(
    `service-${service._id}`
  );

  if (existingCard) {
    console.log(
      "El servicio ya existe en la vista:",
      service.name
    );

    return;
  }

  // ========================================
  // ELIMINAR MENSAJE DE LISTA VACÍA
  // ========================================

  const emptyMessage =
    document.getElementById("empty-services-message");

  if (emptyMessage) {
    emptyMessage.remove();
  }

  // ========================================
  // CREAR TARJETA DEL SERVICIO
  // ========================================

  const serviceCard = document.createElement("article");

  serviceCard.classList.add("service-card");

  // Asignar ID único de MongoDB
  serviceCard.id = `service-${service._id}`;

  // ========================================
  // NOMBRE
  // ========================================

  const name = document.createElement("h3");

  name.textContent = service.name;

  serviceCard.appendChild(name);

  // ========================================
  // DESCRIPCIÓN
  // ========================================

  serviceCard.appendChild(
    createOption(
      "Descripción:",
      service.description
    )
  );

  // ========================================
  // DURACIÓN
  // ========================================

  serviceCard.appendChild(
    createOption(
      "Duración:",
      `${service.duration} minutos`
    )
  );

  // ========================================
  // PRECIO
  // ========================================

  serviceCard.appendChild(
    createOption(
      "Precio:",
      `$${service.price}`
    )
  );

  // ========================================
  // CATEGORÍA
  // ========================================

  serviceCard.appendChild(
    createOption(
      "Categoría:",
      service.category
    )
  );

  // ========================================
  // DISPONIBILIDAD
  // ========================================

  const availability = document.createElement("p");

  availability.classList.add("service-card-options");

  const availabilityTitle = document.createElement("strong");

  availabilityTitle.classList.add(
    "service-card-options-title"
  );

  availabilityTitle.textContent = "Disponibilidad:";

  const status = document.createElement("span");

  status.classList.add(
    "availability-status",
    service.available ? "available" : "unavailable"
  );

  status.textContent = service.available
    ? "Disponible"
    : "No disponible";

  availability.appendChild(availabilityTitle);

  availability.appendChild(status);

  serviceCard.appendChild(availability);

  // ========================================
  // AGREGAR TARJETA AL HTML
  // ========================================

  servicesContainer.appendChild(serviceCard);

  console.log(
    "Servicio agregado correctamente:",
    service.name
  );

});

// ========================================
// FUNCIÓN AUXILIAR
// ========================================

function createOption(title, value) {

  const option = document.createElement("p");

  option.classList.add("service-card-options");

  const optionTitle = document.createElement("strong");

  optionTitle.classList.add(
    "service-card-options-title"
  );

  optionTitle.textContent = title;

  const optionValue = document.createElement("span");

  optionValue.classList.add(
    "service-card-options-value"
  );

  optionValue.textContent = value;

  option.appendChild(optionTitle);

  option.appendChild(optionValue);

  return option;
}