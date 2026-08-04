import { Routes, Route } from "react-router-dom";

// Layouts
import LayoutPublico from "./components/LayoutPublico";
import AdminLayout from "./components/admin/AdminLayout";

// Protección de rutas
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

// Páginas públicas (FrontOffice)
import Home from "./pages/Home";
import Estadios from "./pages/Estadios";
import Detail from "./pages/Detail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import AccesoDenegado from "./pages/AccesoDenegado";
import NotFound from "./pages/NotFound";

// Páginas de administración (BackOffice)
import Dashboard from "./pages/admin/Dashboard";
import AdminEstadios from "./pages/admin/AdminEstadios";
import AdminEstadioForm from "./pages/admin/AdminEstadioForm";
import AdminCategorias from "./pages/admin/AdminCategorias";
import AdminCategoriaForm from "./pages/admin/AdminCategoriaForm";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import AdminUsuarioForm from "./pages/admin/AdminUsuarioForm";

import "./App.css";
import "./admin.css";

function App() {
  return (
    <Routes>
      {/* La parte pública */}
      <Route element={<LayoutPublico />}>
        <Route path="/" element={<Home />} />
        <Route path="/estadios" element={<Estadios />} />
        <Route path="/estadios/:id" element={<Detail />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Estas piden estar logueado, no importa el rol */}
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          }
        />
        <Route
          path="/acceso-denegado"
          element={
            <PrivateRoute>
              <AccesoDenegado />
            </PrivateRoute>
          }
        />

        {/* El comodín: cualquier ruta que no exista cae acá */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* El panel, solo para admins */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="estadios" element={<AdminEstadios />} />
        <Route path="estadios/nuevo" element={<AdminEstadioForm />} />
        <Route path="estadios/:id/editar" element={<AdminEstadioForm />} />
        <Route path="categorias" element={<AdminCategorias />} />
        <Route path="categorias/nueva" element={<AdminCategoriaForm />} />
        <Route path="categorias/:id/editar" element={<AdminCategoriaForm />} />
        <Route path="usuarios" element={<AdminUsuarios />} />
        <Route path="usuarios/nuevo" element={<AdminUsuarioForm />} />
        <Route path="usuarios/:id/editar" element={<AdminUsuarioForm />} />
      </Route>
    </Routes>
  );
}

export default App;
