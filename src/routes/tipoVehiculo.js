import { Router } from "express";
import { TipoVehiculoModel } from "../models/tipoVehiculoModel.js";

const router = Router();


router.get("/tipos-vehiculo", (req, res) => {
  const redirectTo = req.query.redirect || "";

  res.render("tipo-vehiculo", {
    title: "Registrar tipo de vehículo",
    tipo: {},
    error: null,
    redirectTo
  });
});


router.get("/tipos-vehiculo/lista", async (req, res) => {
  const tipos = await TipoVehiculoModel.obtenerTodos();

  res.render("tipos-vehiculo-list", {
    title: "Tipos de vehículo",
    tipos,
    error: req.query.error || null,
    msg: req.query.msg || null
  });
});

router.post("/tipo-vehiculo/agregar", async (req, res) => {
  const redirectTo = req.body.redirectTo || "";

  try {
    await TipoVehiculoModel.crear(req.body);

    if (redirectTo) {
      return res.redirect(redirectTo);
    }

    res.redirect(
      "/tipos-vehiculo/lista?msg=" +
        encodeURIComponent("Tipo de vehículo registrado correctamente")
    );
  } catch (err) {
    res.render("tipo-vehiculo", {
      title: "Registrar tipo de vehículo",
      tipo: req.body,
      error: err.message,
      redirectTo
    });
  }
});

router.get("/tipo-vehiculo/editar/:id", async (req, res) => {
  const tipo = await TipoVehiculoModel.obtenerPorId(req.params.id);

  if (!tipo) {
    return res.redirect(
      "/tipos-vehiculo/lista?error=" +
        encodeURIComponent("Tipo de vehículo no encontrado.")
    );
  }

  res.render("tipo-vehiculo", {
    title: "Editar tipo de vehículo",
    tipo,
    error: null,
    redirectTo: ""
  });
});

router.post("/tipo-vehiculo/editar/:id", async (req, res) => {
  try {
    await TipoVehiculoModel.actualizar(req.params.id, req.body);
    res.redirect(
      "/tipos-vehiculo/lista?msg=" +
        encodeURIComponent("Tipo de vehículo actualizado correctamente")
    );
  } catch (err) {
    const tipo = await TipoVehiculoModel.obtenerPorId(req.params.id);

    res.render("tipo-vehiculo", {
      title: "Editar tipo de vehículo",
      tipo,
      error: err.message,
      redirectTo: ""
    });
  }
});

router.get("/tipo-vehiculo/eliminar/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await TipoVehiculoModel.eliminar(id);
    res.redirect(
      "/tipos-vehiculo/lista?msg=" +
        encodeURIComponent("Tipo de vehículo eliminado correctamente")
    );
  } catch (err) {
    console.error("Error al eliminar tipo de vehículo:", err.message);

    let msgError = err.message;
    if (err.message.includes("Cannot delete or update a parent row")) {
      msgError =
        "No se puede eliminar el tipo de vehículo porque está asociado a vehículos.";
    }

    const error = encodeURIComponent(msgError);
    res.redirect(`/tipos-vehiculo/lista?error=${error}`);
  }
});

export default router;
