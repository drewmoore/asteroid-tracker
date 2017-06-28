const express = require('express');
const routes  = require('./routes/index');
const app     = express();

routes.initialize(app);

const port = (process.env.NODE_ENV === 'test') ? 8080 : 3000;

app.listen(port, function () {
  console.log('App listening on port 3000');
});

module.exports = app;
