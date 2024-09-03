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


export const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Crear una nueva conexión a la base de datos
        const connection = await newConnection();

        // Verificar si el usuario ya existe
        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length > 0) {
            return res.status(409).json({ message: 'El nombre de usuario ya está en uso' });
        }

        // Insertar el nuevo usuario en la base de datos
        const [result] = await connection.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);

        // Cerrar la conexión
        await connection.end();

        return res.status(201).json({ message: 'Usuario registrado exitosamente', user: { id: result.insertId, username } });
    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};
