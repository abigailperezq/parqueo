// src/routes/factura.js
import express from "express";
import { facturaModel } from "../models/facturaModel.js";
import { multaModel } from "../models/multaModel.js";
import { RegistroModel } from "../models/registroModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const facturas = await facturaModel.obtenerTodas();

    res.render("factura/lista", {
      title: "Facturas registradas",
      facturas,
    });
  } catch (error) {
    console.error("Error al obtener facturas:", error);
    res.status(500).send("Error al obtener facturas");
  }
});

router.get("/generar/:id_registro", async (req, res) => {
  const { id_registro } = req.params;

  try {
    const registro = await RegistroModel.obtenerPorId(id_registro);
    const multas = await multaModel.obtenerTodas(); // para listar en el <select>

    if (!registro) {
      return res.status(404).send("Registro no encontrado");
    }

    res.render("factura/seleccionarMulta", {
      title: "Generar factura",
      registro,
      multas,
      error: null,
    });
  } catch (error) {
    console.error("Error al cargar formulario de factura:", error);
    res.status(500).send("Error al cargar formulario de factura");
  }
});

router.post("/generar", async (req, res) => {
  const { id_registro, id_multa } = req.body;

  const usuarioSesion = req.session?.usuario;

  const id_usuario = usuarioSesion
    ? (usuarioSesion.id_usuario || usuarioSesion.id)
    : null;

  if (!id_usuario) {
    console.error("No hay id_usuario en la sesión:", usuarioSesion);
    return res.status(500).send("No se encontró el usuario en la sesión.");
  }

  try {
    const info = await facturaModel.generarFactura({
      id_registro,
      id_usuario,
      id_multa: id_multa || null,
    });

    if (!info || !info.id_factura) {
      throw new Error("No se generó la factura correctamente");
    }

    res.redirect(`/factura/detalle/${info.id_factura}`);
  } catch (error) {
    console.error("Error al generar factura:", error);
    res.status(500).send("Error al generar factura");
  }
});

router.get("/detalle/:id_factura", async (req, res) => {
  const { id_factura } = req.params;

  try {
    const factura = await facturaModel.obtenerPorId(id_factura);

    if (!factura) {
      return res.status(404).send("Factura no encontrada");
    }

    res.render("factura/detalle", {
      title: `Factura #${factura.id_factura}`,
      factura,
    });
  } catch (error) {
    console.error("Error al obtener detalle de factura:", error);
    res.status(500).send("Error al obtener detalle de factura");
  }
});

router.post("/eliminar/:id_factura", async (req, res) => {
  const { id_factura } = req.params;

  try {
    await facturaModel.eliminar(id_factura);
    res.redirect("/factura");
  } catch (error) {
    console.error("Error al eliminar factura:", error);
    res.status(500).send("Error al eliminar factura");
  }
});

export default router;
