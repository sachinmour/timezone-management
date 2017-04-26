import { mockgoose } from './testServer';
import chai from 'chai';
import { values } from 'lodash';
import chaiHttp from 'chai-http';
import constants from '../helpers/constants';
import User from '../models/user';
import { createUserPromise, newUser } from './helpers';

chai.use(chaiHttp);
let { ROLES } = constants;
ROLES = values(ROLES);

function userTests(role, server) {
    describe(`user with role ${role}`, function() {
        let currentUser = {};
        let currentUserToken = '';
        before(function(done) {
            mockgoose.helper.reset();
            const users = [];
            ROLES.forEach(ROLE => users.push(createUserPromise(newUser(ROLE))));
            Promise.all(users).then(() => {
                User.findOne({ role }, (err, user) => {
                    if (!err && user) {
                        currentUser = user;
                        done();
                    }
                });
            });
        });

        describe('/login', function() {
            it('should give you a user token', function(done) {
                chai.request(server).post('/login').send({ email: currentUser.email, password: role }).end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('user');
                    res.body.should.have.property('token');
                    currentUserToken = res.body.token;
                    res.body.user.email.should.equal(currentUser.email);
                    res.body.user.role.should.equal(currentUser.role);
                    done();
                });
            });
        });

        describe('/GET User', function() {
            it('should get its own user', function(done) {
                chai.request(server).get(`/api/v1/users/${currentUser._id}`).set('Authorization', currentUserToken).end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('email');
                    res.body.should.have.property('role');
                    res.body.email.should.equal(currentUser.email);
                    res.body.role.should.equal(currentUser.role);
                    done();
                });
            });
        });

        describe('/PATCH User', function() {
            it('should be able to update its own record', function(done) {
                const password = '55';
                chai
                    .request(server)
                    .patch(`/api/v1/users/${currentUser._id}`)
                    .set('Authorization', currentUserToken)
                    .send({ password })
                    .end(function(err, res) {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        done();
                    });
            });
        });

        describe('/GET Users', function() {
            it('should get all users', function(done) {
                chai.request(server).get('/api/v1/users').set('Authorization', currentUserToken).end(function(err, res) {
                    switch (currentUser.role) {
                        case 'user':
                            res.should.have.status(401);
                            done();
                            break;
                        default:
                            res.should.have.status(200);
                            res.body.should.be.a('array');
                            res.body.should.have.length(3);
                            done();
                    }
                });
            });
        });

        describe('/POST Users', function() {
            it('should be able to create a user', function(done) {
                const user = {
                    email: 'test2@test.com',
                    password: 'test',
                    role: 'manager',
                    login: false
                };
                chai.request(server).post('/api/v1/users').set('Authorization', currentUserToken).send(user).end(function(err, res) {
                    switch (currentUser.role) {
                        case 'user':
                            res.should.have.status(401);
                            done();
                            break;
                        default:
                            res.should.have.status(201);
                            res.body.should.be.a('object');
                            res.body.email.should.equal(user.email);
                            res.body.role.should.equal(user.role);
                            done();
                    }
                });
            });
        });

        describe('/PATCH Users', function() {
            it('should be able to update user', function(done) {
                User.findOne({ role: 'manager' }).exec((err, user) => {
                    const newEmail = 'new@new.com';
                    chai
                        .request(server)
                        .patch(`/api/v1/users/${user._id}`)
                        .set('Authorization', currentUserToken)
                        .send({ email: newEmail })
                        .end(function(err, res) {
                            switch (currentUser.role) {
                                case 'user':
                                    res.should.have.status(401);
                                    done();
                                    break;
                                default:
                                    res.should.have.status(200);
                                    res.body.should.be.a('object');
                                    res.body.email.should.equal(newEmail);
                                    done();
                            }
                        });
                });
            });
        });

        describe('/DELETE Users', function() {
            it('should be able to delete user', function(done) {
                User.findOne({ role: 'manager' }).exec((err, user) => {
                    chai.request(server).delete(`/api/v1/users/${user._id}`).set('Authorization', currentUserToken).end(function(err, res) {
                        switch (currentUser.role) {
                            case 'user':
                                res.should.have.status(401);
                                done();
                                break;
                            default:
                                res.should.have.status(204);
                                done();
                        }
                    });
                });
            });
        });
    });
}

export default userTests;
