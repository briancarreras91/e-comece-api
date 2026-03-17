const socket = io();

// Render inicial: recibe toda la lista de productos
socket.on("actualizarProductos", (products) => {
  renderProducts(products);
});

// Producto agregado: recibe solo el objeto nuevo
socket.on("productoAgregado", (product) => {
  addProductCard(product);
});

// Producto eliminado: recibe solo el ID
socket.on("productoEliminado", (id) => {
  removeProductCard(id);
});

// Producto actualizado: recibe solo el objeto modificado
socket.on("productoActualizado", (product) => {
  updateProductCard(product);
});

// Funciones auxiliares para manipular el DOM
function renderProducts(products) {
  const container = document.getElementById("productsContainer");
  container.innerHTML = "";
  products.forEach(addProductCard);
}

function addProductCard(product) {
  const container = document.getElementById("productsContainer");
  const card = document.createElement("div");
  card.id = `product-${product.id}`;
  card.className = "product-card";
  card.innerHTML = `
    <h3>${product.title}</h3>
    <p>${product.description}</p>
    <p>Precio: $${product.price}</p>
    <img src="/imagenes/${product.thumbnail}" alt="${product.title}" />
  `;
  container.appendChild(card);
}

function removeProductCard(id) {
  const card = document.getElementById(`product-${id}`);
  if (card) card.remove();
}

function updateProductCard(product) {
  const card = document.getElementById(`product-${product.id}`);
  if (card) {
    card.innerHTML = `
      <h3>${product.title}</h3>
      <p>${product.description}</p>
      <p>Precio: $${product.price}</p>
      <img src="/imagenes/${product.thumbnail}" alt="${product.title}" />
    `;
  }
}
