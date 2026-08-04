import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCategorias, eliminarCategoria } from "../../services/categoriaService";
import { getEstadios } from "../../services/estadioService";
import { useCargarDatos } from "../../hooks/useCargarDatos";
import { formatearFecha } from "../../utils/formato";
import AdminTable from "../../components/admin/AdminTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";

// Listado de categorías. También muestra cuántos estadios usa cada una,
// porque una categoría con estadios asociados no se puede eliminar.
function AdminCategorias() {
  const [aviso, setAviso] = useState(null);
  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const navigate = useNavigate();

  const consulta = useCallback(async () => {
    const [categorias, estadios] = await Promise.all([getCategorias(), getEstadios()]);
    return { categorias, estadios };
  }, []);

  const { datos, cargando, error, recargar } = useCargarDatos(consulta);
  const categorias = datos?.categorias ?? [];
  const estadios = datos?.estadios ?? [];

  const contarEstadios = (idCategoria) =>
    estadios.filter((estadio) => estadio.categoria?._id === idCategoria).length;

  const confirmarEliminar = async () => {
    setEliminando(true);
    setAviso(null);
    try {
      await eliminarCategoria(aEliminar._id);
      setAviso({ tipo: "ok", texto: `Se eliminó la categoría "${aEliminar.nombre}"` });
      recargar();
    } catch (err) {
      // El backend devuelve 409 si la categoría tiene estadios asociados.
      setAviso({ tipo: "error", texto: err.message });
    } finally {
      setAEliminar(null);
      setEliminando(false);
    }
  };

  const columnas = [
    { clave: "nombre", titulo: "Nombre" },
    {
      clave: "descripcion",
      titulo: "Descripción",
      render: (fila) => fila.descripcion || "—",
    },
    {
      clave: "estadios",
      titulo: "Estadios",
      render: (fila) => contarEstadios(fila._id),
    },
    {
      clave: "activo",
      titulo: "Estado",
      render: (fila) => (
        <span className={`etiqueta-estado ${fila.activo ? "si" : "no"}`}>
          {fila.activo ? "Activa" : "Inactiva"}
        </span>
      ),
    },
    { clave: "createdAt", titulo: "Creada", render: (fila) => formatearFecha(fila.createdAt) },
  ];

  return (
    <>
      <div className="admin-titulo">
        <div>
          <h1>Categorías</h1>
          <p>{categorias.length} categoría(s) cargada(s)</p>
        </div>
        <Link to="/admin/categorias/nueva" className="btn-primary">+ Nueva categoría</Link>
      </div>

      {aviso && <p className={`aviso ${aviso.tipo}`}>{aviso.texto}</p>}

      {cargando && <Loading texto="Cargando categorías..." />}
      {!cargando && error && <ErrorMessage mensaje={error} onReintentar={recargar} />}

      {!cargando && !error && categorias.length === 0 && (
        <EmptyState
          titulo="No hay categorías cargadas"
          texto="Las categorías agrupan a los estadios. Creá la primera para poder cargar sedes."
        >
          <Link to="/admin/categorias/nueva" className="btn-primary">Crear una categoría</Link>
        </EmptyState>
      )}

      {!cargando && !error && categorias.length > 0 && (
        <AdminTable
          columnas={columnas}
          datos={categorias}
          acciones={(fila) => (
            <>
              <button
                type="button"
                className="btn-tabla"
                onClick={() => navigate(`/admin/categorias/${fila._id}/editar`)}
              >
                Editar
              </button>
              <button type="button" className="btn-tabla peligro" onClick={() => setAEliminar(fila)}>
                Eliminar
              </button>
            </>
          )}
        />
      )}

      <ConfirmDialog
        abierto={Boolean(aEliminar)}
        titulo="Eliminar categoría"
        mensaje={
          aEliminar && contarEstadios(aEliminar._id) > 0
            ? `"${aEliminar.nombre}" tiene ${contarEstadios(aEliminar._id)} estadio(s) asociado(s). El servidor no va a permitir eliminarla.`
            : `¿Seguro que querés eliminar la categoría "${aEliminar?.nombre}"?`
        }
        onConfirmar={confirmarEliminar}
        onCancelar={() => setAEliminar(null)}
        procesando={eliminando}
      />
    </>
  );
}

export default AdminCategorias;
