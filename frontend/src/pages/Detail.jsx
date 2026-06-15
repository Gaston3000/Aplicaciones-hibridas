import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProducto } from "../services/api";

function Detail() {
  // tomo el id de la URL (/producto/:id)
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getProducto(id)
      .then((data) => setProducto(data))
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) return <p className="cargando">Cargando...</p>;
  if (!producto || producto.error) {
    return (
      <section className="detalle">
        <p>No se encontró el producto.</p>
        <Link to="/">← Volver al inicio</Link>
      </section>
    );
  }

  return (
    <section className="detalle">
      <h2>{producto.nombre}</h2>
      <p><strong>Marca:</strong> {producto.marca}</p>
      <p><strong>Precio:</strong> ${producto.precio}</p>
      <p><strong>Categoría:</strong> {producto.categoria}</p>
      <Link to="/">← Volver al inicio</Link>
    </section>
  );
}

export default Detail;
