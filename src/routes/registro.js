import { Router } from "express";
import { RegistroModel } from "../models/registroModel.js";
import { VehiculoModel } from "../models/vehiculoModel.js";
import { EspacioModel } from "../models/espacioModel.js";

const router = Router();

router.get("/registros", async (req, res) => {
  const registros = await RegistroModel.obtenerTodos();
  const listaVehiculos = await VehiculoModel.obtenerTodos();

  res.render("registro", {
    title: "Nuevo Registro",
    registro: {},
    registros,
    listaVehiculos,
    listaEspacios: [],
    error: null,
    datos: {}
  });
});

router.get("/espacios/disponibles/:tipo", async (req, res) => {
  try {
    const tipo = req.params.tipo;
    const espacios = await EspacioModel.obtenerDisponiblesPorTipo(tipo);
    res.json(espacios);
  } catch (err) {
    res.status(500).json({ error: "Error al cargar espacios" });
  }
});

router.post("/registro/agregar", async (req, res) => {
  try {
    await RegistroModel.crear(req.body);
    res.redirect("/registros/lista?msg=" + encodeURIComponent("Registro creado correctamente"));
  } catch (err) {
    const listaVehiculos = await VehiculoModel.obtenerTodos();

    res.render("registro", {
      title: "Nuevo Registro",
      registro: {},
      listaVehiculos,
      listaEspacios: [],
      error: err.message,
      datos: req.body
    });
  }
});

router.get("/registros/lista", async (req, res) => {
  const registros = await RegistroModel.obtenerTodos();

  res.render("registro-list", {
    title: "Lista de Registros",
    registros,
    error: req.query.error || null,
    msg: req.query.msg || null
  });
});

router.get("/registro/salida/:id", async (req, res) => {
  const registro = await RegistroModel.obtenerPorId(req.params.id);

  if (!registro) return res.redirect("/registros/lista");

  res.render("registro-salida", {
    title: "Registrar Salida",
    registro,
    error: null,
    datos: {}
  });
});

router.post("/registro/salida/:id", async (req, res) => {
  try {
    await RegistroModel.registrarSalida(req.params.id, req.body.hora_salida);
    res.redirect("/registros/lista?msg=" + encodeURIComponent("Salida registrada correctamente"));
  } catch (err) {
    const registro = await RegistroModel.obtenerPorId(req.params.id);

    res.render("registro-salida", {
      title: "Registrar Salida",
      registro,
      error: err.message
    });
  }
});

router.get("/registro/editar/:id", async (req, res) => {
  const registro = await RegistroModel.obtenerPorId(req.params.id);
  const listaVehiculos = await VehiculoModel.obtenerTodos();
  const listaEspacios = await EspacioModel.obtenerTodos();

  res.render("registro", {
    title: "Editar Registro",
    registro,
    listaVehiculos,
    listaEspacios,
    error: null,
    datos: registro
  });
});

router.post("/registro/editar/:id", async (req, res) => {
  try {
    await RegistroModel.actualizar(req.params.id, req.body);
    res.redirect("/registros/lista?msg=" + encodeURIComponent("Registro actualizado correctamente"));
  } catch (err) {
    const registro = await RegistroModel.obtenerPorId(req.params.id);
    const listaVehiculos = await VehiculoModel.obtenerTodos();
    const listaEspacios = await EspacioModel.obtenerTodos();

    res.render("registro", {
      title: "Editar Registro",
      registro,
      listaVehiculos,
      listaEspacios,
      error: err.message,
      datos: req.body
    });
  }
});

router.get("/registro/eliminar/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await RegistroModel.eliminar(id);
    res.redirect("/registros/lista?msg=" + encodeURIComponent("Registro eliminado correctamente"));
  } catch (err) {
    console.error("Error al eliminar registro:", err.message);

    let msgError = err.message;
    if (err.message.includes("Cannot delete or update a parent row")) {
      msgError = "No se puede eliminar el registro.";
    }

    const error = encodeURIComponent(msgError);
    res.redirect(`/registros/lista?error=${error}`);
  }
});

export default router;
