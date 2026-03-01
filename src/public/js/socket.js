const socket = io();

// Renderizar productos en tiempo real
socket.on("actualizarProductos", (products) => {
  const contenedor = document.getElementById("productList");
  contenedor.innerHTML = "";

  products.forEach((prod) => {
    const card = document.createElement("div");
    card.classList.add("card", "h-100");
    card.innerHTML = `
      <img src="/imagenes/${prod.thumbnail}" class="card-img-top" alt="${prod.title}" />
      <div class="card-body text-dark">
        <h5 class="card-title">${prod.title}</h5>
        <p class="card-text">$${prod.price}</p>
        <button class="btn btn-danger btn-sm deleteBtn" data-id="${prod.id}">Eliminar</button>
      </div>
    `;
    contenedor.appendChild(card);
  });

  // Botones eliminar
  document.querySelectorAll(".deleteBtn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      socket.emit("eliminarProducto", id);
    });
  });
});

// Manejo del formulario para agregar productos con imagen
const form = document.getElementById("productForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  // Enviamos el producto al endpoint REST (incluye imagen)
  const response = await fetch("/api/products", {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    const nuevoProducto = await response.json();
    // Avisamos al servidor vía socket para actualizar todos los clientes
    socket.emit("nuevoProducto", nuevoProducto);
  }

  form.reset();
});
