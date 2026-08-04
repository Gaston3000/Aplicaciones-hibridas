import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUsuarios, eliminarUsuario } from "../../services/usuarioService";
import { useCargarDatos } from "../../hooks/useCargarDatos";
import { formatearFecha } from "../../utils/formato";
import { useAuth } from "../../hooks/useAuth";
import AdminTable from "../../components/admin/AdminTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";

// Listado de usuarios. La contraseña nunca se muestra: la API no la devuelve.
function AdminUsuarios() {
  const { usuario: usuarioActual } = useAuth();
  const [aviso, setAviso] = useState(null);
  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const navigate = useNavigate();

  const consulta = useCallback(() => getUsuarios(), []);
  const { datos, cargando, error, recargar } = useCargarDatos(consulta);
  const usuarios = datos ?? [];

  const confirmarEliminar = async () => {
    setEliminando(true);
    setAviso(null);
    try {
      await eliminarUsuario(aEliminar._id);
      setAviso({ tipo: "ok", texto: `Se eliminó a ${aEliminar.nombre}` });
      recargar();
    } catch (err) {
      // El backend responde 409 si es el último admin o si es la propia cuenta.
      setAviso({ tipo: "error", texto: err.message });
    } finally {
      setAEliminar(null);
      setEliminando(false);
    }
  };

  const columnas = [
    { clave: "nombre", titulo: "Nombre" },
    { clave: "email", titulo: "Email" },
    {
      clave: "rol",
      titulo: "Rol",
      render: (fila) => (
        <span className={`etiqueta-rol ${fila.rol === "admin" ? "admin" : ""}`}>{fila.rol}</span>
      ),
    },
    { clave: "createdAt", titulo: "Registrado", render: (fila) => formatearFecha(fila.createdAt) },
  ];

  return (
    <>
      <div className="admin-titulo">
        <div>
          <h1>Usuarios</h1>
          <p>{usuarios.length} cuenta(s) registrada(s)</p>
        </div>
        <Link to="/admin/usuarios/nuevo" className="btn-primary">+ Nuevo usuario</Link>
      </div>

      {aviso && <p className={`aviso ${aviso.tipo}`}>{aviso.texto}</p>}

      {cargando && <Loading texto="Cargando usuarios..." />}
      {!cargando && error && <ErrorMessage mensaje={error} onReintentar={recargar} />}

      {!cargando && !error && usuarios.length === 0 && (
        <EmptyState titulo="No hay usuarios registrados" />
      )}

      {!cargando && !error && usuarios.length > 0 && (
        <AdminTable
          columnas={columnas}
          datos={usuarios}
          acciones={(fila) => (
            <>
              <button
                type="button"
                className="btn-tabla"
                onClick={() => navigate(`/admin/usuarios/${fila._id}/editar`)}
              >
                Editar
              </button>
              <button
                type="button"
                className="btn-tabla peligro"
                onClick={() => setAEliminar(fila)}
                // No se puede borrar la cuenta con la que se está trabajando.
                disabled={fila._id === usuarioActual?._id}
                title={
                  fila._id === usuarioActual?._id
                    ? "No podés eliminar tu propia cuenta"
                    : "Eliminar usuario"
                }
              >
                Eliminar
              </button>
            </>
          )}
        />
      )}

      <ConfirmDialog
        abierto={Boolean(aEliminar)}
        titulo="Eliminar usuario"
        mensaje={`¿Seguro que querés eliminar la cuenta de ${aEliminar?.nombre} (${aEliminar?.email})?`}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setAEliminar(null)}
        procesando={eliminando}
      />
    </>
  );
}

export default AdminUsuarios;
