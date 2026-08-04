// Para cuando la consulta salió bien pero no hay nada que mostrar.
// No es lo mismo que un error y conviene que se note.
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
