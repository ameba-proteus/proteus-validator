
var validator = require('../lib/validator');
var should = require('should');
var fs = require('fs');

describe('validator', function() {
	var schema01 = JSON.parse(fs.readFileSync(__dirname + '/resource/schema01.json'));
	var data01 = JSON.parse(fs.readFileSync(__dirname + '/resource/schema01-data01.json'));
	describe('#validate', function() {
		it('can validate asynchronously', function() {
			validator.validate(schema01, data01, function(errors) {
				errors.should.be.empty;
			});
		});
		it('can validate synchronously', function() {
			var errors = validator.validate(schema01, data01);
			errors.should.be.empty;
		});
	});
});
