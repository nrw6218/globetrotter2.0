const models = require('../models');
const Trip = models.Trip;

/*
  Handles rendering of the main app page
*/
const makerPage = (req, res) => {
  Trip.TripModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), trips: docs });
  });
};

const profilePage = (req, res) => {
  Trip.TripModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('profile', { csrfToken: req.csrfToken(), trips: docs, account: req.session.account });
  });
};

/*
  Displays a 404 page
*/
const errorPage = (req, res) => {
  res.render('error', { csrfToken: req.csrfToken() });
};

/*
  Handles the rendering of the map/pins page
*/
const pinsPage = (req, res) => {
  Trip.TripModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('pins', { csrfToken: req.csrfToken(), trips: docs });
  });
};

/*
  Valiadates trip information and redirects the user
*/
const makeTrip = (req, res) => {
  if (!req.body.title || !req.body.location || !req.body.startDate) {
    return res.status(400).json({ error: 'Trips need a title, location and date to be created.' });
  }

  // Number of days
  const oneDay = 24 * 60 * 60 * 1000;
  const startDate = new Date(req.body.startDate);
  const createdDate = new Date();
  const days = Math.round(Math.abs(startDate.getTime() - createdDate.getTime()) / oneDay);

  const tripData = {
    title: req.body.title,
    details: req.body.details,
    location: req.body.location,
    startDate: req.body.startDate,
    totalDays: days,
    createdDate: req.body.createdDate,
    owner: req.session.account._id,
    _id: req.body._id,
  };

  const newTrip = new Trip.TripModel(tripData);

  const tripPromise = newTrip.save();

  tripPromise.then(() => res.json({ redirect: '/maker' }));

  tripPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Trip already exists' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return tripPromise;
};

/*
  Handles deletion of a trip
*/
const deleteTrip = (request, response) => {
  const req = request;
  const res = response;

  return Trip.TripModel.deleteTrip(req.body._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ trips: docs });
  });
};

/*
  Receives all trips corresponding to a particular user
*/
const getTrips = (request, response) => {
  const req = request;
  const res = response;

  return Trip.TripModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ trips: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.profilePage = profilePage;
module.exports.pinsPage = pinsPage;
module.exports.getTrips = getTrips;
module.exports.deleteTrip = deleteTrip;
module.exports.errorPage = errorPage;
module.exports.make = makeTrip;
