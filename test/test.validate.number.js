
var validator = require('../lib/validator');
var should = require('should');

describe('validator', function() {
	describe('#validate', function() {
		describe('[type:number]', function() {
			it('can validate', function() {
				validator.validate({
					type: 'number'
				}, 1, function(errors) {
					errors.should.be.empty;
				});
				validator.validate({
					type: 'number'
				}, 1.5, function(errors) {
					errors.should.be.empty;
				});
				validator.validate({
					type: 'number'
				}, -1.5, function(errors) {
					errors.should.be.empty;
				});
			});
			it('will fail if value is not a number', function() {
				validator.validate({
					type: 'number'
				}, '1', function(errors) {
					errors.should.not.be.empty;
				});
				validator.validate({
					type: 'number'
				}, null, function(errors) {
					errors.should.not.be.empty;
				});
				validator.validate({
					type: 'number'
				}, undefined, function(errors) {
					errors.should.not.be.empty;
				});
				validator.validate({
					type: 'number'
				}, NaN, function(errors) {
					errors.should.not.be.empty;
				});
			});
			describe('with "minimum" and "exclusiveMinimum"', function() {
				it('can validate if value is greater than or equal to "minimum" value', function() {
					validator.validate({
						type: 'number',
						minimum: 4.5
					}, 4.5, function(errors) {
						errors.should.be.empty;
					});
					validator.validate({
						type: 'number',
						minimum: 4.5,
						exclusiveMinimum: false
					}, 4.5, function(errors) {
						errors.should.be.empty;
					});
					validator.validate({
						type: 'number',
						minimum: 4.5
					}, 5.5, function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if value is less than "minimum" value', function() {
					validator.validate({
						type: 'number',
						minimum: 4.5
					}, 3.5, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('will fail if value is equal to "minimum" value  and "exclusiveMinimum" is true', function() {
					validator.validate({
						type: 'number',
						minimum: 4.5,
						exclusiveMinimum: true
					}, 4.5, function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
			describe('with "maximum" and "exclusiveMaximum"', function() {
				it('can validate if value is less than or equal to "maximum" value', function() {
					validator.validate({
						type: 'number',
						maximum: 4.5
					}, 4.5, function(errors) {
						errors.should.be.empty;
					});
					validator.validate({
						type: 'number',
						maximum: 4.5,
						exclusiveMinimum: false
					}, 4.5, function(errors) {
						errors.should.be.empty;
					});
					validator.validate({
						type: 'number',
						maximum: 4.5
					}, 3.5, function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if value is greater than "maximum" value', function() {
					validator.validate({
						type: 'number',
						maximum: 4.5
					}, 5.5, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('will fail if value is equals to "maximum" value and "exclusiveMaximum" is true', function() {
					validator.validate({
						type: 'number',
						maximum: 4.5,
						exclusiveMaximum: true
					}, 4.5, function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
			describe('with "enum"', function() {
				it('can validate', function() {
					validator.validate({
						type: 'array', items: [
							{ type: 'number', enum: [1.5, 2.5, 3.5]}
					]}, [
						1.5,
						2.5,
						3.5
					], function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if value is not defined as enum value', function() {
					validator.validate({
						type: 'array', items: [
							{ type: 'number', enum: [1.5, 2.5, 3.5]}
					]}, [
						4.5,
						5.5
					], function(errors) {
						errors.should.not.be.empty;
						errors.should.have.length(2);
					});
				});
			});
		});
	});
});
