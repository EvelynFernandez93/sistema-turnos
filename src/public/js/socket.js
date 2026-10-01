const socket = io();

socket.on("connect", () => {
  console.log("Conectado al servidor mediante Socket.io");
});

socket.on("serviceCreated", (data) => {
  console.log("Nuevo servicio recibido:", data);

  const servicesContainer =
    document.getElementById("services-container");

  if (!servicesContainer) {
    return;
  }

  const service = data.service;

  // Eliminar mensaje de lista vacía
  const emptyMessage =
    document.getElementById("empty-services-message");

  if (emptyMessage) {
    emptyMessage.remove();
  }

  // Crear card
  const serviceCard =
    document.createElement("article");

  serviceCard.classList.add("service-card");

  // Nombre
  const name = document.createElement("h3");
  name.textContent = service.name;

  serviceCard.appendChild(name);

  // Descripción
  serviceCard.appendChild(
    createOption(
      "Descripción:",
      service.description
    )
  );

  // Duración
  serviceCard.appendChild(
    createOption(
      "Duración:",
      `${service.duration} minutos`
    )
  );

  // Precio
  serviceCard.appendChild(
    createOption(
      "Precio:",
      `$${service.price}`
    )
  );

  // Categoría
  serviceCard.appendChild(
    createOption(
      "Categoría:",
      service.category
    )
  );

  // Disponibilidad
  const availability =
    document.createElement("p");

  availability.classList.add(
    "service-card-options"
  );

  const availabilityTitle =
    document.createElement("strong");

  availabilityTitle.classList.add(
    "service-card-options-title"
  );

  availabilityTitle.textContent =
    "Disponibilidad:";

  const status =
    document.createElement("span");

  status.classList.add(
    "availability-status",
    service.available
      ? "available"
      : "unavailable"
  );

  status.textContent =
    service.available
      ? "Disponible"
      : "No disponible";

  availability.appendChild(
    availabilityTitle
  );

  availability.appendChild(status);

  serviceCard.appendChild(
    availability
  );

  // Agregar nueva card
  servicesContainer.appendChild(
    serviceCard
  );
});


function createOption(title, value) {

  const option =
    document.createElement("p");

  option.classList.add(
    "service-card-options"
  );

  const optionTitle =
    document.createElement("strong");

  optionTitle.classList.add(
    "service-card-options-title"
  );

  optionTitle.textContent = title;

  const optionValue =
    document.createElement("span");

  optionValue.classList.add(
    "service-card-options-value"
  );

  optionValue.textContent = value;

  option.appendChild(optionTitle);
  option.appendChild(optionValue);

  return option;
}