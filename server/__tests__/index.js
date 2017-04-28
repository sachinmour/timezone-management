import chai from 'chai';
import testServer from './testServer';
import userTests from './users';
import timezoneTests from './timezones';
const should = chai.should();

describe('Tests', function() {
    const server = 'http://localhost:3001';
    before(function(done) {
        testServer()
            .then(() => {
                done();
            })
            .catch(err => {
                console.log(err);
                done();
            });
    });

    describe('Users', function() {
        userTests('admin', server);
        userTests('manager', server);
        userTests('user', server);
    });

    describe('Timezones', function() {
        timezoneTests('admin', server);
        timezoneTests('manager', server);
        timezoneTests('user', server);
    });
});
