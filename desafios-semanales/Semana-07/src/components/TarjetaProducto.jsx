function TarjetaProducto({ producto }) {
  return (
    <div className="tarjeta">
      <div className="info">
        <h3>{producto.nombre}</h3>
        <p>{producto.marca} · {producto.tipo} · {producto.presentacion}</p>
      </div>
      <button>[ Comprar ]</button>
    </div>
  );
}

export default TarjetaProducto;
