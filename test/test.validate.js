
var validator = require('../lib/validator');
var should = require('should');
var fs = require('fs');

describe('validator', function() {
	describe('#validate', function() {
		it('can validate asynchronously', function() {
			validator.validate({ type: 'string' }, 'value', function(errors) {
				errors.should.be.empty;
			});
		});
		it('can validate synchronously', function() {
			var errors = validator.validate({ type: 'string' }, 'value');
			errors.should.be.empty;
		});
		it('can validate complex data', function() {
			var schema01 = JSON.parse(fs.readFileSync(__dirname + '/resource/schema01.json'));
			var data01 = JSON.parse(fs.readFileSync(__dirname + '/resource/schema01-data01.json'));
			validator.validate(schema01, data01, function(errors) {
				errors.should.be.empty;
			});
		});
		describe('with "required"', function() {
			it('can validate', function() {
				validator.validate({
					type: 'object',
					properties: {
						prop1: { type: 'string', required: false }
					}
				}, { prop1: 'value' }, function(errors) {
					errors.should.be.empty;
				});
				validator.validate({
					type: 'object',
					properties: {
						prop1: { type: 'string', required: false }
					}
				}, {}, function(errors) {
					errors.should.be.empty;
				});
			});
			it('fails if required property is not defined', function() {
				validator.validate({
					type: 'object',
					properties: {
						prop1: { type: 'string', required: true }
					}
				}, {}, function(errors) {
					errors.should.not.be.empty;
				});
			});
		});
	});
});
