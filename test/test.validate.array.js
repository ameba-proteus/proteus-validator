
var validator = require('../lib/validator');
var should = require('should');

describe('validator', function() {
	describe('#validate', function() {
		describe('[type:array]', function() {
			it('can validate', function() {
				validator.validate({
					type: 'array'
				}, ['string', 1, true, null, undefined], function(errors) {
					errors.should.be.empty;
				});
			});
			it('will fail if value is not an array', function() {
				validator.validate({
					type: 'array'
				}, '1', function(errors) {
					errors.should.not.be.empty;
				});
				validator.validate({
					type: 'array'
				}, null, function(errors) {
					errors.should.not.be.empty;
				});
				validator.validate({
					type: 'array'
				}, undefined, function(errors) {
					errors.should.not.be.empty;
				});
				validator.validate({
					type: 'array'
				}, {}, function(errors) {
					errors.should.not.be.empty;
				});
				validator.validate({
					type: 'array'
				}, function(){}, function(errors) {
					errors.should.not.be.empty;
				});
			});
			describe('with "minItems"', function() {
				it('can validate', function() {
					validator.validate({
						type: 'array',
						minItems: 4
					}, [1, 2, 3, 4], function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if value\'s length is less than minItems', function() {
					validator.validate({
						type: 'array',
						minItems: 4
					}, [1, 2, 3], function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
			describe('with "maxItems"', function() {
				it('can validate', function() {
					validator.validate({
						type: 'array',
						maxItems: 4
					}, [1, 2, 3, 4], function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if value\'s length is greater than maxItems', function() {
					validator.validate({
						type: 'array',
						maxItems: 4
					}, [1, 2, 3, 4, 5], function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
			describe('with "items" defined as object', function() {
				it('can validate', function() {
					validator.validate({
						type: 'array',
						items: { type: 'string' }
					}, ['string1', 'stirng2'], function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if value does not match against items', function() {
					validator.validate({
						type: 'array',
						items: { type: 'string' }
					}, [1, 2], function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
			describe('with "items" defined an array', function() {
				it('can validate', function() {
					validator.validate({
						type: 'array',
						items: [
							{ type: 'string' },
							{ type: 'integer' }
						]
					}, ['string1', 2], function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if value does not match against items', function() {
					validator.validate({
						type: 'array',
						items: [
							{ type: 'string' },
							{ type: 'integer' }
						]
					}, ['string1', 2.5], function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
		});
	});
});
