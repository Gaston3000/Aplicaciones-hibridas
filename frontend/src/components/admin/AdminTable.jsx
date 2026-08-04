// La tabla que usan las tres pantallas del panel.
//
// columnas: [{ clave, titulo, render? }] -> con render(fila) le doy formato
// datos:    el array de objetos, cada uno con su _id
// acciones: una función que recibe la fila y devuelve los botones de esa fila
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
