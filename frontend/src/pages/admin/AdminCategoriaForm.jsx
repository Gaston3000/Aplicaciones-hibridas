import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCategoria, crearCategoria, actualizarCategoria } from "../../services/categoriaService";
import { useCargarDatos } from "../../hooks/useCargarDatos";
import FormularioCategoria from "../../components/admin/FormularioCategoria";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

const VACIO = { nombre: "", descripcion: "", activo: true };

// Misma página para crear y para editar categorías.
function AdminCategoriaForm() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navigate = useNavigate();

  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(null);

  // Si es un alta no hay nada que traer de la API.
  const consulta = useCallback(
    async () => (esEdicion ? getCategoria(id) : null),
    [id, esEdicion]
  );

  const { datos, cargando, error, recargar } = useCargarDatos(consulta);

  const guardar = async (valores) => {
    setGuardando(true);
    setErrorGuardar(null);
    try {
      if (esEdicion) {
        await actualizarCategoria(id, valores);
      } else {
        await crearCategoria(valores);
      }
      navigate("/admin/categorias");
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
        descripcion: datos.descripcion || "",
        activo: datos.activo ?? true,
      }
    : VACIO;

  return (
    <>
      <div className="admin-titulo">
        <div>
          <h1>{esEdicion ? "Editar categoría" : "Nueva categoría"}</h1>
          <p>Las categorías agrupan a los estadios del sitio.</p>
        </div>
      </div>

      {errorGuardar && <p className="aviso error">{errorGuardar}</p>}

      <div className="admin-panel">
        <FormularioCategoria
          valoresIniciales={valoresIniciales}
          onGuardar={guardar}
          onCancelar={() => navigate("/admin/categorias")}
          guardando={guardando}
        />
      </div>
    </>
  );
}

export default AdminCategoriaForm;
