import db from "../config/db.js";

export const usuarioModel = {

  buscarPorUsuario: async (usuario) => {
    const [rows] = await db.query(
      `SELECT u.*, r.rol 
       FROM usuario u
       LEFT JOIN rol r ON u.id_rol = r.id_rol
       WHERE u.usuario = ?`,
      [usuario]
    );
    return rows[0];
  },

  async obtenerTodos() {
    const [rows] = await db.query(`
      SELECT 
        u.id_usuario,
        u.usuario,
        u.nombre,
        u.correo,
        u.telefono,
        r.rol AS nombre_rol
      FROM usuario u
      LEFT JOIN rol r ON u.id_rol = r.id_rol
      ORDER BY u.id_usuario DESC
    `);
    return rows;
  },

  async crear(data) {
    const { usuario, clave, correo, nombre, telefono, id_rol } = data;

    const [rows] = await db.query(
      "CALL sp_usuario_crear(?,?,?,?,?,?)",
      [usuario, clave, correo, nombre, telefono, id_rol]
    );

    const insertId = rows[0][0].id_usuario;
    return insertId;
  },

  async obtenerPorId(id) {
    const [rows] = await db.query(
      "SELECT * FROM usuario WHERE id_usuario = ?",
      [id]
    );
    return rows[0];
  },

  async actualizar(id, data) {
    const { usuario, clave, correo, nombre, telefono, id_rol } = data;

    await db.query(
      "CALL sp_usuario_actualizar(?,?,?,?,?,?,?)",
      [Number(id), usuario, clave, correo, nombre, telefono, id_rol]
    );

    return true;
  },

  async eliminar(id) {
    await db.query("CALL sp_usuario_eliminar(?)", [Number(id)]);
    return true;
  }
};

export default usuarioModel;
