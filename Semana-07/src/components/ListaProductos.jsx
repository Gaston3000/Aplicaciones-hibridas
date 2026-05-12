import productos from "../data/productos";
import TarjetaProducto from "./TarjetaProducto";

function ListaProductos() {
  return (
    <section className="catalogo">
      <h2>Catálogo de productos</h2>
      <div className="grid">
        {productos.map((producto) => (
          <TarjetaProducto key={producto.id} producto={producto} />
        ))}
      </div>
    </section>
  );
}

export default ListaProductos;
