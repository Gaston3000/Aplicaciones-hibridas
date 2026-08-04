import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

// El molde de la parte pública: la navbar arriba, la página en el medio
// y el footer abajo. Lo que cambia entra por el Outlet.
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
