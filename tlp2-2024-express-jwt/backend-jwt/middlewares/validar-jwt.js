import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../setting/config.js';
import { pool } from '../db/database.js';

export default async (req, res, next) => {
    console.log(req.session);
    console.log('-----------');
    console.log(req.cookies);

    const token = req.cookies.authToken || req.session.token;

    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [decoded.userId]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        req.user = rows[0]; // Agrega la información del usuario decodificada al request

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Token inválido' });
    }
};
