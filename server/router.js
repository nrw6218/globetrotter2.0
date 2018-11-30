const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getTrips', mid.requiresLogin, controllers.Trip.getTrips);
  app.delete('/deleteTrip', mid.requiresLogin, controllers.Trip.deleteTrip);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Trip.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Trip.make);
  app.get('/pins', mid.requiresLogin, controllers.Trip.pinsPage);
  app.get('/account', mid.requiresLogin, controllers.Account.settingsPage);
  app.put('/password', mid.requiresLogin, mid.requiresSecure, controllers.Account.passwordChange);
  app.put(
    '/accountChange',
    mid.requiresLogin,
    mid.requiresSecure,
    controllers.Account.accountChange
  );
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('*', controllers.Trip.errorPage);
};

module.exports = router;
