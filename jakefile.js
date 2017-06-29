const fetchNeos = require('./tasks/fetch_neos.js');

// Exit async tasks once all promises are resolved.
jake.addListener('complete', () => process.exit());

// Get recent updates from NASA on NEOs.
desc('Fetch Updated Data on NEOs');
task('fetch_neos', { async: true }, fetchNeos);
