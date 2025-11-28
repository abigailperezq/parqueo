import { Router } from "express";
import { RolModel } from "../models/rolModel.js";

const router = Router();

router.get("/rol", async (req, res) => {
  const listaRol = await RolModel.obtenerTodos();

  res.render("rol", {
    title: "Registrar Rol",
    error: null,
    datos: {},
    listaRol
  });
});

router.get("/rol/lista", async (req, res) => {
  const roles = await RolModel.obtenerTodos();

  res.render("listaRol", {
    title: "Lista de Roles",
    roles,
    error: req.query.error || null,
    msg: req.query.msg || null
  });
});

router.post("/rol/agregar", async (req, res) => {
  try {
    await RolModel.crear(req.body);
    res.redirect("/rol/lista?msg=" + encodeURIComponent("Rol registrado correctamente"));
  } catch (err) {
    const listaRol = await RolModel.obtenerTodos();

    res.render("rol", {
      title: "Registrar Rol",
      error: err.message,
      datos: req.body,
      listaRol
    });
  }
});

router.get("/rol/crear", (req, res) => {
  res.render("rol", {
    title: "Registrar Rol",
    error: null,
    datos: {},
    listaRol: []
  });
});

router.get("/rol/editar/:id", async (req, res) => {
  const rol = await RolModel.obtenerPorId(req.params.id);
  const listaRol = await RolModel.obtenerTodos();

  if (!rol) {
    return res.redirect("/rol/lista?error=" + encodeURIComponent("Rol no encontrado."));
  }

  res.render("rol", {
    title: "Editar Rol",
    error: null,
    datos: rol,
    listaRol
  });
});

router.post("/rol/editar/:id", async (req, res) => {
  const id = req.params.id;
  const { rol } = req.body;

  try {
    await RolModel.actualizar(id, { rol });
    res.redirect("/rol/lista?msg=" + encodeURIComponent("Rol actualizado correctamente"));
  } catch (err) {
    const listaRol = await RolModel.obtenerTodos();

    res.render("rol", {
      title: "Editar Rol",
      error: err.message,
      datos: { id_rol: id, rol },
      listaRol
    });
  }
});

router.get("/rol/eliminar/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await RolModel.eliminar(id);
    res.redirect("/rol/lista?msg=" + encodeURIComponent("Rol eliminado correctamente"));
  } catch (err) {
    console.error("Error al eliminar rol:", err.message);

    let msgError = err.message;

    if (err.message.includes("Cannot delete or update a parent row")) {
      msgError = "No se puede eliminar el rol porque está asociado a uno o más usuarios.";
    }

    const error = encodeURIComponent(msgError);
    res.redirect(`/rol/lista?error=${error}`);
  }
});

export default router;
