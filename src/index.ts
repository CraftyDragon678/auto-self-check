import https from 'https'

import app from './app'
import db from './db'

import CONFIG from './config';

db.connect(err => {
    if (err) {
        console.log("DB connect Error");
    } else {
        console.log("DB Connected");
    }
});

app.use((req, res, next) => {
    if(!req.secure) {
        res.redirect(`https://n1net4il.kr:${CONFIG.web.port}` + req.originalUrl);
    } else {
        next();
    }
});

https.createServer(CONFIG.web.httpsOptions, app)
    .listen(CONFIG.web.port, () => {
        console.log(`Listening on port ${CONFIG.web.port}`);
    });