import Nightmare from 'nightmare';
import testServer from '../../server/__tests__/testServer';
window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
import { mockgoose } from '../../server/__tests__/testServer';
import { values } from 'lodash';
import constants from '../../server/helpers/constants';
import User from '../../server/models/user';
import { createUserPromise, newUser } from '../../server/__tests__/helpers';
let { ROLES } = constants;
ROLES = values(ROLES);

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

    describe('Users', function(role = 'admin') {
        describe(`user with role ${role}`, function() {
            const email = `${role}@${role}.com`;
            const password = role;
            beforeAll(function(done) {
                mockgoose.helper.reset();
                const users = [];
                ROLES.forEach(ROLE => users.push(createUserPromise(newUser(ROLE))));
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

            describe('Home Page', function() {
                it('short', function(done) {
                    expect('5').toEqual('5');
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
            });

            //
            // describe('/PATCH Users', function() {
            //     it('should be able to update user', function(done) {
            //         User.findOne({ role: 'manager' }).exec((err, user) => {
            //             const newEmail = 'new@new.com';
            //             chai
            //                 .request(server)
            //                 .patch(`/api/v1/users/${user._id}`)
            //                 .set('Authorization', currentUserToken)
            //                 .send({ email: newEmail })
            //                 .end(function(err, res) {
            //                     switch (currentUser.role) {
            //                         case 'user':
            //                             res.should.have.status(401);
            //                             done();
            //                             break;
            //                         default:
            //                             res.should.have.status(200);
            //                             res.body.should.be.a('object');
            //                             res.body.email.should.equal(newEmail);
            //                             done();
            //                     }
            //                 });
            //         });
            //     });
            // });
            //
            // describe('/DELETE Users', function() {
            //     it('should be able to delete user', function(done) {
            //         User.findOne({ role: 'manager' }).exec((err, user) => {
            //             chai
            //                 .request(server)
            //                 .delete(`/api/v1/users/${user._id}`)
            //                 .set('Authorization', currentUserToken)
            //                 .end(function(err, res) {
            //                     switch (currentUser.role) {
            //                         case 'user':
            //                             res.should.have.status(401);
            //                             done();
            //                             break;
            //                         default:
            //                             res.should.have.status(204);
            //                             done();
            //                     }
            //                 });
            //         });
            //     });
            // });
        });
    });
});
