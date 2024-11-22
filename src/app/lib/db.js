// lib/db.js
import sql from 'mssql';

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT, 10), // parse the port number
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true, // For Azure SQL
        trustServerCertificate: false,
    },
};

export async function connectToDatabase() {
    try {
        if (!sql.globalConnectionPool) {
            sql.globalConnectionPool = await sql.connect(config);
        }
        return sql.globalConnectionPool;
    } catch (err) {
        throw new Error('Database connection failed: ' + err.message);
    }
}

export async function insertData(query, params) {
    try {
        const pool = await connectToDatabase();
        const request = pool.request();

        for (const key in params) {
            request.input(key, params[key]);
        }

        const result = await request.query(query);
        return result;
    } catch (err) {
        throw new Error('Data insertion failed: ' + err.message);
    }
}

export async function getData(query) {
    try {
        const pool = await connectToDatabase();
        const result = await pool.request().query(query);
        return result.recordset; // Return the fetched data
    } catch (err) {
        throw new Error('Data retrieval failed: ' + err.message);
    }
}

export async function getSingleData(query, params = []) {
    let pool="";
    try {
        pool = await connectToDatabase();
        const request = pool.request();

        // Add parameters to the query
        params.forEach((param, index) => {
            request.input(`param${index}`, param);
        });

        const result = await request.query(query);
        return result.recordset; // Return the fetched data
    } catch (err) {
        throw new Error('Data retrieval failed: ' + err.message);
    } finally {
        // if (pool) {
        //     await pool.close(); // Ensure the connection pool is closed
        // }
    }
}
