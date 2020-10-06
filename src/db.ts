import { Client } from 'pg';
import CONFIG from './config';

const db = new Client(CONFIG.db);
db.connect();

export default db;