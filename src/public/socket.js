const socket = io();

const form = document.getElementById("productForm");
const productList = document.getElementById("productList");

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

socket.on("productAdded", (product) => {
  const li = document.createElement("li");
  li.textContent = `${product.title} - $${product.price}`;
  productList.appendChild(li);
});

socket.on("productDeleted", (id) => {
  const items = productList.querySelectorAll("li");
  items.forEach((li) => {
    if (li.textContent.includes(`id: ${id}`)) {
      li.remove();
    }
  });
});
