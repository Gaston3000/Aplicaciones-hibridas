import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUsuario, crearUsuario, actualizarUsuario } from "../../services/usuarioService";
import { useCargarDatos } from "../../hooks/useCargarDatos";
import FormularioUsuario from "../../components/admin/FormularioUsuario";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

const VACIO = { nombre: "", email: "", password: "", rol: "usuario" };

// Misma página para crear y para editar usuarios.
function AdminUsuarioForm() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navigate = useNavigate();

  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(null);

  // Si es un alta no hay nada que traer de la API.
  const consulta = useCallback(
    async () => (esEdicion ? getUsuario(id) : null),
    [id, esEdicion]
  );

  const { datos, cargando, error, recargar } = useCargarDatos(consulta);

  const guardar = async (valores) => {
    setGuardando(true);
    setErrorGuardar(null);
    try {
      if (esEdicion) {
        await actualizarUsuario(id, valores);
      } else {
        await crearUsuario(valores);
      }
      navigate("/admin/usuarios");
    } catch (err) {
      setErrorGuardar(err.message);
      setGuardando(false);
    }
  };

  if (cargando) return <Loading texto="Cargando el formulario..." />;
  if (error) return <ErrorMessage mensaje={error} onReintentar={recargar} />;

  const valoresIniciales = datos
    ? {
        nombre: datos.nombre || "",
        email: datos.email || "",
        password: "", // la contraseña actual nunca se muestra
        rol: datos.rol || "usuario",
      }
    : VACIO;

  return (
    <>
      <div className="admin-titulo">
        <div>
          <h1>{esEdicion ? "Editar usuario" : "Nuevo usuario"}</h1>
          <p>La contraseña se guarda siempre encriptada con bcrypt.</p>
        </div>
      </div>

      {errorGuardar && <p className="aviso error">{errorGuardar}</p>}

      <div className="admin-panel">
        <FormularioUsuario
          valoresIniciales={valoresIniciales}
          esEdicion={esEdicion}
          onGuardar={guardar}
          onCancelar={() => navigate("/admin/usuarios")}
          guardando={guardando}
        />
      </div>
    </>
  );
}

export default AdminUsuarioForm;
