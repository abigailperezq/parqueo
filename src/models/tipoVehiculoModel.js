// models/tipoVehiculoModel.js
import pool from "../config/db.js";

export const TipoVehiculoModel = {
  async obtenerTodos() {
    const [rows] = await pool.query("SELECT * FROM tipo_vehiculo");
    return rows;
  },

  async crear(data) {
    const { nombre, tarifa_hora } = data;

    if (!nombre || !tarifa_hora) {
      throw new Error("Nombre y tarifa por hora son obligatorios.");
    }

    const [result] = await pool.query(
      "INSERT INTO tipo_vehiculo (nombre, tarifa_hora) VALUES (?, ?)",
      [nombre, tarifa_hora]
    );

    return result.insertId;
  },

  async obtenerPorId(id) {
    const [rows] = await pool.query(
      "SELECT * FROM tipo_vehiculo WHERE id_tipo_vehiculo = ?",
      [id]
    );
    return rows[0];
  },

  async actualizar(id, datos) {
    const { nombre, tarifa_hora } = datos;

    if (!nombre || !tarifa_hora) {
      throw new Error("Nombre y tarifa por hora son obligatorios.");
    }

    return pool.query(
      "UPDATE tipo_vehiculo SET nombre = ?, tarifa_hora = ? WHERE id_tipo_vehiculo = ?",
      [nombre, tarifa_hora, id]
    );
  },

  async eliminar(id) {
    await pool.query(
      "DELETE FROM tipo_vehiculo WHERE id_tipo_vehiculo = ?",
      [id]
    );
    return true;
  }
};
