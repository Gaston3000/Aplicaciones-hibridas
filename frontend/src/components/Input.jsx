// Campo de formulario reutilizable.
// Según "type" dibuja un input normal, un textarea, un select o un checkbox.
// Todo entra por props y los cambios salen por onChange.
function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  opciones = [],
  placeholder = "",
  ayuda = "",
  ...resto
}) {
  const claseError = error ? "campo con-error" : "campo";

  // Checkbox: la etiqueta va al lado de la casilla.
  if (type === "checkbox") {
    return (
      <div className={`${claseError} campo-check`}>
        <label htmlFor={name}>
          <input
            id={name}
            type="checkbox"
            name={name}
            checked={Boolean(value)}
            onChange={onChange}
            {...resto}
          />
          <span>{label}</span>
        </label>
        {error && <span className="error">{error}</span>}
      </div>
    );
  }

  return (
    <div className={claseError}>
      <label htmlFor={name}>{label}</label>

      {type === "textarea" && (
        <textarea
          id={name}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          {...resto}
        />
      )}

      {type === "select" && (
        <select id={name} name={name} value={value ?? ""} onChange={onChange} {...resto}>
          <option value="">Seleccionar...</option>
          {opciones.map((opcion) => (
            <option key={opcion.valor} value={opcion.valor}>
              {opcion.texto}
            </option>
          ))}
        </select>
      )}

      {type !== "textarea" && type !== "select" && (
        <input
          id={name}
          type={type}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          {...resto}
        />
      )}

      {ayuda && !error && <span className="campo-ayuda">{ayuda}</span>}
      {error && <span className="error">{error}</span>}
    </div>
  );
}

export default Input;
