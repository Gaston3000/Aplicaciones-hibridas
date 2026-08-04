import PrivateRoute from './PrivateRoute';

// Un atajo de PrivateRoute para el panel: pide sesión y además rol admin.
function AdminRoute({ children }) {
    return <PrivateRoute soloAdministradores>{children}</PrivateRoute>;
}

export default AdminRoute;
