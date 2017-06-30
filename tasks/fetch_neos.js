const Nasa = require('../services/nasa');
const Neo  = require('../models/neo');

const errorHandler = (error, complete) => {
  console.log('\n ', error, '\n\n');
  complete();
};

// Fetch recent NEO data from NASA and persist to db. Use the 'upsert' method
// to conditionally update an existing record or to insert a new one.
task('fetch_neos', { async: true }, () => {
  Nasa.fetchUpdatedNeos().then(results => {
    console.log(`\n${results.element_count} records have been retrieved from NASA.`);
    Neo.bulkUpsertFromNasa(results.near_earth_objects).then(result => {
      console.log(`${result.nUpserted} records have been upserted.`);
      complete();
    }).catch(error => errorHandler(error, complete));
  }).catch(error => errorHandler(error, complete));
});
