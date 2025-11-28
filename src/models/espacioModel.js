import pool from "../config/db.js";

export const EspacioModel = {

    async obtenerTodos() {
        const [rows] = await pool.query("SELECT * FROM espacio");
        return rows;
    },

    async crear(data) {
        const { estado, tipo, ubicacion } = data;

        const [rows] = await pool.query(
            "CALL sp_espacio_crear(?,?,?)",
            [estado, tipo, ubicacion]
        );

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

        await pool.query(
            "CALL sp_espacio_actualizar(?,?,?,?)",
            [Number(id), estado, tipo, ubicacion]
        );
    },

    async eliminar(id) {
        await pool.query("CALL sp_espacio_eliminar(?)", [id]);
        return true;
    },

    async obtenerEstado(id) {
        const [rows] = await pool.query(
            "CALL sp_espacio_obtener_estado(?)",
            [id]
        );

        const estado = rows[0][0]?.estado ?? null;
        return estado;
    },

    async marcarOcupado(id) {
        await pool.query("CALL sp_espacio_marcar_ocupado(?)", [id]);
    },

    async marcarDisponible(id) {
        await pool.query("CALL sp_espacio_marcar_disponible(?)", [id]);
    },

    async obtenerDisponiblesPorTipo(tipo) {
        const [rows] = await pool.query(
            "CALL sp_espacio_disponibles_por_tipo(?)",
            [tipo]
        );

        return rows[0];
    }
};
