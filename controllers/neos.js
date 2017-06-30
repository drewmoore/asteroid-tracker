const Neo = require('../models/neo');

// Rudimentary input filtering.
const neoParams = request => (
  // Determine 'hazardous' scope from query. Do not send param value
  // directly to db, but set isHazardous explicitly if requested.
  {
    hazardous: (request.query.hazardous === 'true') ? true : false
  }
);

class NeosController {
  static hazardous(_request, response) {
    Neo.find({ isHazardous: true })
      .then(neos => response.json({ neos }))
      .catch(error => response.json({ error }));
  }

  static fastest(request, response) {
    Neo.find({ isHazardous: neoParams(request).hazardous }).sort({ speed: -1 })
      .then(neos => response.json({ neo: neos[0] }))
      .catch(error => response.json({ error }));
  }

  static bestYear(request, response) {
    Neo.bestTimeFrame({
      isHazardous: neoParams(request).hazardous, timeFrame: 'year'
    }).then(results => {
      response.json({ year: results[0]._id });
    }).catch(error => response.json({ error }));
  }

  static bestMonth(request, response) {
    Neo.bestTimeFrame({
      isHazardous: neoParams(request).hazardous, timeFrame: 'month'
    }).then(results => {
      response.json({ month: results[0]._id });
    }).catch(error => response.json({ error }));
  }
}

module.exports = NeosController;
