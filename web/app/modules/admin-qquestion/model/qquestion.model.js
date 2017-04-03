'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var slug = require('slug');
/**
 * Qquestion Schema
 */
var QquestionSchema = new Schema({
	quiz_id: {
		type: Schema.ObjectId,
		ref: 'Quiz'
	},
	question_id: {
		type: Schema.ObjectId,
		ref: 'Question'
	},
	status: {
		type: 'Number',
		default: 1
	},
	desc: {
		type: 'String',
		textarea: 1
	},
	created_at: {
		type: 'Date'
	},
	updated_at: {
		type: 'Date'
	}
});



QquestionSchema.pre('update', function(next) {
    
    this.modified = Date.now();
    next();
});
QquestionSchema.pre('save', function(next) {
    
    if(this.isNew){ 
        this.created = Date.now();
    }
    this.modified = Date.now();
    next();
});

module.exports = mongoose.model('Qquestion', QquestionSchema);
