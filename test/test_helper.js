global.expect = require('expect.js');
global.request = require('supertest');

// set up the environment to be 'test', this makes sure that only the
// test database is used when running specs
process.env.NODE_ENV = 'test';

// create a test server to use for the duration of the tests
var app = require('../app');
app.set('port', 3001);

global.models = require('../models');
global.server = null;

before(function(done) {
  require('../server')(app, function(s) {
    global.server = s;
    done();
  });
});
