import { useState } from "react";
import Input from "../Input";

// El formulario para cargar y editar categorías.
function FormularioCategoria({ valoresIniciales, onGuardar, onCancelar, guardando }) {
  const [form, setForm] = useState(valoresIniciales);
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const validar = () => {
    const nuevos = {};
    if (!form.nombre.trim()) nuevos.nombre = "El nombre es obligatorio";
    else if (form.nombre.trim().length < 2) nuevos.nombre = "Mínimo 2 caracteres";
    if (form.descripcion.length > 300) nuevos.descripcion = "Máximo 300 caracteres";
    return nuevos;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    onGuardar({
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      activo: form.activo,
    });
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      <Input label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} error={errores.nombre} />

      <Input
        label="Descripción"
        type="textarea"
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        error={errores.descripcion}
        ayuda={`${form.descripcion.length}/300 caracteres`}
      />

      <Input label="Categoría activa" type="checkbox" name="activo" value={form.activo} onChange={handleChange} />

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

export default FormularioCategoria;
