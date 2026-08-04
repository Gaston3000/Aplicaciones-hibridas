// Muestra un error y, si se le pasa onReintentar, un botón para volver a probar.
function ErrorMessage({ mensaje, onReintentar }) {
    if (!mensaje) return null;

    return (
        <div className="estado-error" role="alert">
            <p>{mensaje}</p>
            {onReintentar && (
                <button type="button" className="btn-ghost" onClick={onReintentar}>
                    Reintentar
                </button>
            )}
        </div>
    );
}

export default ErrorMessage;
