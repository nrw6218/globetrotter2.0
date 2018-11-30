const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let TripModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertID = mongoose.Types.ObjectId;
const setTitle = (title) => _.escape(title).trim();

const TripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setTitle,
  },
  details: {
    type: String,
    required: false,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  totalDays: {
    type: Number,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  startDate: {
    type: Date,
    required: true,
  },
});

TripSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  location: doc.location,
  details: doc.details,
  startDate: doc.startDate,
  _id: doc._id,
});

TripSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertID(ownerId),
  };

  return TripModel.find(search)
    .select('title location details startDate createdDate totalDays').exec(callback);
};

TripSchema.statics.deleteTrip = (id, callback) => {
  const search = {
    _id: id,
  };

  return TripModel.find(search).remove().exec(callback);
};

TripModel = mongoose.model('Trip', TripSchema);

module.exports.TripModel = TripModel;
module.exports.TripSchema = TripSchema;
