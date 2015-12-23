var bedwetterOptions = {}

module.exports = [
    {
        // return all user items
        path: '/user',
        method: 'GET',
        config: {
            auth: {
                strategy: 'base',
                scope: ['user', 'operator', 'admin']
            },
            handler: {
                bedwetter: bedwetterOptions
            }
        }
    }, {
        // return a specific user by id
        path: '/user/{id}',
        method: 'GET',
        config: {
            auth: {
                strategy: 'base',
                scope: ['operator', 'admin']
            },
            handler: {
                bedwetter: bedwetterOptions
            }
        }
    }, {
        // create a new user
        path: '/user',
        method: 'POST',
        config: {
            auth: {
                strategy: 'base',
                scope: 'admin'
            },
            handler: {
                bedwetter: bedwetterOptions
            }
        }
    }, {
        // udpate an existing user by id
        path: '/user/{id}',
        method: ['PATCH', 'POST'],
        config: {
            auth: {
                strategy: 'base',
                scope: 'admin'
            },
            handler: {
                bedwetter: bedwetterOptions
            }
        }
    }, {
        // remove a user by id
        path: '/user/{id}',
        method: 'DELETE',
        config: {
            auth: {
                strategy: 'base',
                scope: 'admin'
            },
            handler: {
                bedwetter: bedwetterOptions
            }
        }
    }
];