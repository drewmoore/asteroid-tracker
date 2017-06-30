class HomeController {
  static index(_request, response) {
    response.json({ hello: 'world' });
  }
}

module.exports = HomeController;
