import { mockgoose } from './testServer';
import chai from 'chai';
import { values } from 'lodash';
import chaiHttp from 'chai-http';
import User from '../models/user';
import constants from '../helpers/constants';
import { createUserPromise, newUser, newTimezone } from './helpers';

chai.use(chaiHttp);
let { ROLES } = constants;
ROLES = values(ROLES);

function timezoneTests(role, server) {
    describe(`user with role ${role}`, function() {
        let currentUser = {};
        let currentUserToken = '';
        let timezone = {};
        before(function(done) {
            mockgoose.helper.reset();
            const users = [];
            ROLES.forEach(ROLE => users.push(createUserPromise(newUser(ROLE, newTimezone(ROLE)))));
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

        describe('CREATE Timezone', function() {
            it('should be able to create its own timezone', function(done) {
                chai
                    .request(server)
                    .post(`/api/v1/users/${currentUser._id}/timezones`)
                    .set('Authorization', currentUserToken)
                    .send(newTimezone(role))
                    .end(function(err, res) {
                        res.should.have.status(201);
                        res.body.should.be.a('array');
                        res.body.length.should.be.equal(2);
                        timezone = res.body[res.body.length - 1];
                        done();
                    });
            });
        });

        describe('/GET Timezones', function() {
            it('should get its own timezones', function(done) {
                chai
                    .request(server)
                    .get(`/api/v1/users/${currentUser._id}/timezones`)
                    .set('Authorization', currentUserToken)
                    .end(function(err, res) {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.equal(2);
                        done();
                    });
            });
        });

        describe('/PATCH Timezone', function() {
            it('should be able to update its own timezone', function(done) {
                const timezoneName = 'Asia/Kolkata';
                chai
                    .request(server)
                    .patch(`/api/v1/users/${currentUser._id}/timezones/${timezone._id}`)
                    .set('Authorization', currentUserToken)
                    .send({ name: timezoneName })
                    .end(function(err, res) {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.name.should.be.equal(timezoneName);
                        done();
                    });
            });
        });

        describe('/GET Timezones', function() {
            it('should get all timezones', function(done) {
                User.findOne({ _id: { $ne: currentUser._id } }).exec((err, user) => {
                    chai
                        .request(server)
                        .get(`/api/v1/users/${user._id}/timezones`)
                        .set('Authorization', currentUserToken)
                        .end(function(err, res) {
                            switch (currentUser.role) {
                                case 'user':
                                case 'manager':
                                    res.should.have.status(401);
                                    done();
                                    break;
                                default:
                                    res.should.have.status(200);
                                    res.body.should.be.a('array');
                                    done();
                            }
                        });
                });
            });
        });

        describe('/POST Timezone', function() {
            it('should be able to create a timezone', function(done) {
                const newTimezone = {
                    name: `new ${role}`,
                    timezone: 'Asia/Kolkata'
                };
                User.findOne({ _id: { $ne: currentUser._id } }).exec((err, user) => {
                    chai
                        .request(server)
                        .post(`/api/v1/users/${user._id}/timezones`)
                        .set('Authorization', currentUserToken)
                        .send(newTimezone)
                        .end(function(err, res) {
                            switch (currentUser.role) {
                                case 'user':
                                case 'manager':
                                    res.should.have.status(401);
                                    done();
                                    break;
                                default:
                                    res.should.have.status(201);
                                    res.body.should.be.a('array');
                                    res.body[res.body.length - 1].name.should.be.equal(newTimezone.name);
                                    done();
                            }
                        });
                });
            });
        });

        describe('/PATCH Timezone', function() {
            it('should be able to update timezone', function(done) {
                User.findOne({ _id: { $ne: currentUser._id } }).exec((err, user) => {
                    const userTimezone = user.timezones[0];
                    const newName = 'updatedName';
                    chai
                        .request(server)
                        .patch(`/api/v1/users/${user._id}/timezones/${userTimezone._id}`)
                        .set('Authorization', currentUserToken)
                        .send({ name: newName })
                        .end(function(err, res) {
                            switch (currentUser.role) {
                                case 'user':
                                case 'manager':
                                    res.should.have.status(401);
                                    done();
                                    break;
                                default:
                                    res.should.have.status(200);
                                    res.body.should.be.a('object');
                                    res.body.name.should.equal(newName);
                                    done();
                            }
                        });
                });
            });
        });

        describe('/DELETE Timezone', function() {
            it('should be able to delete timezone', function(done) {
                User.findOne({ _id: { $ne: currentUser._id } }).exec((err, user) => {
                    const userTimezone = user.timezones[0];
                    chai
                        .request(server)
                        .delete(`/api/v1/users/${user._id}/timezones/${userTimezone._id}`)
                        .set('Authorization', currentUserToken)
                        .end(function(err, res) {
                            switch (currentUser.role) {
                                case 'user':
                                case 'manager':
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

export default timezoneTests;
