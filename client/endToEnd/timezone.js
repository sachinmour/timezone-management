import { values } from 'lodash';
import { mockgoose } from '../../server/__tests__/testServer';
import constants from '../../server/helpers/constants';
import { createUserPromise, newUser, newTimezone } from '../../server/__tests__/helpers';
let { ROLES } = constants;
ROLES = values(ROLES);

const timezoneTests = (role, nightmare) => {
    describe(`user with role ${role}`, function() {
        const email = `${role}@${role}.com`;
        const password = role;
        beforeAll(function(done) {
            mockgoose.helper.reset();
            const users = [];
            ROLES.forEach(ROLE => users.push(createUserPromise(newUser(ROLE, newTimezone(ROLE)))));
            Promise.all(users).then(async function() {
                await nightmare.goto('http://localhost:3001/logout').evaluate(() => localStorage.clear());
                await nightmare
                    .goto('http://localhost:3001/login')
                    .insert('input[type="email"]', email)
                    .insert('input[type="password"]', password)
                    .click('button[type="submit"]');
                done();
            });
        });

        describe('tests', function() {
            beforeEach(function(done) {
                window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
                done();
            });
            it('should have toolbar with navigation buttons', async function(done) {
                const homeButton = await nightmare
                    .wait('div[value="/"]')
                    .evaluate(() => document.querySelector('div[value="/"]').innerText);
                expect(homeButton).toContain('HOME');
                if (role !== 'user') {
                    expect(homeButton).toContain('USERS');
                }
                done();
            });

            it('should see be able to create its own timezones', async function(done) {
                const homeIndex = await nightmare.evaluate(() => {
                    const buttons = document.querySelectorAll('button');
                    return Array.prototype.findIndex.call(buttons, button => button.innerText.includes('HOME'));
                });
                await nightmare.mouseup(`button:nth-child(${homeIndex + 1}) div`).wait(1000);
                await nightmare.mouseup('.User button svg').wait(1000);
                await nightmare.click('.AddTimezone button div div').wait('input[name="name"]');
                await nightmare.insert('input[name="name"]', role);
                await nightmare.type('input[type="text"]:nth-child(2)', 'Europe/Berlin').type('input[type="text"]:nth-child(2)', '\u000d');
                await nightmare.mouseup('.TimezoneEditor-Success button div').evaluate(done => {
                    const intervalCheck = setInterval(
                        () => {
                            const repeat = document.querySelector('input[name="name"]');
                            if (!repeat) {
                                clearInterval(intervalCheck);
                                done();
                            }
                        },
                        500
                    );
                });
                const numTimezones = await nightmare.evaluate(() => document.querySelectorAll('table tbody tr').length);
                expect(numTimezones).toEqual(2);
                done();
            });

            it("should be able to edit it's own timezone", async function(done) {
                const newName = `${role}New`;
                const homeIndex = await nightmare.evaluate(() => {
                    const buttons = document.querySelectorAll('button');
                    return Array.prototype.findIndex.call(buttons, button => button.innerText.includes('HOME'));
                });
                await nightmare.mouseup(`button:nth-child(${homeIndex + 1}) div`).wait(1000);
                await nightmare
                    .click('.User tbody tr:nth-child(1) div:nth-child(1) button:nth-child(1) div div')
                    .wait('input[name="name"]');
                await nightmare.insert('input[name="name"]', 'New');
                await nightmare.mouseup('.TimezoneEditor-Success button div').evaluate(done => {
                    const intervalCheck = setInterval(
                        () => {
                            const repeat = document.querySelector('input[name="name"]');
                            if (!repeat) {
                                clearInterval(intervalCheck);
                                done();
                            }
                        },
                        500
                    );
                });
                const numTimezones = await nightmare.evaluate(() => document.querySelectorAll('table tbody tr').length);
                expect(numTimezones).toEqual(2);
                const timezone = await nightmare.evaluate(() => document.querySelector('table tbody tr:nth-child(1)').innerText);
                expect(timezone).toContain(newName);
                done();
            });

            it("should be able to delete it's own timezone", async function(done) {
                const homeIndex = await nightmare.evaluate(() => {
                    const buttons = document.querySelectorAll('button');
                    return Array.prototype.findIndex.call(buttons, button => button.innerText.includes('HOME'));
                });
                await nightmare.mouseup(`button:nth-child(${homeIndex + 1}) div`).wait(1000);
                await nightmare
                    .click('.User tbody tr:nth-child(1) div:nth-child(2) button:nth-child(1) div div')
                    .wait('.DeleteTimezoneClick');
                await nightmare.mouseup('.DeleteTimezoneClick button div').evaluate(done => {
                    const intervalCheck = setInterval(
                        () => {
                            const repeat = document.querySelector('.DeleteTimezoneClick');
                            if (!repeat) {
                                clearInterval(intervalCheck);
                                done();
                            }
                        },
                        500
                    );
                });
                const numTimezones = await nightmare.evaluate(() => document.querySelectorAll('table tbody tr').length);
                expect(numTimezones).toEqual(1);
                done();
            });

            it('should be able to create new timezone if applicable', async function(done) {
                if (role === 'user' || role === 'manager') return done();
                const newName = `${role}2`;
                const newTimezone = 'Asia/Kolkata';
                const homeIndex = await nightmare.evaluate(() => {
                    const buttons = document.querySelectorAll('button');
                    return Array.prototype.findIndex.call(buttons, button => button.innerText.includes('USERS'));
                });
                await nightmare.mouseup(`button:nth-child(${homeIndex + 1}) div`).wait(1000);
                const userIndex = await nightmare.evaluate(() => {
                    const users = document.querySelectorAll('.User');
                    return Array.prototype.findIndex.call(users, user => user.innerText.includes('user@user.com'));
                });
                await nightmare.mouseup(`.User:nth-child(${userIndex + 1}) button svg`).wait(1000);
                await nightmare.click(`.User:nth-child(${userIndex + 1}) .AddTimezone button div div`).wait('input[name="name"]');
                await nightmare.insert('input[name="name"]', newName);
                await nightmare.type('input[type="text"]:nth-child(2)', newTimezone).type('input[type="text"]:nth-child(2)', '\u000d');
                await nightmare.mouseup('.TimezoneEditor-Success button div').evaluate(done => {
                    const intervalCheck = setInterval(
                        () => {
                            const repeat = document.querySelector('input[name="name"]');
                            if (!repeat) {
                                clearInterval(intervalCheck);
                                done();
                            }
                        },
                        500
                    );
                });
                const numTimezones = await nightmare.evaluate(
                    userIndex => document.querySelectorAll(`.User:nth-child(${userIndex + 1}) table tbody tr`).length,
                    userIndex
                );
                expect(numTimezones).toEqual(2);
                done();
            });

            it('should be able to edit other people timezone if applicable', async function(done) {
                if (role === 'user' || role === 'manager') return done();
                const newName = 'admin3';
                const homeIndex = await nightmare.evaluate(() => {
                    const buttons = document.querySelectorAll('button');
                    return Array.prototype.findIndex.call(buttons, button => button.innerText.includes('USERS'));
                });
                await nightmare.mouseup(`button:nth-child(${homeIndex + 1}) div`).wait(1000);
                const userIndex = await nightmare.evaluate(() => {
                    const users = document.querySelectorAll('.User');
                    return Array.prototype.findIndex.call(users, user => user.innerText.includes('user@user.com'));
                });
                await nightmare
                    .click(`.User:nth-child(${userIndex + 1}) tbody tr:nth-child(1) div:nth-child(1) button:nth-child(1) div div`)
                    .wait('input[name="name"]');
                await nightmare.insert('input[name="name"]', false);
                await nightmare.insert('input[name="name"]', newName);
                await nightmare.mouseup('.TimezoneEditor-Success button div').evaluate(done => {
                    const intervalCheck = setInterval(
                        () => {
                            const repeat = document.querySelector('input[name="name"]');
                            if (!repeat) {
                                clearInterval(intervalCheck);
                                done();
                            }
                        },
                        500
                    );
                });
                const numTimezones = await nightmare.evaluate(
                    userIndex => document.querySelectorAll(`.User:nth-child(${userIndex + 1}) table tbody tr`).length,
                    userIndex
                );
                expect(numTimezones).toEqual(2);
                const timezone = await nightmare.evaluate(
                    userIndex => document.querySelector(`.User:nth-child(${userIndex + 1}) table tbody tr:nth-child(1)`).innerText,
                    userIndex
                );
                expect(timezone).toContain(newName);
                done();
            });

            it('should be able to delete other people timezone if applicable', async function(done) {
                if (role === 'user' || role === 'manager') return done();
                const deleteEmail = `user@user.com`;
                const homeIndex = await nightmare.evaluate(() => {
                    const buttons = document.querySelectorAll('button');
                    return Array.prototype.findIndex.call(buttons, button => button.innerText.includes('USERS'));
                });
                await nightmare.mouseup(`button:nth-child(${homeIndex + 1}) div`).wait(1000);
                const userIndex = await nightmare.evaluate(
                    deleteEmail => {
                        const users = document.querySelectorAll('.User');
                        return Array.prototype.findIndex.call(users, user => user.innerText.includes(deleteEmail));
                    },
                    deleteEmail
                );
                await nightmare
                    .click(`.User:nth-child(${userIndex + 1}) tbody tr:nth-child(1) div:nth-child(2) button:nth-child(1) div div`)
                    .wait('.DeleteTimezoneClick');
                await nightmare.mouseup('.DeleteTimezoneClick button div').evaluate(done => {
                    const intervalCheck = setInterval(
                        () => {
                            const repeat = document.querySelector('.DeleteTimezoneClick');
                            if (!repeat) {
                                clearInterval(intervalCheck);
                                done();
                            }
                        },
                        500
                    );
                });
                const numTimezones = await nightmare.evaluate(
                    userIndex => document.querySelectorAll(`.User:nth-child(${userIndex + 1}) table tbody tr`).length,
                    userIndex
                );
                expect(numTimezones).toEqual(1);
                done();
            });
        });
    });
};

export default timezoneTests;
