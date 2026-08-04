import { useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getEstadio, crearEstadio, actualizarEstadio } from "../../services/estadioService";
import { getCategorias } from "../../services/categoriaService";
import { useCargarDatos } from "../../hooks/useCargarDatos";
import FormularioEstadio from "../../components/admin/FormularioEstadio";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";

// Con esto arranca el formulario cuando es una sede nueva.
const VACIO = {
  nombre: "",
  ciudad: "",
  estado: "",
  descripcion: "",
  precio: "",
  capacidad: "",
  imagen: "",
  categoria: "",
  activo: true,
};

// Pasa el estadio como viene de la API al formato que espera el formulario.
const aFormulario = (estadio) => ({
  nombre: estadio.nombre || "",
  ciudad: estadio.ciudad || "",
  estado: estadio.estado || "",
  descripcion: estadio.descripcion || "",
  precio: estadio.precio ?? "",
  capacidad: estadio.capacidad ?? "",
  imagen: estadio.imagen || "",
  // La categoría viene populada, pero el <select> necesita solo el id.
  categoria: estadio.categoria?._id || "",
  activo: estadio.activo ?? true,
});

// La misma pantalla sirve para crear y para editar: si la URL trae :id, es edición.
function AdminEstadioForm() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navigate = useNavigate();

  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(null);

  const consulta = useCallback(async () => {
    const categorias = await getCategorias();
    const estadio = esEdicion ? await getEstadio(id) : null;
    return { categorias, estadio };
  }, [id, esEdicion]);

  const { datos, cargando, error, recargar } = useCargarDatos(consulta);

  const guardar = async (valores) => {
    setGuardando(true);
    setErrorGuardar(null);
    try {
      if (esEdicion) {
        await actualizarEstadio(id, valores);
      } else {
        await crearEstadio(valores);
      }
      navigate("/admin/estadios");
    } catch (err) {
      setErrorGuardar(err.message);
      setGuardando(false);
    }
  };

  if (cargando) return <Loading texto="Cargando el formulario..." />;
  if (error) return <ErrorMessage mensaje={error} onReintentar={recargar} />;

  const categorias = datos?.categorias ?? [];
  const valoresIniciales = datos?.estadio ? aFormulario(datos.estadio) : VACIO;

  // Sin categorías no puedo cargar una sede, porque la categoría es obligatoria.
  // Mejor avisarlo acá que dejar que se coma un error del backend.
  if (categorias.length === 0) {
    return (
      <>
        <div className="admin-titulo">
          <h1>{esEdicion ? "Editar sede" : "Nueva sede"}</h1>
        </div>
        <EmptyState
          titulo="Primero hay que crear una categoría"
          texto="Cada estadio tiene que pertenecer a una categoría, y todavía no hay ninguna cargada."
        >
          <Link to="/admin/categorias/nueva" className="btn-primary">Crear una categoría</Link>
        </EmptyState>
      </>
    );
  }

  return (
    <>
      <div className="admin-titulo">
        <div>
          <h1>{esEdicion ? "Editar sede" : "Nueva sede"}</h1>
          <p>Completá los datos del estadio.</p>
        </div>
      </div>

      {errorGuardar && <p className="aviso error">{errorGuardar}</p>}

      <div className="admin-panel">
        <FormularioEstadio
          valoresIniciales={valoresIniciales}
          categorias={categorias}
          onGuardar={guardar}
          onCancelar={() => navigate("/admin/estadios")}
          guardando={guardando}
        />
      </div>
    </>
  );
}

export default AdminEstadioForm;
