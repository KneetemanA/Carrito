document.addEventListener('DOMContentLoaded', async () => {
    const productsContainer = document.getElementById('products-container');
    const cart = document.getElementById('cart');
    const cartItems = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const discountEl = document.getElementById('discount');
    const totalEl = document.getElementById('total');
    const applyCouponBtn = document.getElementById('apply-coupon');
    const couponInput = document.getElementById('coupon-code');
    const generateQRBtn = document.getElementById('generate-qr');
    const qrCodeContainer = document.getElementById('qrcode');
    const clearCart = document.getElementById('clear-cart')
    const addToCartBtn = document.querySelectorAll('.addBtn')

    let cartData = {};
    let discount = 0;

    // Cargar productos desde JSON
    let productsData = [];
    try {
        const response = await fetch('data/productos.json'); // Ruta al archivo JSON
        productsData = await response.json();
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        return;
    }

    // Generar productos en la interfaz
    productsData.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.setAttribute('draggable', 'true');
        productElement.dataset.id = product.id;
        productElement.dataset.name = product.name;
        productElement.dataset.price = product.price;
        productElement.dataset.image = product.image;

        productElement.innerHTML = `
            <div class= "productosJson">
            <img src="${product.image}" alt="${product.name}" />
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button class="addBtn" data-id="${product.id}">Agregar al carrito</button>
            </div>
        `;

        productsContainer.appendChild(productElement);

        //Evento eliminar del carrito

        clearCart.addEventListener('click', () =>{
            cartData = {};
            saveCart();
            renderCart();
            qrCodeContainer.innerHTML = '';
        })


        // Agregar evento dragstart
        productElement.addEventListener('dragstart', dragStart);

        // btn agregar al carrito
        const addCartBtn = productElement.querySelector('.addBtn');
        addCartBtn.addEventListener('click', ()=>{
            addToCart(product)
        })
    });

    // Cargar carrito desde localStorage
    if (localStorage.getItem('cart')) {
        cartData = JSON.parse(localStorage.getItem('cart'));
        renderCart();
    }

    // Drag and Drop
    cart.addEventListener('dragover', dragOver);
    cart.addEventListener('drop', drop);

    function dragStart(e) {
        const id = e.target.closest('.product')?.dataset.id;
        if (!id) {
            console.error('El elemento arrastrado no tiene un atributo data-id');
            return;
        }
        e.dataTransfer.setData('text/plain', id);
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e) {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const product = productsData.find(p => p.id === id);
    
        if (!product) {
            console.error(`No se encontró el producto con id: ${id}`);
            alert('No se pudo añadir el producto al carrito. Intenta nuevamente.');
            return;
        }
    
        addToCart(product);
    }
    

    // Añadir productos al carrito
    function addToCart(product) {
        const { id, name, price, image } = product;

        if (cartData[id]) {
            cartData[id].quantity += 1;
        } else {
            cartData[id] = { name, price: parseFloat(price), quantity: 1, image };
        }

        saveCart();
        renderCart();
    }

    // Guardar carrito en localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cartData));
    }

    // Renderizar carrito
    function renderCart() {
        cartItems.innerHTML = '';
        let subtotal = 0;

        for (let id in cartData) {
            const item = cartData[id];
            subtotal += item.price * item.quantity;

            const li = document.createElement('li');
            li.innerHTML = `
                <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <p>${item.name} x ${item.quantity}</p>
                    <p>$${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="remove-btn" data-id="${id}">Eliminar</button>
                </div>
            </div>
            `;
            cartItems.appendChild(li);

            li.querySelector('.remove-btn').addEventListener('click', () =>{
                removeFromCart(id)
            })
        }

        subtotalEl.textContent = subtotal.toFixed(2);
        applyDiscount(subtotal);
    }

    function removeFromCart(id){
        delete cartData[id];
        saveCart();
        renderCart();
    }

    // Aplicar descuento
    function applyDiscount(subtotal) {
        discount = 0;

        for (let id in cartData) {
            if (id && cartData[id].quantity >= 3) {
                discount += cartData[id].price * cartData[id].quantity * 0.05;
            }
        }

        const coupon = couponInput.value.trim().toUpperCase();
        if (coupon === 'DESCUENTOS') {
            discount += 5;
        } else if (coupon !== '') {
            alert('Cupón inválido');
        }

        discountEl.textContent = discount.toFixed(2);
        const total = subtotal - discount;
        totalEl.textContent = total.toFixed(2);
    }

    // Aplicar cupón
    applyCouponBtn.addEventListener('click', () => {
        renderCart();
    });

    // Generar código QR
    generateQRBtn.addEventListener('click', () => {
        qrCodeContainer.innerHTML = ''; 
        const summary = generateSummary(); 
        if (summary) {
            try {
                new QRCode(qrCodeContainer, {
                    text: summary,
                    width: 256,    
                    height: 256,   
                    correctLevel: QRCode.CorrectLevel ? QRCode.CorrectLevel.M : 1
                });
            } catch (error) {
                console.error("Error generando el código QR:", error);
                alert('Ocurrió un error generando el código QR.');
            }
        } else {
            alert('El carrito está vacío');
        }
    });
    
    function generateSummary() {
        if (Object.keys(cartData).length === 0) return null;
    
        let summary = 'Pedido: ';
        let items = [];
    
        for (let id in cartData) {
            const item = cartData[id];
            items.push(`${item.name} x${item.quantity}`);
        }
    
        summary += items.join(', ');
        summary += ` | Subtotal: $${subtotalEl.textContent} | Descuento: -$${discountEl.textContent} | Total: $${totalEl.textContent}`;
    
        return summary;
    }
    

    new QRCode(qrCodeContainer, {
        text: generateSummary,
        width: 256,
        height: 256,
        correctLevel: QRCode.CorrectLevel.L
    })

    
});
