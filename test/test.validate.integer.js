
var validator = require('../lib/validator');
var should = require('should');

describe('validator', function() {
	describe('#validate', function() {
		describe('[type:integer]', function() {
			it('can validate', function() {
				validator.validate({
					type: 'integer'
				}, 1, function(errors) {
					errors.should.be.empty;
				});
				validator.validate({
					type: 'integer'
				}, -1, function(errors) {
					errors.should.be.empty;
				});
			});
			it('will fail if value is not an integer', function() {
				validator.validate({
					type: 'integer'
				}, 1.5, function(errors) {
					errors.should.not.be.empty;
				});
				validator.validate({
					type: 'integer'
				}, '1', function(errors) {
					errors.should.not.be.empty;
				});
				validator.validate({
					type: 'integer'
				}, null, function(errors) {
					errors.should.not.be.empty;
				});
				validator.validate({
					type: 'integer'
				}, undefined, function(errors) {
					errors.should.not.be.empty;
				});
				validator.validate({
					type: 'integer'
				}, NaN, function(errors) {
					errors.should.not.be.empty;
				});
			});
			describe('with "minimum" and "exclusiveMinimum"', function() {
				it('can validate if value is greater than or equal to "minimum" value', function() {
					validator.validate({
						type: 'integer',
						minimum: 4
					}, 4, function(errors) {
						errors.should.be.empty;
					});
					validator.validate({
						type: 'integer',
						minimum: 4,
						exclusiveMinimum: false
					}, 4, function(errors) {
						errors.should.be.empty;
					});
					validator.validate({
						type: 'integer',
						minimum: 4,
						exclusiveMinimum: false
					}, 5, function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if value is less than "minimum" value', function() {
					validator.validate({
						type: 'integer',
						minimum: 4
					}, 3, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('will fail if value is equals to "minimum" value and "exclusiveMinimum" is true', function() {
					validator.validate({
						type: 'integer',
						minimum: 4,
						exclusiveMinimum: true
					}, 4, function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
			describe('with "maximum" and "exclusiveMaximum"', function() {
				it('can validate if value is less than or equal to "maximum" value', function() {
					validator.validate({
						type: 'integer',
						maximum: 4
					}, 4, function(errors) {
						errors.should.be.empty;
					});
					validator.validate({
						type: 'integer',
						maximum: 4,
						exclusiveMinimum: false
					}, 4, function(errors) {
						errors.should.be.empty;
					});
					validator.validate({
						type: 'integer',
						maximum: 4
					}, 3, function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if value is greater than "maximum" value', function() {
					validator.validate({
						type: 'integer',
						maximum: 4
					}, 5, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('will fail if value is equals to "maximum" value and "exclusiveMaximum" is true', function() {
					validator.validate({
						type: 'integer',
						maximum: 4,
						exclusiveMaximum: true
					}, 4, function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
			describe('with "enum"', function() {
				it('can validate', function() {
					validator.validate({
						type: 'array', items: [
							{ type: 'integer', enum: [1, 2, 3]}
					]}, [
						1,
						2,
						3
					], function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if value is not defined as enum value', function() {
					validator.validate({
						type: 'array', items: [
							{ type: 'integer', enum: [1, 2, 3]}
					]}, [
						4,
						5
					], function(errors) {
						errors.should.not.be.empty;
						errors.should.have.length(2);
					});
				});
			});
		});
	});
});
