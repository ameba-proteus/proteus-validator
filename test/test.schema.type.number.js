
var validator = require('../lib/validator');
var should = require('should');

describe('validator', function() {
	describe('#validateSchema', function() {
		describe('[type:number]', function() {
			it('can validate', function() {
				validator.validateSchema({
					type: 'number'
				}, function(errors) {
					errors.should.be.empty;
				});
			});
			describe('with "minimum"', function() {
				it('can validate if "minimum" value is positive number', function() {
					validator.validateSchema({
						type: 'number',
						minimum: 4.5
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('can validate if "minimum" value is negative number', function() {
					validator.validateSchema({
						type: 'number',
						minimum: -4.5
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if "minimum" value is not a number', function() {
					validator.validateSchema({
						type: 'number',
						minimum: '4.5'
					}, function(errors) {
						errors.should.not.be.empty;
					});
					validator.validateSchema({
						type: 'number',
						minimum: null
					}, function(errors) {
						errors.should.not.be.empty;
					});
					validator.validateSchema({
						type: 'number',
						minimum: undefined
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
			describe('with "maximum"', function() {
				it('can validate if "maximum" value is positive number', function() {
					validator.validateSchema({
						type: 'number',
						maximum: 4.5
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('can validate if "maximum" value is negative number', function() {
					validator.validateSchema({
						type: 'number',
						maximum: -4.5
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if "maximum" value is not a number', function() {
					validator.validateSchema({
						type: 'number',
						maximum: '4.5'
					}, function(errors) {
						errors.should.not.be.empty;
					});
					validator.validateSchema({
						type: 'number',
						maximum: null
					}, function(errors) {
						errors.should.not.be.empty;
					});
					validator.validateSchema({
						type: 'number',
						maximum: undefined
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
			describe('with "exclusiveMinimum"', function() {
				it('can validate', function() {
					validator.validateSchema({
						type: 'number',
						minimum: 4.5,
						exclusiveMinimum: true
					}, function(errors) {
						errors.should.be.empty;
					});
					validator.validateSchema({
						type: 'number',
						minimum: 4.5,
						exclusiveMinimum: false
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if "exclusiveMinimum" value is not a boolean', function() {
					validator.validateSchema({
						type: 'number',
						minimum: 4.5,
						exclusiveMinimum: 1
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('will ignore "exclusiveMinimum" value validation if minimum is not defined', function() {
					validator.validateSchema({
						type: 'number',
						exclusiveMinimum: 1
					}, function(errors) {
						errors.should.be.empty;
					});
				});
			});
			describe('with "exclusiveMaximum"', function() {
				it('can validate', function() {
					validator.validateSchema({
						type: 'number',
						maximum: 4.5,
						exclusiveMaximum: true
					}, function(errors) {
						errors.should.be.empty;
					});
					validator.validateSchema({
						type: 'number',
						maximum: 4.5,
						exclusiveMaximum: false
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if "exclusiveMaximum" value is not a boolean', function() {
					validator.validateSchema({
						type: 'number',
						maximum: 4.5,
						exclusiveMaximum: 1
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('will ignore "exclusiveMaximum" value validation if maximum is not defined', function() {
					validator.validateSchema({
						type: 'number',
						exclusiveMaximum: 1
					}, function(errors) {
						errors.should.be.empty;
					});
				});
			});
			describe('with "enum"', function() {
				it('can validate', function() {
					validator.validateSchema({
						type: 'number',
						enum: [1.1, 2.2, 3.3]
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('can validate blank array', function() {
					validator.validateSchema({
						type: 'number',
						enum: []
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if "enum" value is not a number array', function() {
					validator.validateSchema({
						type: 'number',
						enum: ['enum1', 'enum2', 'enum3']
					}, function(errors) {
						errors.should.not.be.empty;
					});
					validator.validateSchema({
						type: 'number',
						enum: 1.1
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
		});
	});
});
