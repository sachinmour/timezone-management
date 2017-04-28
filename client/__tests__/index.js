import Nightmare from 'nightmare';
import userTests from '../endToEnd/user';
import timezoneTests from '../endToEnd/timezone';
import testServer from '../../server/__tests__/testServer';

describe('Tests', function() {
    const nightmare = Nightmare({ show: true });
    beforeAll(function(done) {
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
        userTests('admin', nightmare);
        userTests('manager', nightmare);
        userTests('user', nightmare);
    });
    describe('Timezones', function() {
        timezoneTests('admin', nightmare);
        timezoneTests('manager', nightmare);
        timezoneTests('user', nightmare);
    });
});
