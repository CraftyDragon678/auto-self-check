import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import setRoute from './routes';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());
app.use(morgan((tokens, req, res) => `${tokens['remote-addr'](req, res)} - [${tokens['date'](req, res)}] ${tokens.method(req, res)} ${decodeURI(tokens.url(req, res)!)} ${tokens.status(req, res)} - ${tokens['response-time'](req, res)} ms`));

setRoute(app);

export default app;