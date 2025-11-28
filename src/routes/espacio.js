import { Router } from "express";
import { EspacioModel } from "../models/espacioModel.js";

const router = Router();

router.get("/espacios", async (req, res) => {
  const listaEspacios = await EspacioModel.obtenerTodos();
  res.render("espacio", {
    title: "Registrar Espacio",
    espacio: {},
    espacios: listaEspacios,
    error: null,
    datos: {}
  });
});

router.get("/espacios/lista", async (req, res) => {
  const listaEspacios = await EspacioModel.obtenerTodos();
  res.render("listaEspacio", {
    title: "Lista de Espacios",
    espacios: listaEspacios,
    error: req.query.error || null,
    msg: req.query.msg || null
  });
});

router.post("/espacio/agregar", async (req, res) => {
  try {
    await EspacioModel.crear(req.body);
    res.redirect("/espacios");
  } catch (err) {
    const listaEspacios = await EspacioModel.obtenerTodos();
    res.render("espacio", {
      title: "Registrar Espacio",
      error: err.message,
      datos: req.body,
      espacio: {},
      espacios: listaEspacios
    });
  }
});

router.get("/espacio/crear", (req, res) => {
  res.render("espacio", {
    title: "Registrar Espacio",
    error: null,
    datos: {},
    espacio: {},
    espacios: []
  });
});

router.get("/espacio/editar/:id", async (req, res) => {
  const espacio = await EspacioModel.obtenerPorId(req.params.id);
  res.render("espacio", {
    title: "Editar Espacio",
    espacio,
    espacios: [],
    error: null,
    datos: espacio
  });
});

router.post("/espacio/editar/:id", async (req, res) => {
  const id = req.params.id;
  const { estado, tipo, ubicacion } = req.body;

  try {
    await EspacioModel.actualizar(id, { estado, tipo, ubicacion });
    res.redirect("/espacios/lista");
  } catch (err) {
    const espacio = await EspacioModel.obtenerPorId(id);
    res.render("espacio", {
      title: "Editar Espacio",
      espacio,
      espacios: [],
      error: err.message,
      datos: req.body
    });
  }
});

router.get("/espacio/eliminar/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await EspacioModel.eliminar(id);
    res.redirect("/espacios/lista?msg=" + encodeURIComponent("Espacio eliminado correctamente"));
  } catch (err) {
    console.error("Error al eliminar espacio:", err.message);

    let msgError = err.message;
    if (err.message.includes("Cannot delete or update a parent row")) {
      msgError = "No se puede eliminar el espacio.";
    }

    const error = encodeURIComponent(msgError);
    res.redirect(`/espacios/lista?error=${error}`);
  }
});

router.get("/espacios/disponibles/:tipo", async (req, res) => {
  const tipo = req.params.tipo;

  try {
    const espacios = await EspacioModel.obtenerDisponiblesPorTipo(tipo);
    res.json(espacios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener espacios disponibles" });
  }
});

export default router;
