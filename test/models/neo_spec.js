const expect = require('chai').expect;
const fs     = require('fs');
const path   = require('path');
const db     = require('../../config/mongoose').connection.db;
const Neo    = require('../../models/neo');

describe('Neo', () => {
  beforeEach((done) => {
    // Drop the database before each test to clear test data.
    db.dropDatabase().then(() => done());
  });

  afterEach((done) => {
    // Drop the database after each test to clear test data.
    db.dropDatabase().then(() => done());
  });

  describe('Save', () => {
    let neo;

    beforeEach((done) => {
      neo = new Neo({
        date:        '2017-06-28',
        reference:   2066253,
        name:        '66253 (1999 GT3)',
        speed:       '131032.031061803',
        isHazardous: false
      });
      neo.save().then(() => done());
    });

    it('successfully saves', () => (
      expect(neo._id).to.exist
    ));

    it('calls back with errors on validation failures', (done) => {
      const badRecord = {
        date:        null,
        reference:   null,
        name:        null,
        speed:       null,
        isHazardous: null
      };
      neo.set(badRecord);
      neo.save(error => {
        expect(error.errors).to.have.keys(Object.keys(badRecord));
        done();
      });
    });
  });

  describe('Bulk Upsert From Nasa', () => {
    let apiNeos;
    let result;

    beforeEach(done => {
      // Read a response body from a NASA API response written to disk.
      const sampleResponsePath = fs.readFileSync(
        path.join(__dirname, '..', 'sample_responses', 'nasa_feed.json')
      );
      apiNeos = JSON.parse(sampleResponsePath, 'utf8').near_earth_objects;
      Neo.bulkUpsertFromNasa(apiNeos).then(res => {
        result = res;
        done();
      }).catch((error) => done(error));
    });

    it('creates new neo records for each received from NASA', () => {
      // Extract the records expected to be saved from API stub. Check that
      // each of these is written to db.
      const apiNeosReduced = Object.keys(apiNeos).reduce((accumulator, date) => {
        return accumulator.concat(apiNeos[date]);
      }, []);
      expect(result.nUpserted).to.equal(apiNeosReduced.length);
    });
  });
});
