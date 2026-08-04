import { useState } from "react";
import Input from "../Input";

// El formulario para cargar y editar usuarios.
// Cuando edito, la contraseña es opcional: si la dejo vacía queda la que estaba.
// La contraseña actual no se muestra nunca, el backend directamente no la manda.
function FormularioUsuario({ valoresIniciales, esEdicion, onGuardar, onCancelar, guardando }) {
  const [form, setForm] = useState(valoresIniciales);
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validar = () => {
    const nuevos = {};
    if (!form.nombre.trim()) nuevos.nombre = "El nombre es obligatorio";
    if (!form.email.trim().includes("@")) nuevos.email = "Ingresá un email válido";

    // En el alta la contraseña va sí o sí; editando, solo si escribieron algo.
    if (!esEdicion && form.password.length < 6) {
      nuevos.password = "Mínimo 6 caracteres";
    } else if (esEdicion && form.password && form.password.length < 6) {
      nuevos.password = "Mínimo 6 caracteres";
    }

    if (!["usuario", "admin"].includes(form.rol)) nuevos.rol = "Elegí un rol válido";
    return nuevos;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    const datos = {
      nombre: form.nombre.trim(),
      email: form.email.trim().toLowerCase(),
      rol: form.rol,
    };
    // La password la mando solo si pusieron una nueva.
    if (form.password) datos.password = form.password;

    onGuardar(datos);
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      <div className="admin-form-grid">
        <Input label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} error={errores.nombre} />
        <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} error={errores.email} />
        <Input
          label="Rol"
          type="select"
          name="rol"
          value={form.rol}
          onChange={handleChange}
          error={errores.rol}
          opciones={[
            { valor: "usuario", texto: "Usuario" },
            { valor: "admin", texto: "Administrador" },
          ]}
        />
        <Input
          label={esEdicion ? "Nueva contraseña (opcional)" : "Contraseña"}
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          error={errores.password}
          autoComplete="new-password"
          ayuda={esEdicion ? "Dejala vacía para no cambiarla" : "Mínimo 6 caracteres"}
        />
      </div>

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

export default FormularioUsuario;
