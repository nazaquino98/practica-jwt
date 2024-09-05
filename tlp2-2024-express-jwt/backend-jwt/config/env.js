// Puerto del servidor
export const PORT = process.env.PORT || 4000;

// Configuración de la base de datos
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const DB_NAME = process.env.DB_NAME || 'db_system';

// Clave secreta para EXPRESS-SESSION y JWT
export const SECRET_KEY = process.env.SECRET_KEY || 'aopz9-3f1iw12-4ja94f-6l4jzg8';