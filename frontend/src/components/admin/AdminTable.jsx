// Tabla reutilizable del BackOffice.
//
// columnas: [{ clave, titulo, render? }]  -> render(fila) permite dar formato
// datos:    array de objetos con _id
// acciones: función que recibe la fila y devuelve los botones de esa fila
function AdminTable({ columnas, datos, acciones }) {
  return (
    <div className="tabla-scroll">
      <table className="tabla">
        <thead>
          <tr>
            {columnas.map((columna) => (
              <th key={columna.clave}>{columna.titulo}</th>
            ))}
            {acciones && <th className="col-acciones">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {datos.map((fila) => (
            <tr key={fila._id}>
              {columnas.map((columna) => (
                <td key={columna.clave} data-titulo={columna.titulo}>
                  {columna.render ? columna.render(fila) : fila[columna.clave]}
                </td>
              ))}
              {acciones && (
                <td className="col-acciones" data-titulo="Acciones">
                  <div className="fila-acciones">{acciones(fila)}</div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable;
