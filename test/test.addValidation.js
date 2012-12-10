
var validator = require('../lib/validator');
var should = require('should');

describe('validator', function() {
	describe('#addValidation', function() {
		it('can add custom validation', function() {
			validator.addValidation('errorIfContains', function(schema, instance) {
				// if instance contains the value defined in 'errorIfContains' property, it will return an error message;
				if (schema.errorIfContains && instance.indexOf(schema.errorIfContains) !== -1) {
					return 'error thrown by custom validation';
				}
				return;
			});
		});
		it('detects custom validation error', function() {
			validator.validate({
				type: 'object',
				properties: {
					prop1: { type: 'string' },
					prop2: { type: 'string', errorIfContains: 'error' }
				}
			}, {
				prop1: 'prop1',
				prop2: 'if value contains error, it will throw an error.'
			}, function(errors) {
				errors.should.not.be.empty;
			});
		});
		it('will pass the custom validation', function() {
			validator.validate({
				type: 'object',
				properties: {
					prop1: { type: 'string' },
					prop2: { type: 'string', errorIfContains: 'error' }
				}
			}, {
				prop1: 'prop1',
				prop2: 'if will succeed.'
			}, function(errors) {
				errors.should.be.empty;
			});
		});
		it('will fail if custom validation is not function', function() {
			validator.addValidation('errorIfContains', null).should.be.false;
		});

	});
});
