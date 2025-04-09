const productos = [
    { id: 1, nombre: "Cojines", precio: 300, imagen: "imagenes/cojines.jpg" },
    { id: 2, nombre: "Reloj", precio: 450, imagen: "imagenes/reloj.png" },
    { id: 3, nombre: "Cuadros", precio: 700, imagen: "imagenes/cuadros.png" },
    { id: 4, nombre: "Plantas Artificiales", precio: 500, imagen: "imagenes/maceta.png" },
    { id: 5, nombre: "Lámpara de Mesa", precio: 650, imagen: "imagenes/lamparaa.png" },
    { id: 6, nombre: "Espejo Decorativo", precio: 900, imagen: "imagenes/espejo.png" },
    { id: 7, nombre: "Alfombra Moderna", precio: 1200, imagen: "imagenes/alfombra.jpg" },
    { id: 8, nombre: "Cortinas Elegantes", precio: 800, imagen: "imagenes/cortinasjpg.jpg" },
    
    { id: 10, nombre: "Portaretratos", precio: 200, imagen: "imagenes/portaretratos.jpg" },
    { id: 11, nombre: "Jarrón Cerámico", precio: 550, imagen: "imagenes/jarron.webp" },
    { id: 12, nombre: "Velas Aromáticas", precio: 150, imagen: "imagenes/vela.jpg" },
    { id: 13, nombre: "Caja Organizadora", precio: 300, imagen: "imagenes/caja.png" },
    
];


const productosDiv = document.getElementById("productos");
const carritoUl = document.getElementById("lista-carrito");
const totalSpan = document.getElementById("total");
let contadorCarrito = document.getElementById("contador-carrito");
let cuponInput = document.getElementById("cupon-input");
let mensajeCupon = document.getElementById("mensaje-cupon");
let descuento = 0; 

productos.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("col-12", "col-md-6", "col-lg-3", "mb-3");
    div.setAttribute("role", "listitem");
    div.innerHTML = `
        <div class="card h-100 shadow-sm">
            <div class="text-center p-3">
                <img src="${producto.imagen}" class="card-img-top" alt="Imagen de un ${producto.nombre}" style="width: 150px; height: 150px; object-fit: cover;" role="img">
            </div>
            <div class="card-body text-center">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">Precio: $${producto.precio.toFixed(2)}</p>
                <input type="number" id="cantidad-${producto.id}" class="form-control mb-2 text-center" min="1" value="1">
                <button class="btn btn-dark btn-lg w-100" onclick="agregarAlCarrito(${producto.id})">Añadir al carrito</button>
            </div>
        </div>`;
    productosDiv.appendChild(div);
});

function agregarAlCarrito(id) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const producto = productos.find(p => p.id === id);
    const cantidad = parseInt(document.getElementById(`cantidad-${id}`).value);
    
    const itemIndex = carrito.findIndex(p => p.id === id);
    if (itemIndex !== -1) {
        carrito[itemIndex].cantidad += cantidad;
    } else {
        carrito.push({ ...producto, cantidad });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}

function mostrarCarrito() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carritoUl.innerHTML = "";
    let total = 0;
    let cantidadTotal = 0;

    if (carrito.length === 0) {
        carritoUl.innerHTML = "<tr><td colspan='4' class='text-center'>Tu carrito está vacío.</td></tr>";
    } else {
        carrito.forEach((producto, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${producto.nombre}</td>
                <td>$${producto.precio.toFixed(2)}</td>
                <td>${producto.cantidad}</td>
                <td><button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${index})">Eliminar</button></td>
            `;
            carritoUl.appendChild(tr);
            total += producto.precio * producto.cantidad;
            cantidadTotal += producto.cantidad;
        });
    }

    total -= descuento; // Aplica el descuento
    totalSpan.textContent = `$${total.toFixed(2)}`;
    contadorCarrito.textContent = cantidadTotal;
}

function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}

document.getElementById("limpiar-carrito").addEventListener("click", () => {
    localStorage.removeItem("carrito");
    mostrarCarrito();
});

// Aplicar cupón con nuevo código
document.getElementById("aplicar-cupon").addEventListener("click", () => {
    const cupon = cuponInput.value.trim();
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let total = 0;
    
    // Calcula el total sin descuento
    carrito.forEach(producto => {
        total += producto.precio * producto.cantidad;
    });

    if (cupon === "homeessence") {
        descuento = 0.50 * total; // Aplicar 50% de descuento
        mensajeCupon.textContent = "¡Cupón aplicado exitosamente!";
    } else {
        descuento = 0;
        mensajeCupon.textContent = "Código de cupón inválido.";
    }
    mostrarCarrito();
});

document.getElementById("btn-pagar").addEventListener("click", () => {
  const totalFinal = calcularTotal().toFixed(2);
  localStorage.setItem("total", totalFinal);
  window.location.href = "pago.html";  // Redirigir a la página de pago
});

mostrarCarrito();  // Mostrar el carrito al cargar la página
    