// Input reutilizable. Recibe todo por props y avisa los cambios con onChange.
function Input({ label, type = "text", name, value, onChange, error }) {
  return (
    <div className="campo">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
}

export default Input;
