import chai from 'chai';
import testServer from './testServer';
import userTests from './users';
import timezoneTests from './timezones';
const should = chai.should();

describe('Tests', function() {
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
        const server = 'http://localhost:3001';
        userTests('admin', server);
        userTests('manager', server);
        userTests('user', server);
        timezoneTests('admin', server);
        timezoneTests('manager', server);
        timezoneTests('user', server);
    });
});
