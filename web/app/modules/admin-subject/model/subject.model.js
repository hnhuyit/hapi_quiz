'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var slug = require('slug');
/**
 * Subject Schema
 */
var SubjectSchema = new Schema({
	name: {
		type: 'String',
		trim: true,
		index: true,
		required: true
	},
	desc: {
		type: 'String',
		textarea: 1
	},
	user_id: [{
		type: Schema.ObjectId,
		ref: 'User'
	}],
	slug: {
		type: 'String',
		slug: '#name'
	},
	status: {
		type: 'Number',
		default: 1
	},
	created: {
		type: 'Date'
	},
	modified: {
		type: 'Date'
	}
});


SubjectSchema.index({ slug: 1 });


SubjectSchema.pre('update', function(next) {
    
    if (!this.slug) {
        this.slug = slug(this.name);
    }
    this.slug = this.slug.toLowerCase();
    
    this.modified = Date.now();
    next();
});
SubjectSchema.pre('save', function(next) {
    
    if (!this.slug) {
        this.slug = slug(this.name);
    }
    this.slug = this.slug.toLowerCase();
    
    if(this.isNew){ 
        this.created = Date.now();
    }
    this.modified = Date.now();
    next();
});

module.exports = mongoose.model('Subject', SubjectSchema);
