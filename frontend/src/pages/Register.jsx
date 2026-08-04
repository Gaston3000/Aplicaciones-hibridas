import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/Input";
import { useAuth } from "../hooks/useAuth";

function Register() {
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const { registrarse, iniciarSesion } = useAuth();
  const navigate = useNavigate();

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
    e.preventDefault(); // que no se recargue la página al enviar
    setMensaje(null);

    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    setEnviando(true);
    try {
      await registrarse(form);
      // Después de crear la cuenta iniciamos sesión automáticamente.
      await iniciarSesion(form.email, form.password);
      navigate("/", { replace: true });
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.message });
    } finally {
      setEnviando(false);
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
          autoComplete="name"
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          error={errores.email}
          autoComplete="email"
        />
        <Input
          label="Contraseña"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          error={errores.password}
          ayuda="Al menos 6 caracteres"
          autoComplete="new-password"
        />
        <button type="submit" disabled={enviando}>
          {enviando ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      {mensaje && (
        <p className={mensaje.tipo === "ok" ? "aviso ok" : "aviso error"}>{mensaje.texto}</p>
      )}

      <p className="formulario-pie">
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </section>
  );
}

export default Register;
