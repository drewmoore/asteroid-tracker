// Test the module for handling requests with NASA's API.
const expect = require('chai').expect;
const moment = require('moment-range').extendMoment(require('moment'));
const Nasa   = require('../../services/nasa');

describe('Nasa', () => {
  describe('Fetch Updated Neos', () => {
    let results;

    beforeEach(done => {
      Nasa.fetchUpdatedNeos().then(json => { results = json; done(); });
    });

    it('should only feature neos with updates in the past few days', () => {
      const range = moment.range(Nasa.neoUpdateEarliestDate, moment(Date.now()));
      Object.keys(results.near_earth_objects).forEach(date => (
        expect(moment(date).within(range)).to.be.true
      ));
    });
  });
});
