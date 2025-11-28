import { Router } from "express";
import { VehiculoModel } from "../models/vehiculoModel.js";
import { ClienteModel } from "../models/clienteModel.js";
import { TipoVehiculoModel } from "../models/tipoVehiculoModel.js";

const router = Router();

router.get("/vehiculos", async (req, res) => {
  const [clientes, tiposVehiculo] = await Promise.all([
    ClienteModel.obtenerTodos(),
    TipoVehiculoModel.obtenerTodos()
  ]);

  res.render("vehiculo", {
    title: "Registrar Vehículo",
    vehiculo: {},
    datos: {},
    error: null,
    clientes,
    tiposVehiculo
  });
});

router.get("/vehiculos/lista", async (req, res) => {
  const listaVehiculos = await VehiculoModel.obtenerTodos();

  res.render("vehiculos-list", {
    title: "Vehículos registrados",
    vehiculos: listaVehiculos,
    error: req.query.error || null,
    msg: req.query.msg || null
  });
});

router.post("/vehiculo/agregar", async (req, res) => {
  try {
    await VehiculoModel.crear(req.body);
    res.redirect(
      "/vehiculos/lista?msg=" +
        encodeURIComponent("Vehículo registrado correctamente")
    );
  } catch (err) {
    const [clientes, tiposVehiculo] = await Promise.all([
      ClienteModel.obtenerTodos(),
      TipoVehiculoModel.obtenerTodos()
    ]);

    res.render("vehiculo", {
      title: "Registrar Vehículo",
      vehiculo: {},
      datos: req.body,
      error: err.message,
      clientes,
      tiposVehiculo
    });
  }
});

router.get("/vehiculo/editar/:id", async (req, res) => {
  const vehiculo = await VehiculoModel.obtenerPorId(req.params.id);

  const [clientes, tiposVehiculo] = await Promise.all([
    ClienteModel.obtenerTodos(),
    TipoVehiculoModel.obtenerTodos()
  ]);

  res.render("vehiculo", {
    title: "Editar Vehículo",
    vehiculo,
    datos: vehiculo,
    error: null,
    clientes,
    tiposVehiculo
  });
});

router.post("/vehiculo/editar/:id", async (req, res) => {
  const id = req.params.id;
  const { color, marca, matricula, modelo, id_cliente, id_tipo_vehiculo } =
    req.body;

  try {
    await VehiculoModel.actualizar(id, {
      color,
      marca,
      matricula,
      modelo,
      id_cliente,
      id_tipo_vehiculo
    });

    res.redirect(
      "/vehiculos/lista?msg=" +
        encodeURIComponent("Vehículo actualizado correctamente")
    );
  } catch (err) {
    const vehiculo = await VehiculoModel.obtenerPorId(id);
    const [clientes, tiposVehiculo] = await Promise.all([
      ClienteModel.obtenerTodos(),
      TipoVehiculoModel.obtenerTodos()
    ]);

    res.render("vehiculo", {
      title: "Editar Vehículo",
      vehiculo,
      datos: req.body,
      error: err.message,
      clientes,
      tiposVehiculo
    });
  }
});

router.get("/vehiculo/eliminar/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await VehiculoModel.eliminar(id);
    res.redirect(
      "/vehiculos/lista?msg=" +
        encodeURIComponent("Vehículo eliminado correctamente")
    );
  } catch (err) {
    console.error("Error al eliminar vehículo:", err.message);

    let msgError = err.message;
    if (err.message.includes("Cannot delete or update a parent row")) {
      msgError =
        "No se puede eliminar el vehículo porque está asociado a registros o facturas.";
    }

    const error = encodeURIComponent(msgError);
    res.redirect(`/vehiculos/lista?error=${error}`);
  }
});

export default router;
