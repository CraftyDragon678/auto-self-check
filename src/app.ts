import express from 'express';
import cors from 'cors';

import CONFIG from './config';
import setRoute from './routes';

const app = express();

app.use(express.json());
app.use(cors({ credentials: true }));

app.use((req, res, next) => {
    console.log(req.ip, decodeURI(req.originalUrl));
    next();
});

setRoute(app)

app.listen(CONFIG.web.port, () => {
    console.log(`Listening on port ${CONFIG.web.port}`);
});