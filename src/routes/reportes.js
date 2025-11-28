import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/reportes/ingresos");
});

router.get("/ingresos", async (req, res) => {
  const { inicio, fin } = req.query;
  let datos = [];

  try {
    if (inicio && fin) {
      const [rows] = await db.query("CALL reporte_ingresos_fecha(?, ?)", [
        inicio,
        fin,
      ]);
      datos = rows[0];
    }

    res.render("reportes/ingresos", {
      title: "Reporte de Ingresos por Fecha",
      datos,
      inicio,
      fin,
      paginaActual: "reportes",
    });
  } catch (error) {
    console.error("Error en /reportes/ingresos:", error);
    res.send("Error al cargar el reporte de ingresos.");
  }
});


router.get("/vehiculos", async (req, res) => {
  const { fecha } = req.query;
  let datos = [];

  try {
    if (fecha) {
      const [rows] = await db.query("CALL reporte_ingresos_vehiculos(?)", [
        fecha,
      ]);
      datos = rows[0];
    }

    res.render("reportes/vehiculos", {
      title: "Vehículos ingresados por día",
      datos,
      fecha,
      paginaActual: "reportes",
    });
  } catch (error) {
    console.error("Error en /reportes/vehiculos:", error);
    res.send("Error al cargar el reporte de vehículos.");
  }
});

export default router;