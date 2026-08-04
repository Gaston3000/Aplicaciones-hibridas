import { useCallback } from "react";
import { Link } from "react-router-dom";
import { getEstadios } from "../services/estadioService";
import { getCategorias } from "../services/categoriaService";
import { useCargarDatos } from "../hooks/useCargarDatos";
import TarjetaEstadio from "../components/TarjetaEstadio";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

// La home. Las sedes y las categorías salen de la API, no hay nada hardcodeado.
function Home() {
  // Las dos consultas van juntas con Promise.all, si no una espera a la otra al pedo.
  const consulta = useCallback(async () => {
    const [estadios, categorias] = await Promise.all([getEstadios(), getCategorias()]);
    return { estadios, categorias };
  }, []);

  const { datos, cargando, error, recargar } = useCargarDatos(consulta);

  const estadios = datos?.estadios ?? [];
  const categorias = datos?.categorias ?? [];

  // El contador sale del largo real de la lista. El padStart es para que
  // quede "04" en vez de "4", como estaba en el diseño original.
  const cantidad = String(estadios.length).padStart(2, "0");

  return (
    <>
      <section className="hero">
        <span className="hero-kicker">FIFA World Cup 26 · Sedes oficiales · USA</span>
        <h1 className="hero-title">
          Conocé los estadios más
          <br />
          <em>icónicos</em> del Mundial 2026
        </h1>
        <p className="hero-sub">
          Una colección exclusiva de sedes legendarias. Explorá cada estadio, mirá
          su ficha completa y descubrí dónde se juega el próximo Mundial.
        </p>
        <div className="hero-cta">
          <Link to="/estadios" className="btn-primary">Explorar sedes</Link>
          <span className="hero-count">
            {cargando ? "Cargando sedes..." : `${cantidad} sedes disponibles`}
          </span>
        </div>
        <div className="hero-glow" aria-hidden="true"></div>
      </section>

      {!cargando && !error && categorias.length > 0 && (
        <section className="categorias-tira">
          <h2 className="tira-titulo">Categorías de sede</h2>
          <div className="tira-lista">
            {categorias.map((categoria) => (
              <Link
                key={categoria._id}
                to={`/estadios?categoria=${categoria._id}`}
                className="tira-chip"
              >
                {categoria.nombre}
                <span className="tira-chip-num">
                  {estadios.filter((e) => e.categoria?._id === categoria._id).length}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="catalogo" id="sedes">
        <div className="catalogo-head">
          <h2>Sedes disponibles</h2>
          <p>Estados Unidos · Mundial 2026</p>
        </div>

        {cargando && <Loading texto="Cargando sedes..." />}

        {!cargando && error && <ErrorMessage mensaje={error} onReintentar={recargar} />}

        {!cargando && !error && estadios.length === 0 && (
          <EmptyState
            titulo="Todavía no hay sedes cargadas"
            texto="Cuando un administrador cargue las sedes desde el panel, van a aparecer acá."
          />
        )}

        {!cargando && !error && estadios.length > 0 && (
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
