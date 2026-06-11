import { useState } from "react";
import Input from "../components/Input";
import { registrarUsuario } from "../services/api";

function Register() {
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

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

    const data = await registrarUsuario(form);
    if (data.error) {
      setMensaje({ tipo: "error", texto: data.error });
      return;
    }
    setMensaje({ tipo: "ok", texto: `Cuenta creada para ${data.nombre} 🎉` });
    setForm({ nombre: "", email: "", password: "" });
  };

  return (
    <section className="formulario">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit} noValidate>
        <Input label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} error={errores.nombre} />
        <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} error={errores.email} />
        <Input label="Contraseña" type="password" name="password" value={form.password} onChange={handleChange} error={errores.password} />
        <button type="submit">Crear cuenta</button>
      </form>

      {mensaje && (
        <p className={mensaje.tipo === "ok" ? "aviso ok" : "aviso error"}>{mensaje.texto}</p>
      )}
    </section>
  );
}

export default Register;
