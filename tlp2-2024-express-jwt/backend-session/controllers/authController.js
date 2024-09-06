//importar conexcion a base de datos
import { pool } from "../db/database.js";

//ruta LOGIN (iniciar sesion)
export const postUsersCtrl = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password]
    );
    const rows = result[0]; // O result.rows dependiendo de la estructura.

    // Verifica si el usuario existe
    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const user = rows[0];

    // Aquí deberías comparar el password con el hash almacenado en la base de datos
    // Suponiendo que ya tienes la comparación de contraseñas correcta
    if (password === user.password) {
      req.session.userId = user.id;
      req.session.username = user.username;

      return res.json({
        message: "Inicio de sesión exitoso",
        user: { id: user.id, username: user.username },
      });
    } else {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
//ruta SESSION (obtener los datos de la sesion)
export const getUsersCrlt = async (req, res) => {
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

//ruta CERRAR SESSION
export const postLogOutCtrl = async (req, res) => {
  console.log(req.session);
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error al cerrar la sesión" });
    }
    res.clearCookie("connect.sid"); // Nombre de cookie por defecto para express-session
    return res.json({ message: "Sesión cerrada exitosamente" });
  });
};

//ruta REGISTRARSE

export const registerUsersCtrl = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (rows.length > 0) {
      return res
        .status(409)
        .json({ message: "El nombre de usuario ya está en uso" });
    }

    // Insertar el nuevo usuario en la base de datos
    const [result] = await pool.execute(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password]
    );

    return res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: { id: result.insertId, username },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};