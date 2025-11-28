import db from "../config/db.js";

export const facturaModel = {

  async obtenerTodas() {
    const [rows] = await db.query(`
      SELECT 
        f.id_factura,
        f.total_factura,
        f.id_multa,
        f.id_usuario,
        f.id_registro,

        r.fecha,
        r.hora_entrada,
        r.hora_salida,

        v.matricula                  AS matricula,
        c.nombre                     AS nombre_cliente,   -- ajusta el nombre de columna si es distinto

        u.nombre                     AS nombre_usuario,
        m.descripcion                AS multa_descripcion,
        m.monto                      AS multa_monto
      FROM factura f
      LEFT JOIN registro r   ON r.id_registro   = f.id_registro
      LEFT JOIN vehiculo v   ON v.id_vehiculo   = r.id_vehiculo
      LEFT JOIN cliente c    ON c.id_cliente    = v.id_cliente
      LEFT JOIN usuario u    ON u.id_usuario    = f.id_usuario
      LEFT JOIN multa m      ON m.id_multa      = f.id_multa
      ORDER BY f.id_factura DESC
    `);

    return rows;
  },

  async obtenerPorId(id_factura) {
    const [rows] = await db.query(`
      SELECT 
        f.id_factura,
        f.total_factura,
        f.id_multa,
        f.id_usuario,
        f.id_registro,

        r.fecha,
        r.hora_entrada,
        r.hora_salida,

        v.matricula                  AS matricula,
        c.nombre                     AS nombre_cliente,   -- ajusta aquí igual

        u.nombre                     AS nombre_usuario,
        m.descripcion                AS multa_descripcion,
        m.monto                      AS multa_monto
      FROM factura f
      LEFT JOIN registro r   ON r.id_registro   = f.id_registro
      LEFT JOIN vehiculo v   ON v.id_vehiculo   = r.id_vehiculo
      LEFT JOIN cliente c    ON c.id_cliente    = v.id_cliente
      LEFT JOIN usuario u    ON u.id_usuario    = f.id_usuario
      LEFT JOIN multa m      ON m.id_multa      = f.id_multa
      WHERE f.id_factura = ?
      LIMIT 1
    `, [id_factura]);

    return rows[0] || null;
  },

  async generarFactura({ id_registro, id_usuario, id_multa = null }) {
    await db.query(
      "CALL sp_generar_factura(?, ?, ?)",
      [id_registro, id_usuario, id_multa]
    );

    const [rows] = await db.query(
      `
      SELECT 
        id_factura,
        total_factura
      FROM factura
      WHERE id_registro = ?
      ORDER BY id_factura DESC
      LIMIT 1
      `,
      [id_registro]
    );

    return rows[0] || null; 
  },

  async eliminar(id_factura) {
    const [result] = await db.query(
      "DELETE FROM factura WHERE id_factura = ?",
      [id_factura]
    );
    return result.affectedRows > 0;
  }
};

export default facturaModel;
