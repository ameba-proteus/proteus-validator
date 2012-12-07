
var validator = require('../lib/validator');
var should = require('should');
var fs = require('fs');

describe('validator', function() {
	describe('#validateSchema', function() {
		it('can validate asynchronously', function() {
			validator.validateSchema({
				type: 'string'
			}, function(errors) {
				errors.should.be.empty;
			});
		});
		it('can validate synchronously', function() {
			var errors = validator.validateSchema({ type: 'string' });
			errors.should.be.empty;
		});
		it('can validate complex schema', function() {
			var schema01 = JSON.parse(fs.readFileSync(__dirname + '/resource/schema01.json'));
			validator.validateSchema(schema01, function(errors) {
				errors.should.be.empty;
			});
		});
		it('fails if undefined type', function() {
			validator.validateSchema({
				type: 'undefined'
			}, function(errors) {
				errors.should.not.be.empty;
			});
		});
		it('fails if not an object', function() {
			validator.validateSchema('not an object', function(errors) {
				errors.should.not.be.empty;
			});
		});

		describe('with "required"', function() {
			it('can validate', function() {
				validator.validateSchema({
					type: 'string',
					required: true
				}, function(errors) {
					errors.should.be.empty;
				});
				validator.validateSchema({
					type: 'string',
					required: false
				}, function(errors) {
					errors.should.be.empty;
				});
			});
			it('fails if not a boolean', function() {
				validator.validateSchema({
					type: 'string',
					required: 'true'
				}, function(errors) {
					errors.should.not.be.empty;
				});
			});
		});
	});
});
