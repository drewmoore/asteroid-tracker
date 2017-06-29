const fetchNeos = require('./tasks/fetch_neos.js');

// Get recent updates from NASA on NEOs.
desc('Fetch Updated Data on NEOs');
task('fetch_neos', { async: true }, fetchNeos);
