import { Router } from "express";
import { ClienteModel } from "../models/clienteModel.js";

const router = Router();

router.get("/clientes", async (req, res) => {
  const listaClientes = await ClienteModel.obtenerTodos();
  res.render("cliente", {
    title: "Registrar Cliente",
    cliente: {},
    clientes: listaClientes,
    error: null,
    datos: {}
  });
});

router.get("/clientes/lista", async (req, res) => {
  const listaClientes = await ClienteModel.obtenerTodos();
  res.render("clientes-list", {
    title: "Lista de Clientes",
    clientes: listaClientes,
    error: req.query.error || null,
    msg: req.query.msg || null
  });
});

router.post("/cliente/agregar", async (req, res) => {
  try {
    await ClienteModel.crear(req.body);
    res.redirect("/clientes");
  } catch (err) {
    const listaClientes = await ClienteModel.obtenerTodos();
    res.render("cliente", {
      title: "Registrar Cliente",
      error: err.message,
      datos: req.body,
      cliente: {},
      clientes: listaClientes
    });
  }
});

router.get("/cliente/crear", (req, res) => {
  res.render("cliente", {
    title: "Registrar Cliente",
    error: null,
    datos: {},
    cliente: {},
    clientes: []
  });
});

router.get("/cliente/editar/:id", async (req, res) => {
  const cliente = await ClienteModel.obtenerPorId(req.params.id);
  res.render("cliente", {
    title: "Editar Cliente",
    cliente,
    clientes: [],
    error: null,
    datos: cliente
  });
});

router.post("/cliente/editar/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await ClienteModel.actualizar(id, req.body);
    res.redirect("/clientes/lista");

  } catch (err) {
    const cliente = await ClienteModel.obtenerPorId(id);

    res.render("cliente", {
      title: "Editar Cliente",
      error: err.message,
      datos: req.body,
      cliente,
      clientes: []
    });
  }
});

router.get("/cliente/eliminar/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await ClienteModel.eliminar(id);
    res.redirect("/clientes/lista?msg=" + encodeURIComponent("Cliente eliminado correctamente"));
  } catch (err) {
    console.error("Error al eliminar cliente:", err.message);

    let msgError = err.message;
    if (err.message.includes("Cannot delete or update a parent row")) {
      msgError = "No se puede eliminar el cliente.";
    }

    const error = encodeURIComponent(msgError);
    res.redirect(`/clientes/lista?error=${error}`);
  }
});

export default router;
