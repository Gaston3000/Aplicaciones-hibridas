// El "¿estás seguro?" antes de borrar algo, que no tiene vuelta atrás.
function ConfirmDialog({ abierto, titulo, mensaje, onConfirmar, onCancelar, procesando = false }) {
    if (!abierto) return null;

    return (
        <div className="modal-fondo" role="dialog" aria-modal="true" aria-label={titulo}>
            <div className="modal-caja">
                <h3>{titulo}</h3>
                <p>{mensaje}</p>
                <div className="modal-acciones">
                    <button type="button" className="btn-ghost" onClick={onCancelar} disabled={procesando}>
                        Cancelar
                    </button>
                    <button type="button" className="btn-peligro" onClick={onConfirmar} disabled={procesando}>
                        {procesando ? 'Eliminando...' : 'Sí, eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;
