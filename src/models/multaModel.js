import pool from "../config/db.js";

export const multaModel = {
  async obtenerTodas() {
    const [rows] = await pool.query("SELECT * FROM multa");
    return rows;
  },

  async crear(data) {
    const { descripcion, monto } = data;

    const [rows] = await pool.query(
      "CALL sp_multa_crear(?,?)",
      [descripcion, monto]
    );

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

    await pool.query(
      "CALL sp_multa_actualizar(?,?,?)",
      [Number(id), descripcion, monto]
    );

    return true;
  },

  async eliminar(id) {
    await pool.query("CALL sp_multa_eliminar(?)", [Number(id)]);
    return true;
  }
};

export default multaModel;
