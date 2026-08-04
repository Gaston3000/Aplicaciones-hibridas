import PrivateRoute from './PrivateRoute';

// Atajo de PrivateRoute para el BackOffice: exige sesión iniciada Y rol admin.
function AdminRoute({ children }) {
    return <PrivateRoute soloAdministradores>{children}</PrivateRoute>;
}

export default AdminRoute;
