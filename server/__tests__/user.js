import testServer, { mockgoose } from './testServer';
import mongoose from 'mongoose';
import User from '../models/user';
import chai from 'chai';
import chaiHttp from 'chai-http';
const should = chai.should();
chai.use(chaiHttp);
let server;

describe('Users', function() {
    const globals = {};
    before(function(done) {
        testServer()
            .then(newServer => {
                server = newServer;
                mockgoose.helper.reset();
                done();
            })
            .catch(err => {
                console.log(err);
            });
    });

    describe('/POST register', function() {
        it('should register a new admin user', function(done) {
            const user = {
                email: 'test@test.com',
                password: 'test',
                role: 'admin'
            };
            chai.request(server).post('/register').send(user).end(function(err, res) {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                res.body.should.have.property('user');
                res.body.user.email.should.equal(user.email);
                res.body.user.role.should.equal(user.role);
                globals.adminUser = res.body;
                done();
            });
        });
    });

    describe('/GET Users', function() {
        it('should get all users', function(done) {
            chai.request(server).get('/api/v1/users').set('Authorization', globals.adminUser.token).end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.should.have.length(1);
                res.body[0].email.should.equal(globals.adminUser.user.email);
                done();
            });
        });
    });
});
