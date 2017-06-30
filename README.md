[![Build Status](https://travis-ci.org/drewmoore/asteroid-tracker.svg?branch=master)](https://travis-ci.org/drewmoore/asteroid-tracker)

# Asteroid Tracker

This Web API allows users to search NASA's database for objects close to Earth's orbit.

## Getting started

- Clone or fork the repository.
- Set the environment variable `NASA_KEY` with your NASA API key.
- Run `yarn`
- Make sure that MongoDB is installed and the server is running.
  - You can optionally set the environment variable `MONGO_PORT` to whichever port your Mongo server is listening. The default is 27017.
- Seed the database with data from NASA's API by running `npm run fetch_neos`.
- Start the server with `npm run serve`.
- Run the tests with `npm test`.

## Technologies Employed
- Express
  - The choice of Express for a simple, lightweight API server felt natural.
  - The un-opinionated and tabula-rasa-oriented approach of the node server presents a good opportunity to demonstrate my own sense of application structure.
  - The combination of server-side Javascript with MongoDB's BSON brings with it a certain feeling of consistency.
  - I had been trained in Express, but it had been a while since I had worked with it. I wanted to take an opportunity to revisit the framework.
- MongoDB
  - MongoDB's ability to store and work with a variety of data types makes it a beneficial tool for the assignment. Mongo's abilities to perform bulk writes and aggregates were particularly useful in saving API data and grouping asteroids by date.
- Mongoose
  - I included this ORM for simple document validations and for better code maintainability through built-in CRUD-related methods.
- Mocha with Chai
  - Testing is always essential, and these are two proven tools.
  - Chai provides useful tools for acceptance testing in addition to its human-readable syntax.
