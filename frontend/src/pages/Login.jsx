import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Input from "../components/Input";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const { iniciarSesion, estaAutenticado, mensajeSesion, limpiarMensajeSesion } = useAuth();
  const navigate = useNavigate();
  const ubicacion = useLocation();

  // Si PrivateRoute nos mandó acá, volvemos a la página que se quería abrir.
  const destino = ubicacion.state?.desde || "/";

  // Si ya está logueado, no tiene sentido quedarse en el login.
  useEffect(() => {
    if (estaAutenticado) navigate(destino, { replace: true });
  }, [estaAutenticado, destino, navigate]);

  // El aviso puede venir del formulario o de una sesión que expiró.
  const avisoVisible =
    mensaje || (mensajeSesion ? { tipo: "error", texto: mensajeSesion } : null);

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
    limpiarMensajeSesion();

    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    setEnviando(true);
    try {
      // El contexto guarda el token y el usuario, y actualiza toda la app.
      const usuario = await iniciarSesion(form.email, form.password);
      // Al admin lo mandamos directo al panel; al resto, a donde quería ir.
      navigate(usuario.rol === "admin" ? "/admin" : destino, { replace: true });
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.message });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="formulario">
      <h2>Iniciar sesión</h2>

      <form onSubmit={handleSubmit} noValidate>
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
          autoComplete="current-password"
        />
        <button type="submit" disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {avisoVisible && (
        <p className={avisoVisible.tipo === "ok" ? "aviso ok" : "aviso error"}>
          {avisoVisible.texto}
        </p>
      )}

      <p className="formulario-pie">
        ¿Todavía no tenés cuenta? <Link to="/registro">Registrate</Link>
      </p>
    </section>
  );
}

export default Login;
