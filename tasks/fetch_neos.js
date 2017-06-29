const Nasa = require('../services/nasa');

task('fetch_neos', { async: true }, () => {
  Nasa.fetchUpdatedNeos().then(results => {
    console.log(`${results.element_count} records have been retrieved from NASA.`);

    // TODO: DB action here:
    
    complete();
  }).catch(error => {
    console.log('\n ', error, '\n\n');
    complete();
  });
});
