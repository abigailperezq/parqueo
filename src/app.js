// src/app.js
import express from "express";
import path from "path";
import session from "express-session";
import { fileURLToPath } from "url";

import authRoutes from "./routes/login.js";
import clienteRoutes from "./routes/cliente.js";
import rolRoutes from "./routes/rol.js";
import tipoVehiculoRoutes from "./routes/tipoVehiculo.js";
import vehiculoRoutes from "./routes/vehiculo.js";
import usuarioRoutes from "./routes/usuario.js";
import multaRoutes from "./routes/multa.js";
import espacioRoutes from "./routes/espacio.js";
import registroRoutes from "./routes/registro.js";
import facturaRoutes from "./routes/factura.js";
import reportesRoutes from "./routes/reportes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(
  session({
    secret: "1234",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});

function requireLogin(req, res, next) {
  if (!req.session.usuario) return res.redirect("/login");
  next();
}

function requireRole(rolesPermitidos) {
  const roles = Array.isArray(rolesPermitidos)
    ? rolesPermitidos
    : [rolesPermitidos];

  return (req, res, next) => {
    if (!req.session.usuario) return res.redirect("/login");

    const rolUsuario = req.session.usuario.rol;

    if (!roles.includes(rolUsuario)) {
      return res.status(403).send("Acceso denegado");
    }

    next();
  };
}

app.use(authRoutes);

app.use(requireLogin);
app.get("/", (req, res) => res.redirect("/index"));

app.get("/index", (req, res) => {
  res.render("index", {
    title: "Sistema Parqueo",
    usuario: req.session.usuario,
  });
});

app.get("/admin", requireRole("ADMIN"), (req, res) => {
  res.render("admin");
});

app.use(clienteRoutes);
app.use(rolRoutes);
app.use(tipoVehiculoRoutes);
app.use(vehiculoRoutes);
app.use(multaRoutes);
app.use(usuarioRoutes);
app.use(espacioRoutes);
app.use(registroRoutes);
app.use("/factura", facturaRoutes);
app.use("/reportes", reportesRoutes);

export default app;
