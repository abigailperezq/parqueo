import mysql from 'mysql2';
import pool from "../config/db.js";

export const EspacioModel = {

    async obtenerTodos() {
        const [rows] = await pool.query("SELECT * FROM espacio");
        return rows;
    },

    async crear(data) {
        const { estado, tipo, ubicacion } = data;

        const sql = mysql.format("CALL sp_espacio_crear(?,?,?)", [estado, tipo, ubicacion]);
        const [rows] = await pool.query(sql);

        const insertId = rows[0][0].id_espacio;
        return insertId;
    },

    async obtenerPorId(id) {
        const [rows] = await pool.query(
            "SELECT * FROM espacio WHERE id_espacio = ?",
            [id]
        );
        return rows[0];
    },

    async actualizar(id, datos) {
        const { estado, tipo, ubicacion } = datos;

        const sql = mysql.format("CALL sp_espacio_actualizar(?,?,?,?)", [Number(id), estado, tipo, ubicacion]);
        await pool.query(sql);
    },

    async eliminar(id) {
        const sql = mysql.format("CALL sp_espacio_eliminar(?)", [id]);
        await pool.query(sql);
        return true;
    },

    async obtenerEstado(id) {
        const sql = mysql.format("CALL sp_espacio_obtener_estado(?)", [id]);
        const [rows] = await pool.query(sql);

        const estado = rows[0][0]?.estado ?? null;
        return estado;
    },

    async marcarOcupado(id) {
        const sql = mysql.format("CALL sp_espacio_marcar_ocupado(?)", [id]);
        await pool.query(sql);
    },

    async marcarDisponible(id) {
        const sql = mysql.format("CALL sp_espacio_marcar_disponible(?)", [id]);
        await pool.query(sql);
    },

    async obtenerDisponiblesPorTipo(tipo) {
        const sql = mysql.format("CALL sp_espacio_disponibles_por_tipo(?)", [tipo]);
        const [rows] = await pool.query(sql);

        return rows[0];
    }
};