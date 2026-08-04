import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Estructura común del FrontOffice (parte pública): navbar arriba,
// la página en el medio y el footer abajo.
function LayoutPublico() {
  return (
    <>
      <Navbar />
      <div className="app">
        <Outlet />
        <Footer />
      </div>
    </>
  );
}

export default LayoutPublico;
