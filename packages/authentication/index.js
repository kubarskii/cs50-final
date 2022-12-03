const qServer = require('@me/qserver');
const AuthController = require('./controllers/auth.controller');

const srv = qServer();

srv.post('/token', AuthController.token);
srv.delete('/logout', AuthController.logout);
srv.post('/login', AuthController.login);

srv.listen(4000, () => {
  console.log('Running');
});
