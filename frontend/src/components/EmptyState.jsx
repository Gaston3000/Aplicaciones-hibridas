// Estado vacío: cuando la consulta funcionó pero no hay nada que mostrar.
function EmptyState({ titulo = 'No hay datos para mostrar', texto, children }) {
    return (
        <div className="estado-vacio">
            <h3>{titulo}</h3>
            {texto && <p>{texto}</p>}
            {children}
        </div>
    );
}

export default EmptyState;
