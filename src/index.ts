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

app.listen(CONFIG.web.port, () => {
    console.log(`Listening on port ${CONFIG.web.port}`);
});