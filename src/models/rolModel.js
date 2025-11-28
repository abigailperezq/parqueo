import mysql from 'mysql2';
import pool from "../config/db.js";

export const RolModel = {

  async obtenerTodos() {
    const [rows] = await pool.query("SELECT * FROM rol");
    return rows;
  },

  async crear(data) {
    const { rol } = data;

    const sql = mysql.format("CALL sp_rol_crear(?)", [rol]);
    const [rows] = await pool.query(sql);

    const insertId = rows[0][0].id_rol;
    return insertId;
  },

  async obtenerPorId(id) {
    const [rows] = await pool.query(
      "SELECT * FROM rol WHERE id_rol = ?",
      [id]
    );
    return rows[0] || null;
  },

  async actualizar(id, datos) {
    const { rol } = datos;

    const sql = mysql.format("CALL sp_rol_actualizar(?, ?)", [Number(id), rol]);
    await pool.query(sql);

    return true;
  },

  async eliminar(id) {
    const sql = mysql.format("CALL sp_rol_eliminar(?)", [Number(id)]);
    await pool.query(sql);
    
    return true;
  }
};