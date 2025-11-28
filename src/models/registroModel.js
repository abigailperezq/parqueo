import mysql from 'mysql2';
import pool from "../config/db.js";

export const RegistroModel = {

  async obtenerTodos() {
    const [rows] = await pool.query(
      `
      SELECT 
          r.id_registro,
          r.fecha,
          r.hora_entrada,
          r.hora_salida,
          v.matricula      AS vehiculo,
          e.ubicacion      AS espacio,
          f.id_factura     AS id_factura   -- para saber si ya tiene factura
      FROM registro r
      INNER JOIN vehiculo v ON r.id_vehiculo = v.id_vehiculo
      INNER JOIN espacio e  ON r.id_espacio  = e.id_espacio
      LEFT JOIN factura f   ON f.id_registro = r.id_registro
      ORDER BY r.id_registro DESC
      `
    );

    return rows;
  },

  async obtenerPorId(id) {
    const [rows] = await pool.query(
      `
      SELECT 
          r.*,
          v.matricula,
          e.ubicacion,
          f.id_factura AS id_factura
      FROM registro r
      INNER JOIN vehiculo v ON r.id_vehiculo = v.id_vehiculo
      INNER JOIN espacio e  ON r.id_espacio  = e.id_espacio
      LEFT JOIN factura f   ON f.id_registro = r.id_registro
      WHERE r.id_registro = ?
      `,
      [id]
    );
    return rows[0];
  },

  async crear(data) {
    const { fecha, hora_entrada, id_espacio, id_vehiculo } = data;

    // Usamos mysql.format para los parámetros del CALL
    const sql = mysql.format("CALL sp_registro_crear(?,?,?,?)", [fecha, hora_entrada, id_espacio, id_vehiculo]);
    const [rows] = await pool.query(sql);
    
    // Este procedimiento no recibe parámetros, así que funciona directo
    await pool.query("CALL sp_espacio_sincronizar_estados()");

    const insertId = rows[0][0].id_registro;
    return insertId;
  },

  async actualizar(id, data) {
    const { fecha, hora_entrada, hora_salida, id_espacio, id_vehiculo } = data;

    const horaSalidaFinal =
      hora_salida === "" || hora_salida === undefined ? null : hora_salida;

    const sql = mysql.format("CALL sp_registro_actualizar(?,?,?,?,?,?)", [
        Number(id),
        fecha,
        hora_entrada,
        horaSalidaFinal,
        id_espacio,
        id_vehiculo
    ]);
    await pool.query(sql);

    await pool.query("CALL sp_espacio_sincronizar_estados()");

    return true;
  },

  async registrarSalida(id, hora_salida) {
    const sql = mysql.format("CALL sp_registro_registrar_salida(?,?)", [Number(id), hora_salida]);
    await pool.query(sql);

    await pool.query("CALL sp_espacio_sincronizar_estados()");

    return true;
  },

  async eliminar(id) {
    const sql = mysql.format("CALL sp_registro_eliminar(?)", [Number(id)]);
    await pool.query(sql);
    
    await pool.query("CALL sp_espacio_sincronizar_estados()");

    return true;
  }
};