import { Client } from 'pg';
import CONFIG from './config';

export default new Client(CONFIG.db);