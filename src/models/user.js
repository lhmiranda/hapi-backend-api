var shortid = require('shortid'),
    bcrypt = require('bcryptjs'),
    passes = 10;

module.exports = {
    identity: 'user',
    connection: 'db',
    autoPK: true,
    attributes: {
        firstName: {
            type: 'string',
            required: true
        },
        lastName: {
            type: 'string',
            required: true
        },
        email: {
            type: 'string',
            required: true,
            index: true,
            unique: true
        },
        password: {
            type: 'string',
            required: true,
            index: true
        },
        scope: {
            type: 'string',
            enum: ['user', 'operator', 'admin'],
            defaultsTo: 'user'
        },
        comparePasswords: function (pass, cb) {
            bcrypt.compare(pass, this.password, function (err, isMatch) {
                cb(err, isMatch);
            });
        },
        toJSON: function() {
			var obj = this.toObject();
			delete obj.password; // delete password property when returning object.
			return obj;
		}
    },
    beforeCreate: function (values, next) {
        bcrypt.hash(values.password, passes, function (err, hash) {
            if (err) {
                return next(err);
            }
            
            values.password = hash;
            next();
        });
    },
    beforeUpdate: function (values, next) {
        if (values.password) {
            bcrypt.hash(values.password, passes, function (err, hash) {
                if (err) {
                    return next(err);
                }

                values.password = hash;
                next();
            });
        } else {
            next();
        }
    }
}