import testServer, { mockgoose } from './testServer';
import { values } from 'lodash';
import chai from 'chai';
import chaiHttp from 'chai-http';
import constants from '../helpers/constants';
import User from '../models/user';

const should = chai.should();
chai.use(chaiHttp);
let { ROLES } = constants;
ROLES = values(ROLES);
let server;

const createUserPromise = user => {
    const newUser = new User(user);
    return newUser.save();
};

const newUser = role => ({
    email: `${role}@${role}.com`,
    password: role,
    role
});

describe('Tests', function() {
    before(function(done) {
        testServer()
            .then(newServer => {
                server = newServer;
                done();
            })
            .catch(err => {
                console.log(err);
                done();
            });
    });

    describe('Users', function() {
        userTests('admin');
        userTests('manager');
        userTests('user');
    });
});

function userTests(role) {
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
