import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getEstadios, eliminarEstadio } from "../../services/estadioService";
import { useCargarDatos } from "../../hooks/useCargarDatos";
import { formatearPrecio, formatearNumero } from "../../utils/formato";
import AdminTable from "../../components/admin/AdminTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";

// Listado de estadios del BackOffice con las acciones de editar y eliminar.
function AdminEstadios() {
  const [aviso, setAviso] = useState(null);
  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const navigate = useNavigate();

  const consulta = useCallback(() => getEstadios(), []);
  const { datos, cargando, error, recargar } = useCargarDatos(consulta);
  const estadios = datos ?? [];

  const confirmarEliminar = async () => {
    setEliminando(true);
    setAviso(null);
    try {
      await eliminarEstadio(aEliminar._id);
      setAviso({ tipo: "ok", texto: `Se eliminó "${aEliminar.nombre}"` });
      recargar();
    } catch (err) {
      setAviso({ tipo: "error", texto: err.message });
    } finally {
      setAEliminar(null);
      setEliminando(false);
    }
  };

  const columnas = [
    { clave: "nombre", titulo: "Nombre" },
    {
      clave: "ciudad",
      titulo: "Ciudad",
      render: (fila) => `${fila.ciudad}${fila.estado ? `, ${fila.estado}` : ""}`,
    },
    {
      clave: "categoria",
      titulo: "Categoría",
      render: (fila) => fila.categoria?.nombre || "—",
    },
    { clave: "precio", titulo: "Precio", render: (fila) => formatearPrecio(fila.precio) },
    { clave: "capacidad", titulo: "Capacidad", render: (fila) => formatearNumero(fila.capacidad) },
    {
      clave: "activo",
      titulo: "Estado",
      render: (fila) => (
        <span className={`etiqueta-estado ${fila.activo ? "si" : "no"}`}>
          {fila.activo ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="admin-titulo">
        <div>
          <h1>Estadios</h1>
          <p>{estadios.length} sede(s) cargada(s)</p>
        </div>
        <Link to="/admin/estadios/nuevo" className="btn-primary">+ Nueva sede</Link>
      </div>

      {aviso && <p className={`aviso ${aviso.tipo}`}>{aviso.texto}</p>}

      {cargando && <Loading texto="Cargando estadios..." />}
      {!cargando && error && <ErrorMessage mensaje={error} onReintentar={recargar} />}

      {!cargando && !error && estadios.length === 0 && (
        <EmptyState titulo="No hay estadios cargados" texto="Empezá creando la primera sede.">
          <Link to="/admin/estadios/nuevo" className="btn-primary">Crear una sede</Link>
        </EmptyState>
      )}

      {!cargando && !error && estadios.length > 0 && (
        <AdminTable
          columnas={columnas}
          datos={estadios}
          acciones={(fila) => (
            <>
              <button
                type="button"
                className="btn-tabla"
                onClick={() => navigate(`/admin/estadios/${fila._id}/editar`)}
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
        titulo="Eliminar estadio"
        mensaje={`¿Seguro que querés eliminar "${aEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setAEliminar(null)}
        procesando={eliminando}
      />
    </>
  );
}

export default AdminEstadios;
