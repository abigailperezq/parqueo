import { Router } from "express";
import usuarioModel from "../models/usuarioModel.js";

const router = Router();

router.get("/login", (req, res) => {
  res.render("login", {
    title: "Iniciar sesión",
    error: null
  });
});

router.post("/login", async (req, res) => {
  const { usuario, clave } = req.body;

  try {
    const user = await usuarioModel.buscarPorUsuario(usuario);

    if (!user || clave !== user.clave) {
      return res.render("login", {
        title: "Iniciar sesión",
        error: "Usuario o contraseña incorrectos"
      });
    }

    req.session.usuario = {
      id: user.id_usuario,
      nombre: user.nombre,
      usuario: user.usuario,
      rol: user.rol
    };

    return res.redirect("/index");  
  } catch (err) {
    console.error(err);
    res.render("login", {
      title: "Iniciar sesión",
      error: "Ocurrió un error, intenta de nuevo."
    });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);

      return res.redirect("/index");
    }
    res.clearCookie("connect.sid");
    return res.redirect("/login");
  });
});

export default router;
