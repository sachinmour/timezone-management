//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
import mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';
export const mockgoose = new Mockgoose(mongoose);

export default () => {
    return new Promise(resolve => {
        mockgoose.prepareStorage().then(() => {
            const server = require('../../server').default;
            resolve(server);
        });
    });
};
