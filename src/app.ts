import express from 'express'
import cors from 'cors';

import CONFIG from './config'
import setRoute from './router'

const app = express()

app.use(express.json());
app.use(cors({ credentials: true }));

app.use((req, res, next) => {
    console.log(req.ip, req.originalUrl);
    next();
})

setRoute(app)

const l = app.listen(CONFIG.port, () => {
    console.log(`Listening on port ${CONFIG.port}`);
    if (process.send) {
        process.send!('ready');
    }
});

process.on('SIGINT', () => {
    l.close(() => {
        console.log('Recieved SIGINT');
        process.exit(0);
    });
});
