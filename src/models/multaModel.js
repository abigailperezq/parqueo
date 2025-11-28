import mysql from 'mysql2';
import pool from "../config/db.js";

export const multaModel = {
  async obtenerTodas() {
    const [rows] = await pool.query("SELECT * FROM multa");
    return rows;
  },

  async crear(data) {
    const { descripcion, monto } = data;

    const sql = mysql.format("CALL sp_multa_crear(?,?)", [descripcion, monto]);
    const [rows] = await pool.query(sql);

    const insertId = rows[0][0].id_multa;
    return insertId;
  },

  async obtenerPorId(id) {
    const [rows] = await pool.query(
      "SELECT * FROM multa WHERE id_multa = ?",
      [id]
    );
    return rows[0];
  },

  async actualizar(id, datos) {
    const { descripcion, monto } = datos;

    const sql = mysql.format("CALL sp_multa_actualizar(?,?,?)", [Number(id), descripcion, monto]);
    await pool.query(sql);

    return true;
  },

  async eliminar(id) {
    const sql = mysql.format("CALL sp_multa_eliminar(?)", [Number(id)]);
    await pool.query(sql);
    return true;
  }
};

export default multaModel;