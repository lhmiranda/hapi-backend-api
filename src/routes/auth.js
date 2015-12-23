var authController = require('../controllers/auth');

module.exports = [
    {
        path: '/login',
        method: 'POST',
        config: authController.login
    }, {
        path: '/logout',
        method: 'GET',
        config: authController.logout
    }
];