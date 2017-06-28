const chai     = require('chai');
const chaiHttp = require('chai-http');
const app      = require('../../app');
const expect   = chai.expect;

chai.use(chaiHttp);

describe('Home Controller', () => {
  it('should respond with a hello world', (done) => {
    chai.request(app).get('/').end((err, res) => {
      expect(res.body).to.deep.equal({ hello: 'world' });
      done();
    });
  });
});
