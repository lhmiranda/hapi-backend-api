var Hapi = require('hapi'),
    dogwater = require('dogwater');
    
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

server.register([
    {
        register: require('blipp')
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

    server.auth.strategy('base', 'cookie', {
        password: 'IAmWhatIAmAndThatsAllIAm', // salt
        cookie: 'api-cookie', // cookie name
//        redirectTo: '/', // redirect on unauthorized
        isSecure: false // only accept secure connections?
    });

    server.route(require('./routes/user'));
    server.route(require('./routes/auth'));

    server.start(function () {
        console.log('User API up and running at:', server.info.uri);
    });
});