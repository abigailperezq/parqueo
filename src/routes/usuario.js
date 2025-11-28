import { Router } from "express";
import UsuarioModel from "../models/usuarioModel.js";
import { RolModel } from "../models/rolModel.js";

const router = Router();

router.use((req, res, next) => {
  if (!req.session.usuario) {
    return res.redirect("/login");
  }
  if (req.session.usuario.rol !== "ADMIN") {
    return res
      .status(403)
      .send("Acceso denegado. Solo el rol ADMIN puede gestionar usuarios.");
  }

  next();
});

router.get("/usuario", async (req, res) => {
  const redirectTo = req.query.redirect || "";
  const roles = await RolModel.obtenerTodos();

  res.render("usuario", {
    title: "Registrar Usuario",
    usuario: {},
    error: null,
    redirectTo,
    roles,
  });
});

router.get("/usuario/lista", async (req, res) => {
  const usuarios = await UsuarioModel.obtenerTodos();

  res.render("listaUsuario", {
    title: "Usuarios",
    usuarios,
    error: req.query.error || null,
    msg: req.query.msg || null,
  });
});

router.post("/usuario/agregar", async (req, res) => {
  const redirectTo = req.body.redirectTo || "";

  try {
    await UsuarioModel.crear(req.body);

    if (redirectTo) return res.redirect(redirectTo);
    res.redirect(
      "/usuario/lista?msg=" +
        encodeURIComponent("Usuario registrado correctamente")
    );
  } catch (err) {
    const roles = await RolModel.obtenerTodos();

    res.render("usuario", {
      title: "Registrar Usuario",
      usuario: req.body,
      error: err.message,
      redirectTo,
      roles,
    });
  }
});

router.get("/usuario/editar/:id", async (req, res) => {
  const usuario = await UsuarioModel.obtenerPorId(req.params.id);
  const roles = await RolModel.obtenerTodos();

  res.render("usuario", {
    title: "Editar Usuario",
    usuario,
    error: null,
    redirectTo: "",
    roles,
  });
});

router.post("/usuario/editar/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await UsuarioModel.actualizar(id, req.body);
    res.redirect(
      "/usuario/lista?msg=" +
        encodeURIComponent("Usuario actualizado correctamente")
    );
  } catch (err) {
    const usuario = await UsuarioModel.obtenerPorId(id);
    const roles = await RolModel.obtenerTodos();

    res.render("usuario", {
      title: "Editar Usuario",
      usuario,
      error: err.message,
      redirectTo: "",
      roles,
    });
  }
});

router.get("/usuario/eliminar/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await UsuarioModel.eliminar(id);

    res.redirect(
      "/usuario/lista?msg=" +
        encodeURIComponent("Usuario eliminado correctamente")
    );
  } catch (err) {
    console.error("Error al eliminar usuario:", err.message);

    let msgError = err.message;
    if (err.message.includes("Cannot delete or update a parent row")) {
      msgError =
        "No se puede eliminar el usuario porque está asociado a otros registros.";
    }

    const error = encodeURIComponent(msgError);
    res.redirect(`/usuario/lista?error=${error}`);
  }
});

export default router;
