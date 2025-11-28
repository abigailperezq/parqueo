import db from "../config/db.js";

export const ClienteModel = {
  async obtenerTodos() {
    const [rows] = await db.query(`
      SELECT id_cliente, dui, nombre, telefono
      FROM cliente
      ORDER BY id_cliente DESC
    `);
    return rows;
  },

  async obtenerPorId(id) {
    const [rows] = await db.query(
      "SELECT id_cliente, dui, nombre, telefono FROM cliente WHERE id_cliente = ?",
      [id]
    );
    return rows[0];
  },

  async crear(data) {
    const { dui, nombre, telefono } = data;

    const [rows] = await db.query(
      "CALL sp_cliente_crear(?,?,?)",
      [dui, nombre, telefono]
    );

    const insertId = rows[0][0].id_cliente;
    return insertId;
  },

  async actualizar(id, data) {
    const { dui, nombre, telefono } = data;

    await db.query("CALL sp_cliente_actualizar(?,?,?,?)", [
      Number(id),
      dui,
      nombre,
      telefono,
    ]);
  },

  async eliminar(id) {
    await db.query("DELETE FROM cliente WHERE id_cliente = ?", [id]);
  },
};
