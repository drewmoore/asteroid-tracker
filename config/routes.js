const HomeController = require('../controllers/home');
const NeosController = require('../controllers/neos');

module.exports = {
  initialize: (app) => {
    app.get('/', HomeController.index);

    app.get('/neo/hazardous',  NeosController.hazardous);
    app.get('/neo/fastest',    NeosController.fastest);
    app.get('/neo/best-year',  NeosController.bestYear);
    app.get('/neo/best-month', NeosController.bestMonth);
  }
};
