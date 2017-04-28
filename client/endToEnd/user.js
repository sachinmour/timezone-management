import { values } from 'lodash';
import { mockgoose } from '../../server/__tests__/testServer';
import constants from '../../server/helpers/constants';
import { createUserPromise, newUser, newTimezone } from '../../server/__tests__/helpers';
let { ROLES } = constants;
ROLES = values(ROLES);

const userTests = (role, nightmare) => {
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
                    .click('button[type="submit"]')
                    .wait('div[value="/"]');
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

            it('should see his own record', async function(done) {
                const body = await nightmare.evaluate(() => document.body.innerText);
                expect(body).toContain(email);
                expect(body).toContain(role);
                done();
            });

            it('should be able to navigate to users if user can', async function(done) {
                const index = await nightmare.evaluate(() => {
                    const buttons = document.querySelectorAll('button');
                    return Array.prototype.findIndex.call(buttons, button => button.innerText.includes('USERS'));
                });
                switch (role) {
                    case 'user':
                        expect(index).toEqual(-1);
                        done();
                        break;
                    default:
                        await nightmare.mouseup(`button:nth-child(${index + 1}) div`).wait(1000);
                        const body = await nightmare.evaluate(() => document.body.innerText);
                        expect(body).toContain(email);
                        expect(body).toContain(role);
                        expect(body).toContain('manager@manager.com');
                        expect(body).toContain('manager');
                        expect(body).toContain('user@user.com');
                        expect(body).toContain('user');
                        done();
                }
            });

            it('should be able to edit itself', async function(done) {
                const newEmail = `${role}@${role}.comm`;
                const homeIndex = await nightmare.evaluate(() => {
                    const buttons = document.querySelectorAll('button');
                    return Array.prototype.findIndex.call(buttons, button => button.innerText.includes('HOME'));
                });
                await nightmare.mouseup(`button:nth-child(${homeIndex + 1}) div`).wait(1000);
                await nightmare.click('.EditUser button div').wait('input[type="email"]').insert('input[type="email"]', 'm');
                await nightmare.mouseup('.UserEditor-Success button div').evaluate(done => {
                    const intervalCheck = setInterval(
                        () => {
                            const repeat = document.querySelector('input[type="email"]');
                            if (!repeat) {
                                clearInterval(intervalCheck);
                                done();
                            }
                        },
                        500
                    );
                });
                const body = await nightmare.evaluate(() => document.body.innerText);
                expect(body).toContain(newEmail);
                done();
            });

            it('should be able to create new user if applicable', async function(done) {
                if (role === 'user') return done();
                const newEmail = `${role}2@${role}.com`;
                const newPassword = role;
                const homeIndex = await nightmare.evaluate(() => {
                    const buttons = document.querySelectorAll('button');
                    return Array.prototype.findIndex.call(buttons, button => button.innerText.includes('HOME'));
                });
                await nightmare.mouseup(`button:nth-child(${homeIndex + 1}) div`).wait(1000);
                await nightmare
                    .click('.AddUser button div')
                    .wait('input[type="email"]')
                    .insert('input[type="email"]', newEmail)
                    .insert('input[type="password"]', newPassword)
                    .mouseup('div[name="role"] button div')
                    .mouseup('span[role="menuitem"]');
                await nightmare.mouseup('.UserEditor-Success button div').evaluate(done => {
                    const intervalCheck = setInterval(
                        () => {
                            const repeat = document.querySelector('input[type="email"]');
                            if (!repeat) {
                                clearInterval(intervalCheck);
                                done();
                            }
                        },
                        500
                    );
                });
                const usersIndex = await nightmare.evaluate(() => {
                    const buttons = document.querySelectorAll('button');
                    return Array.prototype.findIndex.call(buttons, button => button.innerText.includes('USERS'));
                });
                await nightmare.mouseup(`button:nth-child(${usersIndex + 1}) div`).wait(1000);
                const body = await nightmare.evaluate(() => document.body.innerText);
                expect(body).toContain(newEmail);
                done();
            });

            it('should be able to edit other people if applicable', async function(done) {
                if (role === 'user') return done();
                const newEmail = `user@user.comm`;
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
                    .click(`.User:nth-child(${userIndex + 1}) .EditUser button div`)
                    .wait('input[type="email"]')
                    .insert('input[type="email"]', 'm');
                await nightmare.mouseup('.UserEditor-Success button div').evaluate(done => {
                    const intervalCheck = setInterval(
                        () => {
                            const repeat = document.querySelector('input[type="email"]');
                            if (!repeat) {
                                clearInterval(intervalCheck);
                                done();
                            }
                        },
                        500
                    );
                });
                const body = await nightmare.evaluate(() => document.body.innerText);
                expect(body).toContain(newEmail);
                done();
            });

            it('should be able to delete other people if applicable', async function(done) {
                if (role === 'user') return done();
                const deleteEmail = `user@user.comm`;
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
                await nightmare.click(`.User:nth-child(${userIndex + 1}) .DeleteUser button div`).wait('.DeleteUserClick');
                await nightmare.mouseup('.DeleteUserClick button div').evaluate(done => {
                    const intervalCheck = setInterval(
                        () => {
                            const repeat = document.querySelector('.DeleteUserClick');
                            if (!repeat) {
                                clearInterval(intervalCheck);
                                done();
                            }
                        },
                        500
                    );
                });
                const body = await nightmare.evaluate(() => document.body.innerText);
                expect(body).not.toContain(deleteEmail);
                done();
            });
        });
    });
};

export default userTests;
