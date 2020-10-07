import dotenv from 'dotenv';
import fs from 'fs'

const env = dotenv.config();
if (!env) throw new Error('No env file found');

export default {
    web: {
        port: Number(process.env.SERVER_PORT),
        httpsOptions: {
            key: fs.readFileSync(process.env.KEY_PATH as string),
            cert: fs.readFileSync(process.env.CERT_PATH as string),
        },
    },
    db: {
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
    },
}