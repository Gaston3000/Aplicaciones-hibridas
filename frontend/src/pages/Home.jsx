import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProductos } from "../services/api";

function Home() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // al montar el componente traigo los productos del backend
  useEffect(() => {
    getProductos()
      .then((data) => setProductos(data))
      .catch(() => setProductos([]))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <p className="cargando">Cargando productos...</p>;

  return (
    <section className="catalogo">
      <h2>Catálogo de productos</h2>
      {productos.length === 0 ? (
        <p>No hay productos para mostrar. ¿Está prendido el backend?</p>
      ) : (
        <div className="grid">
          {productos.map((p) => (
            <Link key={p._id} to={`/producto/${p._id}`} className="tarjeta">
              <h3>{p.nombre}</h3>
              <p>{p.marca} · ${p.precio}</p>
              <span className="ver">Ver detalle →</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default Home;
