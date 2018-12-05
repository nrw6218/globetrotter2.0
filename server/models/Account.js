const crypto = require('crypto');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let AccountModel = {};
const iterations = 10000;
const saltLength = 64;
const keyLength = 64;

const AccountSchema = new mongoose.Schema({
  first: {
    type: String,
    required: true,
    trim: true,
  },
  last: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  },
  salt: {
    type: Buffer,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

AccountSchema.statics.toAPI = doc => ({
  // _id is built into your mongo document and is guaranteed to be unique
  email: doc.email,
  first: doc.first,
  last: doc.last,
  _id: doc._id,
});

const validatePassword = (doc, password, callback) => {
  const pass = doc.password;

  return crypto.pbkdf2(password, doc.salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => {
    if (hash.toString('hex') !== pass) {
      return callback(false);
    }
    return callback(true);
  });
};

AccountSchema.statics.findByEmail = (email, callback) => {
  const search = {
    email,
  };

  return AccountModel.findOne(search, callback);
};

AccountSchema.statics.updatePassword = (accountInfo, callback) => {
  const search = {
    email: accountInfo.email,
  };

  return AccountModel.findOneAndUpdate(
    search,
    { password: accountInfo.password, salt: accountInfo.salt },
    callback
  );
};

AccountSchema.statics.updateAccountInfo = (accountInfo, callback) => {
  const search = {
    email: accountInfo.originalEmail,
  };

  if (accountInfo.originalEmail === accountInfo.updatedEmail) {
    return AccountModel.findOneAndUpdate(
      search,
      { first: accountInfo.first, last: accountInfo.last },
      callback
    );
  } else {
    return AccountModel.findOneAndUpdate(
      search,
      { first: accountInfo.first, last: accountInfo.last, email: accountInfo.updatedEmail },
      callback
    );
  }
};

AccountSchema.statics.generateHash = (password, callback) => {
  const salt = crypto.randomBytes(saltLength);

  crypto.pbkdf2(password, salt, iterations, keyLength, 'RSA-SHA512', (err, hash) =>
    callback(salt, hash.toString('hex'))
  );
};

AccountSchema.statics.authenticate = (email, password, callback) =>
AccountModel.findByEmail(email, (err, doc) => {
  if (err) {
    return callback(err);
  }

  if (!doc) {
    return callback();
  }

  return validatePassword(doc, password, (result) => {
    if (result === true) {
      return callback(null, doc);
    }

    return callback();
  });
});

AccountModel = mongoose.model('Account', AccountSchema);

module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;
