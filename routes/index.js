const homeController = require('../controllers/home');

module.exports = {
  initialize: (app) => {
    app.get('/', homeController.index);
  }
};
