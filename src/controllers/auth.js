var Joi = require('joi'),
    Boom = require('boom');

exports.login = {
    validate: {
        payload: {
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }
    },
    handler: function (request, reply) {
        var users = request.model.user;
        users.findOne({ email: request.payload.email }, function (err, user) {
            if (err) {
                return reply(Boom.badImplementation());
            }

            if (user) {
                user.comparePasswords(request.payload.password, function (err, isMatch) {
                    if (err) {
                        return reply(Boom.badImplementation());
                    }

                    if (isMatch) {
                        request.auth.session.set(user);
                        return reply('Login Successful!');
                    }

                    reply(Boom.unauthorized('Bad email or password'));
                });
            }
        });
    }
};

exports.logout = {
    auth: {
        strategy: 'base',
        scope: ['user', 'operator', 'admin']
    },
    handler: function (request, reply) {
        request.auth.session.clear();
        reply('Logout Successful!');
    }
}