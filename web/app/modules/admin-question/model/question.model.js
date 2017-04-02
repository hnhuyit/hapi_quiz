'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var slug = require('slug');
/**
 * Question Schema
 */
var QuestionSchema = new Schema({
	name: {
		type: 'String',
		trim: true,
		index: true,
		required: true
	},
	slug: {
		type: 'String',
		slug: '#name'
	},
	question_type: {
		type: 'String',
		required: true
	},
	chapter_id: {
		type: Schema.ObjectId,
		ref: 'Chapter'
	},
	subject_id: {
		type: Schema.ObjectId,
		ref: 'Subject'
	},
	level: {
		type: 'String',
		required: true
	},
	description: {
		type: 'String',
		editor: 1
	},
	no_time_corrected: {
		type: 'Number',
		default: 0
	},
	no_time_incorrected: {
		type: 'Number',
		default: 0
	},
	no_time_unattempted: {
		type: 'Number',
		default: 0
	},
	options: [{
		question_option: {
			type: 'String',
			required: true
		},
		question_option_match: {
			type: 'String',
			default: ""
		},
		score: {
			type: 'Number',
			required: true,
			default: 0
		},
	}],
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


QuestionSchema.index({ slug: 1 });


QuestionSchema.pre('update', function(next) {
    
    if (!this.slug) {
        this.slug = slug(this.name);
    }
    this.slug = this.slug.toLowerCase();
    
    this.modified = Date.now();
    next();
});
QuestionSchema.pre('save', function(next) {
    
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

module.exports = mongoose.model('Question', QuestionSchema);
