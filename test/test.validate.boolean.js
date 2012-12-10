
var validator = require('../lib/validator');
var should = require('should');

describe('validator', function() {
	describe('#validate', function() {
		describe('[type:boolean]', function() {
			it('can validate', function() {
				validator.validate({
					type: 'boolean'
				}, true, function(errors) {
					errors.should.be.empty;
				});
				validator.validate({
					type: 'boolean'
				}, false, function(errors) {
					errors.should.be.empty;
				});
			});
			it('will fail if value is not a boolean', function() {
				validator.validate({
					type: 'boolean'
				}, '1', function(errors) {
					errors.should.not.be.empty;
				});
				validator.validate({
					type: 'boolean'
				}, null, function(errors) {
					errors.should.not.be.empty;
				});
				validator.validate({
					type: 'boolean'
				}, undefined, function(errors) {
					errors.should.not.be.empty;
				});
				validator.validate({
					type: 'boolean'
				}, NaN, function(errors) {
					errors.should.not.be.empty;
				});
			});
		});
	});
});
