import mysql from 'mysql2';
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

    // Usamos mysql.format para armar el INSERT seguro antes de enviarlo
    const sql = mysql.format(
      "INSERT INTO tipo_vehiculo (nombre, tarifa_hora) VALUES (?, ?)",
      [nombre, tarifa_hora]
    );
    
    const [result] = await pool.query(sql);

    return result.insertId;
  },

  async obtenerPorId(id) {
    // También formateamos el SELECT por seguridad
    const sql = mysql.format(
      "SELECT * FROM tipo_vehiculo WHERE id_tipo_vehiculo = ?",
      [id]
    );
    const [rows] = await pool.query(sql);
    
    return rows[0];
  },

  async actualizar(id, datos) {
    const { nombre, tarifa_hora } = datos;

    if (!nombre || !tarifa_hora) {
      throw new Error("Nombre y tarifa por hora son obligatorios.");
    }

    const sql = mysql.format(
      "UPDATE tipo_vehiculo SET nombre = ?, tarifa_hora = ? WHERE id_tipo_vehiculo = ?",
      [nombre, tarifa_hora, id]
    );

    return pool.query(sql);
  },

  async eliminar(id) {
    const sql = mysql.format(
      "DELETE FROM tipo_vehiculo WHERE id_tipo_vehiculo = ?",
      [id]
    );
    
    await pool.query(sql);
    return true;
  }
};