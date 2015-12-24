var Hapi = require('hapi'),
    dogwater = require('dogwater'),
    GoodWinston = require('good-winston'),
    winston = require('winston');

var server = new Hapi.Server();
server.connection({ port: 1337, host: 'localhost' });

var dogwaterOptions = {
    connections: {
        db: {
            adapter: 'mongo',
            host: 'localhost', // defaults to `localhost` if omitted
            port: 27017, // defaults to 27017 if omitted
            database: 'restApiDb' // or omit if not relevant
        }
    },
    adapters: {
        mongo: 'sails-mongo'
    },
    models: [require('./models/user')],
    fixtures: [
        {
            model: 'user'
        }
    ],
};

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            colorize: true
        }),
        new (winston.transports.File)({
            name: 'info-file',
            filename: './logs/info.log',
            level: 'info'
        }),
        new (winston.transports.File)({
            name: 'error-file',
            filename: './logs/error.log',
            level: ['error', 'warn']
        })
    ],
    exceptionHandlers: [
        new (winston.transports.File)({
            name: 'exceptions-file',
            filename: './logs/exceptions.log'
        })
    ]
});

server.register([
    {
        register: require('blipp')
    }, {
        register: require("good"),
        options: {
            reporters: [
                new GoodWinston({
                    ops: '*',
                    request: '*',
                    response: '*',
                    log: '*',
                    error: '*'
                }, logger)
            ]
        }
    }, {
        register: dogwater,
        options: dogwaterOptions
    }, {
        register: require('bedwetter'),
        options: {}
    }, {
        register: require('hapi-auth-cookie')
    }
], function (err) {
    if (err) {
        return console.log(err);
    }

    server.auth.strategy('session', 'cookie', {
        password: 'DoOrDoNotTheresNoTry', // key
        cookie: 'api-cookie', // cookie name
        ttl: 20 * 60 * 1000, // sets the cookie expiration time in milliseconds
        clearInvalid: true, // cookie that fails validation will be marked as expired in the response and cleared
        keepAlive: true, // automatically sets the session cookie after validation to extend the current session for a new ttl duration
        isSecure: false // enable to only accept secure connections (SSL)
    });

    server.route(require('./routes/user'));
    server.route(require('./routes/auth'));

    server.start(function () {
        console.log('User API up and running at:', server.info.uri);
    });
});