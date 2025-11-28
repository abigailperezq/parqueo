import pool from "../config/db.js";

export const RolModel = {

  async obtenerTodos() {
    const [rows] = await pool.query("SELECT * FROM rol");
    return rows;
  },

  async crear(data) {
    const { rol } = data;

    const [rows] = await pool.query(
      "CALL sp_rol_crear(?)",
      [rol]
    );
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

    await pool.query(
      "CALL sp_rol_actualizar(?, ?)",
      [Number(id), rol]
    );

    return true;
  },

  async eliminar(id) {
    await pool.query(
      "CALL sp_rol_eliminar(?)",
      [Number(id)]
    );
    return true;
  }
};
