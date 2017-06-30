const mongoose = require('mongoose');

const port        = process.env.MONGO_PORT || '27017';
const environment = process.env.NODE_ENV || 'development';
mongoose.connect(`mongodb://localhost:${port}/asteroidTracker_${environment}`);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => { console.log('Connected to Mongo'); });

module.exports = mongoose;
