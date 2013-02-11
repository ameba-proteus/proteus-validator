
var validator = require('../lib/validator');
var should = require('should');

describe('validator', function() {
	describe('#registerSchema', function() {
		it('can regist asynchronously', function() {
			validator.registerSchema('schema01', {
				type: 'string'
			}, function(errors) {
				errors.should.be.empty;
			});
		});
		it('can regist synchronously', function() {
			var errors = validator.registerSchema('schema02', { type: 'integer'});
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
	describe('#unregisterSchema', function() {
		it('can unregist', function() {
			validator.unregisterSchema('schema02');
		});
		it('will fail to validate if schema is unregistered', function() {
			validator.unregisterSchema('schema02');
			validator.validate('schema02', 1, function(errors) {
				errors.should.not.be.empty;
			});
		});
	});
});
