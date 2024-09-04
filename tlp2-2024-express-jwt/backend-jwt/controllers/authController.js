import generarJwt from '../helpers/generar-jwt.js';
import { newConnection } from '../db/database.js';

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = newConnection.user.find(
            user => user.username === username && user.password === password
        );

        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const token = await generarJwt(user.id);

        req.session.token = token;

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000
        });

        return res.json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error Inesperado' });
    }
};

export const validateSession = (req, res) => {
    console.log(req.user);
    return res.json({ message: 'Acceso permitido a área protegida', user: req.user });
};

export const logout = (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: 'Error al cerrar sesión' });
            }

            res.clearCookie('authToken');
            return res.json({ message: 'Cierre de sesión exitoso' });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error Inesperado' });
    }
};
