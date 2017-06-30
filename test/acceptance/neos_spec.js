/* jshint expr:true */ // Ignore chai syntax.
const chai            = require('chai');
const chaiHttp        = require('chai-http');
const app             = require('../../app');
const db              = require('../../config/mongoose').connection.db;
const seedDbWithNeos  = require('../helpers').seedDbWithNeos;
const bestTimeForNeos = require('../helpers').bestTimeForNeos;
const Neo             = require('../../models/neo');
const expect          = chai.expect;
chai.use(chaiHttp);

describe('NeosController', () => {
  beforeEach((done) => {
    // Drop the database before each test to clear test data.
    db.dropDatabase().then(() => {
      seedDbWithNeos().then(() => done());
    });
  });

  afterEach((done) => {
    // Drop the database after each test to clear test data.
    db.dropDatabase().then(() => done());
  });

  describe('/neo/hazardous', () => {
    let response;

    beforeEach(done => {
      chai.request(app).get('/neo/hazardous').end((_err, res) => {
        response = res;
        done();
      });
    });

    it('should respond with a success status', () => {
      expect(response).to.have.status(200);
    });

    it('should respond in json', () => {
      expect(response).to.be.json;
    });

    it('should respond with records of neos', () => {
      expect(response.body.neos).to.not.be.empty;
    });

    it('should respond with all hazardous neos', () => {
      expect(response.body.neos.filter(neo => !neo.isHazardous)).to.be.empty;
    });
  });

  describe('/neo/fastest', () => {
    describe('Defaults with no Params', () => {
      let response;

      beforeEach(done => {
        chai.request(app).get('/neo/fastest').end((_err, res) => {
          response = res;
          done();
        });
      });

      it('should respond with a success status', () => {
        expect(response).to.have.status(200);
      });

      it('should respond with a non-hazardous neo', () => {
        expect(response.body.neo.isHazardous).to.be.false;
      });

      it('should respond with the fastest neo', (done) => {
        Neo.find({ isHazardous: false }).then(neos => {
          const fastest = neos.sort((next, current) => (
            parseInt(current.speed) > parseInt(next.speed)
          ))[0];
          expect(response.body.neo.speed).to.equal(fastest.speed);
          done();
        }).catch(error => done(error));
      });
    });

    describe('Hazardous Param is True', () => {
      let response;

      beforeEach(done => {
        chai.request(app).get('/neo/fastest?hazardous=true').end((_err, res) => {
          response = res;
          done();
        });
      });

      it('should respond with a success status', () => {
        expect(response).to.have.status(200);
      });

      it('should respond with a hazardous neo', () => {
        expect(response.body.neo.isHazardous).to.be.true;
      });

      it('should respond with the fastest neo', (done) => {
        Neo.find({ isHazardous: true }).then(neos => {
          const fastest = neos.sort((next, current) => (
            parseInt(current.speed) > parseInt(next.speed)
          ))[0];
          expect(response.body.neo.speed).to.equal(fastest.speed);
          done();
        }).catch(error => done(error));
      });
    });
  });

  describe('/neo/best-year', () => {
    describe('Defaults with no Params', () => {
      let response;

      beforeEach(done => {
        chai.request(app).get('/neo/best-year').end((_err, res) => {
          response = res;
          done();
        });
      });

      it('should respond with a success status', () => {
        expect(response).to.have.status(200);
      });

      it('should respond with the year of the most non-hazardous neos', (done) => {
        bestTimeForNeos({ isHazardous: false }).then(bestYear => {
          expect(response.body.year).to.equal(bestYear);
          done();
        }).catch(error => done(error));
      });
    });

    describe('?hazardous=true', () => {
      let response;

      beforeEach(done => {
        chai.request(app).get('/neo/best-year?hazardous=true').end((_err, res) => {
          response = res;
          done();
        });
      });

      it('should respond with a success status', () => {
        expect(response).to.have.status(200);
      });

      it('should respond with the year of the most hazardous neos', (done) => {
        bestTimeForNeos({ isHazardous: true }).then(bestYear => {
          expect(response.body.year).to.equal(bestYear);
          done();
        }).catch(error => done(error));
      });
    });
  });


  describe('/neo/best-month', () => {
    describe('Defaults with no Params', () => {
      let response;

      beforeEach(done => {
        chai.request(app).get('/neo/best-month').end((_err, res) => {
          response = res;
          done();
        });
      });

      it('should respond with a success status', () => {
        expect(response).to.have.status(200);
      });

      it('should respond with the month of the most non-hazardous neos', (done) => {
        bestTimeForNeos({ isHazardous: false, timeFrame: 'month' }).then(bestMonth => {
          expect(response.body.month).to.equal(bestMonth);
          done();
        }).catch(error => done(error));
      });
    });

    describe('?hazardous=true', () => {
      let response;

      beforeEach(done => {
        chai.request(app).get('/neo/best-month?hazardous=true').end((_err, res) => {
          response = res;
          done();
        });
      });

      it('should respond with a success status', () => {
        expect(response).to.have.status(200);
      });

      it('should respond with the month of the most hazardous neos', (done) => {
        bestTimeForNeos({ isHazardous: true, timeFrame: 'month' }).then(bestMonth => {
          expect(response.body.month).to.equal(bestMonth);
          done();
        }).catch(error => done(error));
      });
    });
  });
});
