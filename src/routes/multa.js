import { Router } from "express";
import { multaModel } from "../models/multaModel.js";

const router = Router();

router.get("/multas", (req, res) => {
  res.render("multa", {
    title: "Registrar multa",
    multa: {},
    error: null,
  });
});

router.post("/multa/agregar", async (req, res) => {
  try {
    await multaModel.crear(req.body);
    res.redirect("/multa-list?msg=" + encodeURIComponent("Multa registrada correctamente"));
  } catch (error) {
    res.render("multa", {
      title: "Registrar multa",
      multa: req.body,
      error: error.message,
    });
  }
});

router.get("/multa-list", async (req, res) => {
  const multas = await multaModel.obtenerTodas();
  res.render("multa-list", {
    title: "Listado de multas",
    multas,
    error: req.query.error || null,
    msg: req.query.msg || null
  });
});

router.get("/multa/editar/:id", async (req, res) => {
  const multa = await multaModel.obtenerPorId(req.params.id);
  res.render("multa", {
    title: "Editar multa",
    multa,
    error: null,
  });
});

router.post("/multa/editar/:id", async (req, res) => {
  try {
    await multaModel.actualizar(req.params.id, req.body);
    res.redirect("/multa-list?msg=" + encodeURIComponent("Multa actualizada correctamente"));
  } catch (error) {
    res.render("multa", {
      title: "Editar multa",
      multa: req.body,
      error: error.message,
    });
  }
});

router.get("/multa/eliminar/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await multaModel.eliminar(id);
    res.redirect("/multa-list?msg=" + encodeURIComponent("Multa eliminada correctamente"));
  } catch (err) {
    console.error("Error al eliminar multa:", err.message);

    let msgError = err.message;
    if (err.message.includes("Cannot delete or update a parent row")) {
      msgError = "No se puede eliminar la multa porque está asociada a una factura.";
    }

    const error = encodeURIComponent(msgError);
    res.redirect(`/multa-list?error=${error}`);
  }
});

export default router;
