
var validator = require('../lib/validator');
var should = require('should');

describe('validator', function() {
	describe('#registSchema', function() {
		it('can regist asynchronously', function() {
			validator.registSchema('schema01', {
				type: 'string'
			}, function(errors) {
				errors.should.be.empty;
			});
		});
		it('can regist synchronously', function() {
			var errors = validator.registSchema('schema02', { type: 'integer'});
			errors.should.be.empty;
		});
		it('can validate by registered schema successfully', function() {
			validator.validate('schema01', 'stringvalue', function(errors) {
				errors.should.be.empty;
				validator.validate('schema02', 1, function(errors) {
					errors.should.be.empty;
				});
			});
		});
	});
	describe('#unregistSchema', function() {
		it('can unregist', function() {
			validator.unregistSchema('schema02');
		});
		it('will fail to validate if schema is unregistered', function() {
			validator.unregistSchema('schema02');
			validator.validate('schema02', 1, function(errors) {
				errors.should.not.be.empty;
			});
		});
	});
});
