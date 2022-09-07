const articulos = document.querySelector('#lista-pedidos')

fetch('./js/data.json')
    .then( (res) => res.json())
    .then( (data) => {

        data.forEach((producto) => {
            const div = document.createElement('div')
            div.innerHTML = `
                <article class=" row">
                    <h4>${producto.nombre}</h4>
                    <img src="${producto.imagen}" alt="">
                    <p class="precio">Costo: $ ${producto.precio}</p>
                    <a href="#" data-id="${producto.id}" class="agregar-carrito">Añadir al Carrito</a>
                </article>    
            `

            articulos.append(div)
        })
    })

const carrito = document.getElementById('carrito')
const pedidos = document.getElementById('lista-pedidos')
const listaPedidos = document.querySelector('#lista-carrito tbody')
const vaciarCarritoBtn = document.getElementById('vaciar-carrito')

cargarEventListeners()

function cargarEventListeners(){
    pedidos.addEventListener('click', comprarPedido)
    carrito.addEventListener('click', eliminarPedido)
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito)
    document.addEventListener('DOMContentLoaded', leerLocalStorage)
}

function comprarPedido(e){
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')){
        const pedido = e.target.parentElement.parentElement;
        leerDatosPedido(pedido);
    }
}

function leerDatosPedido(pedido){
    const infoPedido = {
        imagen: pedido.querySelector('img').src,
        titulo: pedido.querySelector('h4').textContent,
        precio: pedido.querySelector('.precio').textContent,
        id: pedido.querySelector('a').getAttribute('data-id')
    }

    insertarCarrito(infoPedido)
}

function insertarCarrito(pedido){
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <img src="${pedido.imagen}" width=100 height=100>
        </td>
        <td>${pedido.titulo}</td>
        <td>${pedido.precio}</td>
        <td>
            <a href="#" class="borrar-pedido" data-id="${pedido.id}">X</a>
        </td>
    
    `;
    listaPedidos.appendChild(row)
    guardarPedidoLocalStorage(pedido)
}

function eliminarPedido(e){
    e.preventDefault()

    let pedido,
        pedidoId;
    
    if(e.target.classList.contains('borrar-pedido')){
        e.target.parentElement.parentElement.remove()
        pedido = e.target.parentElement.parentElement
        pedidoId = pedido.querySelector('a').getAttribute('data-id')
    }
    eliminarPedidoLocalStorage(pedidoId)
}

function vaciarCarrito(){
    while(listaPedidos.firstChild){
        listaPedidos.removeChild(listaPedidos.firstChild)
    }

    vaciarLocalStorage()

    return false;
}

function guardarPedidoLocalStorage(pedido){
    let pedidos ;
    pedidos = obtenerPedidosLocalStorage()
    pedidos.push(pedido)

    localStorage.setItem('pedidos', JSON.stringify(pedidos))
}

function obtenerPedidosLocalStorage(){
    let pedidosLS;

    if(localStorage.getItem('pedidos') === null){
        pedidosLS = []
    } else{
        pedidosLS = JSON.parse(localStorage.getItem('pedidos'))
    }
    return pedidosLS
}

function leerLocalStorage(){
    let pedidosLS

    pedidosLS = obtenerPedidosLocalStorage()

    pedidosLS.forEach(function(pedido){
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${pedido.imagen}" width=100>
            </td>
            <td>${pedido.titulo}</td>
            <td>${pedido.precio}</td>
            <td>
                <a hreft="#" class="borrar-pedido" data-id="${pedido.id}">X</a>
            </td>
        
        `
        listaPedidos.appendChild(row)
    })
}

function eliminarPedidoLocalStorage(pedido){
    let pedidosLS

    pedidosLS = obtenerPedidosLocalStorage()

    pedidosLS.forEach(function(pedidoLS, index){
        if(pedidoLS.id === pedido){
            pedidosLS.splice(index, 1)
        }
    })

    localStorage.setItem('pedidos', JSON.stringify(pedidosLS))
}

function vaciarLocalStorage(){
    localStorage.clear()
}

pedidos.addEventListener('click', () => {

    Toastify({
        text: "Añadido al Carrito",
        duration: 3000
        

    }).showToast();
})


