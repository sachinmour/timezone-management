const dotenv = require('dotenv');
dotenv.config({ silent: true });

import http from 'http';
import mongoose from 'mongoose';
import express from 'express';
import helment from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';

const serverRoutes = require('./server/routes').default;

mongoose.Promise = global.Promise;
const options = {
    server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
};
mongoose.connect(process.env.MONGODB_URI, options);

const app = express();
app.use(helment()); // security feature

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/client/build')));
}
app.use(bodyParser.json({ limit: '20mb' }));
app.use(
    bodyParser.urlencoded({
        limit: '20mb',
        extended: true
    })
);

const server = http.createServer(app);
if (process.env.NODE_ENV === 'production') {
    const rfs = require('rotating-file-stream');
    const logDirectory = path.join(__dirname, 'log');

    // ensure log directory exists
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

    // create a rotating write stream
    const accessLogStream = rfs('access.log', {
        interval: '1d', // rotate daily
        path: logDirectory
    });

    // setup the logger
    app.use(morgan('combined', { stream: accessLogStream }));
} else {
    app.use(morgan('dev'));
}

serverRoutes(app);

const PORT = process.env.PORT || 3001;
server.listen(PORT, error => {
    if (error) {
        console.error(error);
    } else {
        console.info('==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.', PORT, PORT);
    }
});

export default server;
