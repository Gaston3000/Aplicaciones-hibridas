import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProducto } from "../services/api";

function Detail() {
  // tomo el id de la URL (/producto/:id)
  const { id } = useParams();
  const [estadio, setEstadio] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [sinFoto, setSinFoto] = useState(false);
  const [agregado, setAgregado] = useState(false);

  useEffect(() => {
    getProducto(id)
      .then((data) => setEstadio(data))
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) return <p className="cargando">Cargando...</p>;
  if (!estadio || estadio.error) {
    return (
      <section className="detalle-vacio">
        <p>No se encontró la sede.</p>
        <Link to="/" className="btn-ghost">← Volver al inicio</Link>
      </section>
    );
  }

  const agregar = () => {
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1600);
  };

  return (
    <section className="detalle">
      <Link to="/" className="detalle-back">← Volver a las sedes</Link>

      <div className="detalle-grid">
        <div className="detalle-media">
          {!sinFoto && (
            <img src={estadio.imagen} alt={estadio.nombre} onError={() => setSinFoto(true)} />
          )}
          {sinFoto && <span className="detalle-media-fallback">{estadio.nombre}</span>}
          <span className="card-badge">{estadio.categoria}</span>
        </div>

        <div className="detalle-info">
          <span className="detalle-city">{estadio.marca}</span>
          <h2 className="detalle-title">{estadio.nombre}</h2>
          <p className="detalle-desc">{estadio.descripcion}</p>

          <div className="detalle-price-row">
            <div>
              <span className="detalle-price-label">Precio de la sede</span>
              <span className="detalle-price">${estadio.precio.toLocaleString("es-AR")}</span>
            </div>
            <button className={`btn-primary ${agregado ? "ok" : ""}`} onClick={agregar}>
              {agregado ? "Agregado ✓" : "Agregar al carrito"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Detail;
