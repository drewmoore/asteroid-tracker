const mongoose = require('./lib/mongoose');

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
    type:     String,
    required: true
  },
  isHazardous: {
    type:     Boolean,
    required: true
  }
});

schema.statics.bulkUpsert = function (apiNeos) {
  const bulk = this.collection.initializeUnorderedBulkOp();
  Object.keys(apiNeos).forEach(date => {
    apiNeos[date].forEach(apiNeo => {
      const reference    = apiNeo.neo_reference_id;
      const approachData =  apiNeo.close_approach_data[0];
      const speed        = approachData.relative_velocity.kilometers_per_hour;
      // Instruct bulk to upsert this document.
      bulk.find({ reference }).upsert().updateOne({ $set: {
        date,
        reference,
        speed,
        name:        apiNeo.name,
        isHazardous: apiNeo.is_potentially_hazardous_asteroid
      }});
    });
  }, []);
  return bulk.execute();
};

module.exports = mongoose.model('Neo', schema);
