import { createConnection } from "mysql2/promise"

const newConnection = async () => {

    const connection = await createConnection({
        host: "localhost",
        user: "root",
        database: "db_system", //el nombre de mi base de datos 
        password: ""
    })

    return connection
}

export { newConnection }