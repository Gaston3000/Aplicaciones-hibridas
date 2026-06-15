import { useState } from "react";
import Input from "../components/Input";

const API_URL = "http://localhost:3000";

function Register() {
  // estado del formulario: un objeto con los tres campos
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  // estado para los errores de validacion
  const [errores, setErrores] = useState({});
  // estado para el mensaje final (exito o error del servidor)
  const [mensaje, setMensaje] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // valida los campos y devuelve un objeto con los errores encontrados
  const validar = () => {
    const nuevos = {};
    if (!form.nombre.trim()) nuevos.nombre = "El nombre es obligatorio";
    if (!form.email.includes("@")) nuevos.email = "Ingresá un email válido";
    if (form.password.length < 6) nuevos.password = "Mínimo 6 caracteres";
    return nuevos;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);

    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    try {
      const res = await fetch(`${API_URL}/api/usuarios/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setMensaje({ tipo: "error", texto: data.error || "No se pudo registrar" });
        return;
      }

      setMensaje({ tipo: "ok", texto: `Cuenta creada para ${data.nombre} 🎉` });
      setForm({ nombre: "", email: "", password: "" });
    } catch {
      setMensaje({ tipo: "error", texto: "No se pudo conectar con el servidor" });
    }
  };

  return (
    <section className="formulario">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          error={errores.nombre}
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          error={errores.email}
        />
        <Input
          label="Contraseña"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          error={errores.password}
        />
        <button type="submit">Crear cuenta</button>
      </form>

      {mensaje && (
        <p className={mensaje.tipo === "ok" ? "aviso ok" : "aviso error"}>
          {mensaje.texto}
        </p>
      )}
    </section>
  );
}

export default Register;
