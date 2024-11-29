Carrito interactivo con drag-and-drop, descuentos dinámicos y generación de QR. 
Ariana Kneeteman. 
Develop full stack.

Esta idea surge de buscar innovar un carrito de compras para las tiendas.

Se utiliza lenguaje JavaScript, HTML y CSS para los estilos.
Aplicando eventos como Drag and Drop para generar una interacción con el cliente permitiendo que arraste el producto que desea al carrito.
La logica esta basada en el localStorage, que me permite que el carrito siga estando como lo arma el cliente apesar de las recargas en la página. 
También generé algunas logicas para la aplicación de descuentos como descuento por cantidad de productos y descuento por cupón. 
La generación del QR, se hace con la libreria QRCode.js, en la logica para generar el qr se hace un resumen del pedido en cuanto a la cantidad de productos, subtotal, si se aplica o no descuento y el total, luego se visualiza el QR. Esto permite al cliente que asista o no al local, si el cliente no asiste al local puede ser pedido por el local para un control o el cliente pasarle una imagen del QR a una persona y que la misma vaya a buscar el pedido.


