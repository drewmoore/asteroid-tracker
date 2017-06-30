const mongoose = require('../config/mongoose');

const schema = new mongoose.Schema({
  date: {
    type:     Date,
    required: true
  },
  reference: {
    type:     Number,
    required: true
  },
  name: {
    type:     String,
    required: true
  },
  speed: {
    type:     Number,
    required: true
  },
  isHazardous: {
    type:     Boolean,
    required: true
  }
});

class Neo extends mongoose.model('Neo', schema) {
  // For a given set of API results from NASA, convert them to a format friendly
  // to our schema. Persist to the DB, either inserting a new record or updating
  // an existing one, if applicable.
  static bulkUpsertFromNasa(apiNeos) {
    const bulk = this.collection.initializeUnorderedBulkOp();
    Object.keys(apiNeos).forEach(date => {
      apiNeos[date].forEach(apiNeo => {
        const reference    = apiNeo.neo_reference_id;
        const approachData =  apiNeo.close_approach_data[0];
        const speed        = approachData.relative_velocity.kilometers_per_hour;
        // Instruct bulk to upsert this document.
        bulk.find({ reference }).upsert().updateOne({ $set: {
          reference,
          speed,
          date:        new Date(date),
          name:        apiNeo.name,
          isHazardous: apiNeo.is_potentially_hazardous_asteroid
        }});
      });
    }, []);
    return bulk.execute();
  }

  // Query NEO records to determine which is the 'best' or most active period of
  // reporting these asteroids. A time frame must be provided, as well as a scope
  // for level of hazard.
  static bestTimeFrame({ isHazardous, timeFrame }) {
    return this.aggregate([
      { $match: { isHazardous } },
      { $group: { _id: { [`$${timeFrame}`]: '$date' }, count: { $sum: 1 }  }  },
      { $sort:  { count: -1 } }
    ]);
  }
}

module.exports = Neo;
