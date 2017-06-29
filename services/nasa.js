// Module for handling requests and responses to and from NASA.
const moment = require('moment');
const fetch  = require('isomorphic-fetch');

// Set common values to be used by all future endpoints.
const baseUrl = 'https://api.nasa.gov/neo/rest/v1'
const apiKey  = process.env.NASA_KEY;

class Nasa {
  static get neoUpdateEarliestDate() {
    return moment(Date.now()).subtract(3, 'days').format('YYYY-MM-DD');
  }

  // Query all NEOs updated by NASA in the past three days.
  static fetchUpdatedNeos() {
    const url = `${baseUrl}/feed?end_date=${this.neoUpdateEarliestDate}&api_key=${apiKey}`;

    return fetch(url).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(
          new Error(
            `Fetching updated NEOS failed. Server responded with: ${response.status}: ${response.statusText}.`
          )
        );
      }
    });
  }
}

module.exports = Nasa;
