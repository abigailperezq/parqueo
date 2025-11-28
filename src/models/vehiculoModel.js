import mysql from 'mysql2';
import pool from "../config/db.js";

export const VehiculoModel = {

  async obtenerTodos() {
    const [rows] = await pool.query(`
      SELECT 
        v.*,
        c.nombre AS nombre_cliente,
        c.dui AS dui_cliente,
        tv.nombre AS nombre_tipo_vehiculo,
        tv.tarifa_hora
      FROM vehiculo v
      INNER JOIN cliente c ON v.id_cliente = c.id_cliente
      INNER JOIN tipo_vehiculo tv ON v.id_tipo_vehiculo = tv.id_tipo_vehiculo
      ORDER BY v.id_vehiculo DESC
    `);
    return rows;
  },

  async crear({ color, marca, matricula, modelo, id_cliente, id_tipo_vehiculo }) {
    const sql = mysql.format(
      "CALL sp_vehiculo_crear(?,?,?,?,?,?)",
      [color, marca, matricula, modelo, id_cliente, id_tipo_vehiculo]
    );

    const [rows] = await pool.query(sql);

    const insertId = rows[0][0].id_vehiculo;
    return insertId;
  },

  async obtenerPorId(id) {
    const sql = mysql.format("SELECT * FROM vehiculo WHERE id_vehiculo = ?", [id]);
    const [rows] = await pool.query(sql);
    return rows[0];
  },

  async actualizar(id, { color, marca, matricula, modelo, id_cliente, id_tipo_vehiculo }) {
    const sql = mysql.format(
      "CALL sp_vehiculo_actualizar(?,?,?,?,?,?,?)",
      [
        Number(id),
        color,
        marca,
        matricula,
        modelo,
        id_cliente,
        id_tipo_vehiculo
      ]
    );

    await pool.query(sql);
    return true;
  },

  async eliminar(id) {
    const sql = mysql.format("CALL sp_vehiculo_eliminar(?)", [id]);
    await pool.query(sql);
    return true;
  }
};