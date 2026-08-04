import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getEstadios } from "../services/estadioService";
import { getCategorias } from "../services/categoriaService";
import { useCargarDatos } from "../hooks/useCargarDatos";
import TarjetaEstadio from "../components/TarjetaEstadio";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

// Listado completo de sedes, con filtro por categoría.
// La categoría elegida queda en la URL (?categoria=...) para poder compartir el link.
function Estadios() {
  const [parametros, setParametros] = useSearchParams();
  const categoriaElegida = parametros.get("categoria") || "";

  const consulta = useCallback(async () => {
    const [estadios, categorias] = await Promise.all([getEstadios(), getCategorias()]);
    return { estadios, categorias };
  }, []);

  const { datos, cargando, error, recargar } = useCargarDatos(consulta);

  const estadios = datos?.estadios ?? [];
  const categorias = datos?.categorias ?? [];

  const cambiarFiltro = (idCategoria) => {
    setParametros(idCategoria ? { categoria: idCategoria } : {});
  };

  const visibles = categoriaElegida
    ? estadios.filter((estadio) => estadio.categoria?._id === categoriaElegida)
    : estadios;

  return (
    <section className="catalogo pagina-listado">
      <div className="catalogo-head">
        <h2>Todas las sedes</h2>
        <p>{cargando ? "Cargando..." : `${visibles.length} de ${estadios.length} sedes`}</p>
      </div>

      {!cargando && !error && categorias.length > 0 && (
        <div className="filtros">
          <button
            type="button"
            className={`filtro-chip ${!categoriaElegida ? "activo" : ""}`}
            onClick={() => cambiarFiltro("")}
          >
            Todas
          </button>
          {categorias.map((categoria) => (
            <button
              key={categoria._id}
              type="button"
              className={`filtro-chip ${categoriaElegida === categoria._id ? "activo" : ""}`}
              onClick={() => cambiarFiltro(categoria._id)}
            >
              {categoria.nombre}
            </button>
          ))}
        </div>
      )}

      {cargando && <Loading texto="Cargando sedes..." />}

      {!cargando && error && <ErrorMessage mensaje={error} onReintentar={recargar} />}

      {!cargando && !error && visibles.length === 0 && (
        <EmptyState
          titulo="No hay sedes para mostrar"
          texto={
            categoriaElegida
              ? "No hay sedes en esta categoría. Probá con otra."
              : "Todavía no se cargaron sedes en el sistema."
          }
        >
          {categoriaElegida && (
            <button type="button" className="btn-ghost" onClick={() => cambiarFiltro("")}>
              Ver todas las sedes
            </button>
          )}
        </EmptyState>
      )}

      {!cargando && !error && visibles.length > 0 && (
        <div className="grid">
          {visibles.map((estadio, i) => (
            <TarjetaEstadio key={estadio._id} estadio={estadio} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Estadios;
