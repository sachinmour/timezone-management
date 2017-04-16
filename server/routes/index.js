import path from 'path';
import express from 'express';
import userRoutes from './user';
import authRoutes from './auth';
import timezoneRoutes from './timezone';

export default app => {
    const v1 = express.Router();

    authRoutes(app);
    userRoutes(v1);
    timezoneRoutes(v1);

    app.use('/api/v1', v1);

    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/build/index.html'));
    });
};
