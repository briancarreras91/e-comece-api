const socket = io();

const form = document.getElementById("productForm");
const productList = document.getElementById("productList");

// Crear producto
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    title: form.title.value,
    description: form.description.value,
    code: form.code.value,
    price: Number(form.price.value),
    status: true,
    stock: Number(form.stock.value),
    category: form.category.value,
    thumbnails: [form.thumbnails.value],
  };
  socket.emit("newProduct", data);
  form.reset();
});

// Eliminar producto
productList.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteBtn")) {
    const li = e.target.closest("li");
    const id = li.getAttribute("data-id");
    socket.emit("deleteProduct", Number(id));
  }
});

// Actualizar lista en tiempo real
socket.on("productAdded", (product) => {
  const li = document.createElement("li");
  li.setAttribute("data-id", product.id);
  li.innerHTML = `${product.title} - $${product.price} <button class="deleteBtn">Eliminar</button>`;
  productList.appendChild(li);
});

socket.on("productDeleted", (id) => {
  const li = productList.querySelector(`li[data-id="${id}"]`);
  if (li) li.remove();
});
