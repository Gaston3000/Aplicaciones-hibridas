import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { loginUsuario } from "../services/api";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validar = () => {
    const nuevos = {};
    if (!form.email.includes("@")) nuevos.email = "Ingresá un email válido";
    if (!form.password) nuevos.password = "La contraseña es obligatoria";
    return nuevos;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);

    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    const data = await loginUsuario(form);
    if (data.error) {
      setMensaje({ tipo: "error", texto: data.error });
      return;
    }

    // guardo el token para mantener la sesion y mando al inicio
    localStorage.setItem("token", data.token);
    setMensaje({ tipo: "ok", texto: `¡Hola de nuevo, ${data.usuario.nombre}!` });
    setTimeout(() => navigate("/"), 1200);
  };

  return (
    <section className="formulario">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit} noValidate>
        <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} error={errores.email} />
        <Input label="Contraseña" type="password" name="password" value={form.password} onChange={handleChange} error={errores.password} />
        <button type="submit">Entrar</button>
      </form>

      {mensaje && (
        <p className={mensaje.tipo === "ok" ? "aviso ok" : "aviso error"}>{mensaje.texto}</p>
      )}
    </section>
  );
}

export default Login;
