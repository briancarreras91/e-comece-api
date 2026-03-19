const socket = io();

// Render inicial
socket.on("actualizarProductos", (products) => {
  renderProducts(products);
});

// Producto agregado
socket.on("productoAgregado", (product) => {
  addProductCard(product);
});

// Producto eliminado
socket.on("productoEliminado", (id) => {
  removeProductCard(id);
});

// Producto actualizado
socket.on("productoActualizado", (product) => {
  updateProductCard(product);
});

// Funciones auxiliares para  el DOM
function renderProducts(products) {
  const container = document.getElementById("productList");
  container.innerHTML = "";
  products.forEach(addProductCard);
}

function addProductCard(product) {
  const container = document.getElementById("productList");
  const col = document.createElement("div");
  col.className = "col-md-4 mb-4";
  col.id = `product-${product._id}`;

  col.innerHTML = `
    <div class="card h-100">
      <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}" />
      <div class="card-body text-dark">
        <h5 class="card-title">${product.title}</h5>
        <p class="card-text">$${product.price}</p>
        <button class="btn btn-danger btn-sm deleteBtn" data-id="${product._id}">Eliminar</button>
      </div>
    </div>
  `;
  container.appendChild(col);
}

function removeProductCard(id) {
  const card = document.getElementById(`product-${id}`);
  if (card) card.remove();
}

function updateProductCard(product) {
  const col = document.getElementById(`product-${product._id}`);
  if (col) {
    col.innerHTML = `
      <div class="card h-100">
        <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}" />
        <div class="card-body text-dark">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text">$${product.price}</p>
          <button class="btn btn-danger btn-sm deleteBtn" data-id="${product._id}">Eliminar</button>
        </div>
      </div>
    `;
  }
}
