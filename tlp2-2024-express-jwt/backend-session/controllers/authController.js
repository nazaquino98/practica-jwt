// controllers/authController.js

// Simulación de la base de datos
import { newConnection } from "../db/database.js";

export const login = (req, res) => {
  const { username, password } = req.body;

  // Buscar usuario
  const user = newConnection.user.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    // Guardar información del usuario en la sesión
    req.session.userId = user.id;
    req.session.username = user.username;

    return res.json({
      message: "Inicio de sesión exitoso",
      user: { id: user.id, username: user.username },
    });
  } else {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }
};

export const getSession = (req, res) => {
  if (req.session.userId) {
    return res.json({
      loggedIn: true,
      user: { id: req.session.userId, username: req.session.username },
    });
  } else {
    return res
      .status(401)
      .json({ loggedIn: false, message: "No hay sesión activa" });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error al cerrar la sesión" });
    }
    res.clearCookie("connect.sid"); // Nombre de cookie por defecto para express-session
    return res.json({ message: "Sesión cerrada exitosamente" });
  });
};
