'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function (password) {
	return (this.provider !== 'local' || (password && password.length > 5));
};

/**
 * User Schema
 */
var UserSchema = new Schema({

	name: {
		type: String,
		trim: true,
		validate: [validateLocalStrategyProperty, 'Please fill in your name']
	},
	email: {
		type: String,
		trim: true,
		// default: '',
		unique: 'Email already exists',
		validate: [validateLocalStrategyProperty, 'Please fill in your email'],
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},

	password: {
		type: String,
		// default: '',
		validate: [validateLocalStrategyPassword, 'Password should be longer']
	},
    phone: {
        type: String,
        default: '',
    },
	activeToken: {
		type: String,
		default: '',
		trim: true,
	},
	activeExpires: {
		type: Date
	},
	provider: {
		type: String,
		required: 'Provider is required'
	},
	providerData: {},
	additionalProvidersData: {},
	roles: {
		type: [{
			type: String,
			enum: ['user', 'admin', 'student', 'teacher']
		}],
		default: ['teacher']
	},
    group_id: {
        type: Schema.ObjectId,
        ref: 'Group',
    },
    image: {
        type: String,
        default: '',
    },
	status: {
		type: Number,
		default: 1
	},
	created: {
		type: Date,
		default: Date.now
	},
	modified: {
		type: Date

	},
	/* For reset password */
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	}
},
	{ collection: 'users' }
);


/**
 * Create instance method for hashing a password
 */
UserSchema.methods = {
	

}

UserSchema.pre('update', function(next) {
    this.modified = Date.now();
    next();
});
UserSchema.pre('save', function(next) {
    this.modified = Date.now();
    next();
});
module.exports = mongoose.model('User', UserSchema);
