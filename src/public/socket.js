const socket = io();

// Render inicial de productos
socket.on("actualizarProductos", (products) => {
  const contenedor = document.getElementById("productList");
  contenedor.innerHTML = "";

  products.forEach((prod) => {
    const col = document.createElement("div");
    col.classList.add("col-md-4", "mb-3");
    col.setAttribute("data-id", prod.id);

    col.innerHTML = `
      <div class="card h-100">
        <img src="/imagenes/${prod.thumbnail}" class="card-img-top" alt="${prod.title}" />
        <div class="card-body text-dark">
          <h5 class="card-title">${prod.title}</h5>
          <p class="card-text">$${prod.price}</p>
          <button class="btn btn-danger btn-sm deleteBtn">Eliminar</button>
        </div>
      </div>
    `;

    contenedor.appendChild(col);
  });
});

// Manejo del formulario para agregar productos
const form = document.getElementById("productForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const nuevoProducto = Object.fromEntries(formData.entries());

  // Emitimos al servidor el nuevo producto
  socket.emit("nuevoProducto", nuevoProducto);

  form.reset();
});
