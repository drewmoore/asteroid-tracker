const express = require('express');
const routes  = require('./config/routes');
const app     = express();

routes.initialize(app);

const port = (process.env.NODE_ENV === 'test') ? 8080 : 3000;

app.listen(port, function () {
  console.log(`App listening on port ${port}.`);
});

module.exports = app;
