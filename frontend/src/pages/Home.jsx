import { useState, useEffect } from "react";
import { getProductos } from "../services/api";
import TarjetaEstadio from "../components/TarjetaEstadio";

function Home() {
  const [estadios, setEstadios] = useState([]);
  const [cargando, setCargando] = useState(true);

  // al montar el componente traigo las sedes del backend
  useEffect(() => {
    getProductos()
      .then((data) => setEstadios(data))
      .catch(() => setEstadios([]))
      .finally(() => setCargando(false));
  }, []);

  return (
    <>
      <section className="hero">
        <span className="hero-kicker">FIFA World Cup 26 · Sedes oficiales · USA</span>
        <h1 className="hero-title">
          Reservá los estadios más
          <br />
          <em>icónicos</em> del Mundial 2026
        </h1>
        <p className="hero-sub">
          Una colección exclusiva de sedes legendarias. Exploralas, viví el detalle
          y sumalas a tu experiencia mundialista.
        </p>
        <div className="hero-cta">
          <a href="#sedes" className="btn-primary">Explorar sedes</a>
          <span className="hero-count">04 sedes disponibles</span>
        </div>
        <div className="hero-glow" aria-hidden="true"></div>
      </section>

      <section className="catalogo" id="sedes">
        <div className="catalogo-head">
          <h2>Sedes disponibles</h2>
          <p>Estados Unidos · Mundial 2026</p>
        </div>

        {cargando ? (
          <p className="cargando">Cargando sedes...</p>
        ) : estadios.length === 0 ? (
          <p className="cargando">No hay sedes para mostrar. ¿Está prendido el backend?</p>
        ) : (
          <div className="grid">
            {estadios.map((estadio, i) => (
              <TarjetaEstadio key={estadio._id} estadio={estadio} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Home;
