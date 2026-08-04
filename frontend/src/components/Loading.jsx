// El cartelito de "cargando" que uso en todos lados.
function Loading({ texto = 'Cargando...' }) {
    return (
        <div className="estado-carga" role="status">
            <span className="spinner" aria-hidden="true"></span>
            <p>{texto}</p>
        </div>
    );
}

export default Loading;
