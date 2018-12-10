const models = require('../models');

const Account = models.Account;

/*
  Renders a login page
*/
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

/*
  Logs the user out and redirects them to the login scren
*/
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

/*
  Renders the account settings page
*/
const settingsPage = (req, res) => {
  res.render('settings', { csrfToken: req.csrfToken() });
};

/*
  Authenticates the user profile and redirects them to the appropriate page
*/
const login = (request, response) => {
  const req = request;
  const res = response;

  const email = `${req.body.email}`;
  const password = `${req.body.pass}`;

  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(email, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong email or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

/*
  Validates signup information and redirects the user
*/
const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.first = `${req.body.first}`;
  req.body.last = `${req.body.last}`;
  req.body.email = `${req.body.email}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.first || !req.body.last || !req.body.email || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!req.body.email.match(mailformat)) {
    return res.status(400).json(
      { error: 'Looks like there is something wrong with that email... Please try again.' }
    );
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      email: req.body.email,
      first: req.body.first,
      last: req.body.last,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'An account with that email already exists.' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

const accountChange = (request, response) => {
  const req = request;
  const res = response;

  let first = `${req.body.first}`;
  let last = `${req.body.last}`;
  let email = `${req.body.email}`;
  let bio = `${req.body.bio}`;
  let imageLink = `${req.body.image}`;

  if (first === '' && last === '' && email === '' && bio === '' && imageLink === '') {
    return res.status(400).json({ error: 'No change requested.' });
  }

  if (first === '') { first = req.session.account.first; }
  if (last === '') { last = req.session.account.last; }
  if (email === '') { email = req.session.account.email; }
  if (bio === '') { bio = req.session.account.bio; }
  if (imageLink === '') { imageLink = req.session.account.imageLink; }

  const accountData = {
    originalEmail: req.session.account.email,
    updatedEmail: email,
    first,
    last,
    imageLink,
    bio,
    _id: req.session.account._id,
  };

  return Account.AccountModel.updateAccountInfo(accountData, (err, account) => {
    if (err || !account) {
      console.dir(err);
      return res.status(401).json({ error: 'There was an error updating your name' });
    }

    req.session.account = Account.AccountModel.toAPI({
      email: account.email,
      first: account.first,
      last: account.last,
      imageLink: account.imageLink,
      _id: account._id,
    });

    return res.json({ redirect: '/logout' });
  });
};

/*
  Validates the new password against the current and redirects them
  to sign back in
*/
const passwordChange = (request, response) => {
  const req = request;
  const res = response;

  const newPassword = `${req.body.newpass}`;
  const newPasswordCopy = `${req.body.newpass2}`;

  if (!newPassword || !newPasswordCopy) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (newPassword !== newPasswordCopy) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.newpass, (salt, hash) => {
    const accountData = {
      email: req.session.account.email,
      salt,
      password: hash,
    };

    return Account.AccountModel.updatePassword(accountData, (err, account) => {
      if (err || !account) {
        return res.status(401).json({ error: 'Wrong password' });
      }

      return res.json({ redirect: '/logout' });
    });
  });
};

/*
  Returns the csrf tokrn and user account
*/
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
    user: req.session.account,
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.settingsPage = settingsPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.accountChange = accountChange;
module.exports.passwordChange = passwordChange;
module.exports.getToken = getToken;
