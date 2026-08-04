import { useState } from "react";
import Input from "../Input";

// El formulario para cargar y editar sedes.
// Le paso los valores iniciales y me avisa por onGuardar cuando está listo.
function FormularioEstadio({ valoresIniciales, categorias, onGuardar, onCancelar, guardando }) {
  const [form, setForm] = useState(valoresIniciales);
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const validar = () => {
    const nuevos = {};
    if (!form.nombre.trim()) nuevos.nombre = "El nombre es obligatorio";
    else if (form.nombre.trim().length < 3) nuevos.nombre = "Mínimo 3 caracteres";

    if (!form.ciudad.trim()) nuevos.ciudad = "La ciudad es obligatoria";

    if (form.precio === "" || form.precio === null) nuevos.precio = "El precio es obligatorio";
    else if (Number.isNaN(Number(form.precio))) nuevos.precio = "El precio tiene que ser un número";
    else if (Number(form.precio) < 0) nuevos.precio = "El precio no puede ser negativo";

    if (form.capacidad !== "" && Number(form.capacidad) < 0) {
      nuevos.capacidad = "La capacidad no puede ser negativa";
    }

    if (!form.categoria) nuevos.categoria = "Elegí una categoría";

    if (form.descripcion.length > 600) nuevos.descripcion = "Máximo 600 caracteres";

    return nuevos;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    onGuardar({
      nombre: form.nombre.trim(),
      ciudad: form.ciudad.trim(),
      estado: form.estado.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      capacidad: form.capacidad === "" ? 0 : Number(form.capacidad),
      imagen: form.imagen.trim(),
      categoria: form.categoria,
      activo: form.activo,
    });
  };

  const opcionesCategoria = categorias.map((categoria) => ({
    valor: categoria._id,
    texto: categoria.nombre,
  }));

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      <div className="admin-form-grid">
        <Input label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} error={errores.nombre} />
        <Input label="Ciudad" name="ciudad" value={form.ciudad} onChange={handleChange} error={errores.ciudad} />
        <Input label="Estado / Provincia" name="estado" value={form.estado} onChange={handleChange} error={errores.estado} />
        <Input
          label="Categoría"
          type="select"
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          error={errores.categoria}
          opciones={opcionesCategoria}
        />
        <Input label="Precio" type="number" name="precio" value={form.precio} onChange={handleChange} error={errores.precio} min="0" />
        <Input label="Capacidad" type="number" name="capacidad" value={form.capacidad} onChange={handleChange} error={errores.capacidad} min="0" />
      </div>

      <Input
        label="Imagen (ruta o URL)"
        name="imagen"
        value={form.imagen}
        onChange={handleChange}
        error={errores.imagen}
        placeholder="/estadios/miami.jpg"
        ayuda="Puede ser una ruta de la carpeta public o una URL completa"
      />

      <Input
        label="Descripción"
        type="textarea"
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        error={errores.descripcion}
        ayuda={`${form.descripcion.length}/600 caracteres`}
      />

      <Input label="Sede activa (visible en el sitio público)" type="checkbox" name="activo" value={form.activo} onChange={handleChange} />

      <div className="admin-form-acciones">
        <button type="button" className="btn-ghost" onClick={onCancelar} disabled={guardando}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}

export default FormularioEstadio;
