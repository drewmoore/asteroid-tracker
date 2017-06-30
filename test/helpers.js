const Neo = require('../models/neo');

// Helpers for running tests.
module.exports = {
  // Create Neo 'fixtures'.
  seedDbWithNeos: () => {
    const bulk = Neo.collection.initializeUnorderedBulkOp();
    [
      // Slowest ones first, to enable testing of sorting for speed.
      {
        reference: '3182172',
        date: new Date('2017-06-27'),
        speed: '28689.8027634334',
        name: '(2004 JQ1)',
        isHazardous: true
      },
      {
        reference: '3182173',
        date: new Date('2017-06-27'),
        speed: '38689.8027634334',
        name: '(2004 JQ2)',
        isHazardous: true
      },
      {
        reference: '3774558',
        date: new Date('2017-07-27'),
        speed: '20678.5737840627',
        name: '(2017 HY51)',
        isHazardous: false
      },
      {
        reference: '3774557',
        date: new Date('2016-06-27'),
        speed: '40794.5737840627',
        name: '(2017 HY50)',
        isHazardous: false
      },
      {
        reference: '3774559',
        date: new Date('2016-04-27'),
        speed: '50794.5737840627',
        name: '(2017 HY52)',
        isHazardous: false
      },
      {
        reference: '2494690',
        date: new Date('2015-04-27'),
        speed: '58689.802742611',
        name: '494690 (2004 JQ1)',
        isHazardous: true
      }
    ].forEach(neo => bulk.insert(neo));
    return bulk.execute();
  },
  // Sort through Neo records to determine what should be the best expected
  // year or month. This deliberatly does not resemble similar server code,
  // which more effectively uses Mongo aggregates.
  bestTimeForNeos: ({ isHazardous, timeFrame }) => {
    return Neo.find({ isHazardous }).then(results => {
      // Create a table for holding counts of neos for given years or months.
      const tallies = results.map(neo => (
        // Determine from arguments if we're scoping to a year or a month.
        // Add 1 to the month, due to js returning months with index 0 (0-11).
        timeFrame === 'month' ? neo.date.getMonth() + 1 : neo.date.getFullYear()
      )).reduce((acc, time) => {
        // Increment the tally of neos for the given month or year.
        // Create a new tally if it does not yet exist.
        acc[time] = (typeof acc[time] === 'undefined' ? 1 : acc[time] + 1);
        return acc;
      }, {});
      // Sort the tallies by the highest count of neos for a given time frame.
      const bestTime = Object.keys(tallies).sort((current, next) => {
        return tallies[next] - tallies[current];
      })[0];
      return new Promise(resolve => resolve(parseInt(bestTime)));
    });
  }
};
