
var validator = require('../lib/validator');
var should = require('should');

describe('validator', function() {
	describe('#validateSchema', function() {
		describe('[type:integer]', function() {
			it('can validate', function() {
				validator.validateSchema({
					type: 'integer'
				}, function(errors) {
					errors.should.be.empty;
				});
			});
			describe('with "minimum"', function() {
				it('can validate if "minimum" value is positive integer', function() {
					validator.validateSchema({
						type: 'integer',
						minimum: 4
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('can validate if "minimum" value is negative integer', function() {
					validator.validateSchema({
						type: 'integer',
						minimum: -4
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if "minimum" value is not an integer', function() {
					validator.validateSchema({
						type: 'integer',
						minimum: '4'
					}, function(errors) {
						errors.should.not.be.empty;
					});
					validator.validateSchema({
						type: 'integer',
						minimum: 4.5
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
			describe('with "maximum"', function() {
				it('can validate if "maximum" value is positive integer', function() {
					validator.validateSchema({
						type: 'integer',
						maximum: 4
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('can validate if "maximum" value is negative integer', function() {
					validator.validateSchema({
						type: 'integer',
						maximum: -4
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if "maximum" value is not an integer', function() {
					validator.validateSchema({
						type: 'integer',
						maximum: '4'
					}, function(errors) {
						errors.should.not.be.empty;
					});
					validator.validateSchema({
						type: 'integer',
						maximum: 4.5
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
			describe('with "exclusiveMinimum"', function() {
				it('can validate', function() {
					validator.validateSchema({
						type: 'integer',
						minimum: 4,
						exclusiveMinimum: true
					}, function(errors) {
						errors.should.be.empty;
					});
					validator.validateSchema({
						type: 'integer',
						minimum: 4,
						exclusiveMinimum: false
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if "exclusiveMinimum" value is not a boolean', function() {
					validator.validateSchema({
						type: 'integer',
						minimum: 4,
						exclusiveMinimum: 1
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('will ignore "exclusiveMinimum" value validation if minimum is not defined', function() {
					validator.validateSchema({
						type: 'integer',
						exclusiveMinimum: 1
					}, function(errors) {
						errors.should.be.empty;
					});
				});
			});
			describe('with "exclusiveMaximum"', function() {
				it('can validate', function() {
					validator.validateSchema({
						type: 'integer',
						maximum: 4,
						exclusiveMaximum: true
					}, function(errors) {
						errors.should.be.empty;
					});
					validator.validateSchema({
						type: 'integer',
						maximum: 4,
						exclusiveMaximum: false
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if "exclusiveMaximum" value is not a boolean', function() {
					validator.validateSchema({
						type: 'integer',
						maximum: 4,
						exclusiveMaximum: 1
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('will ignore "exclusiveMaximum" value validation if minimum is not defined', function() {
					validator.validateSchema({
						type: 'integer',
						exclusiveMaximum: 1
					}, function(errors) {
						errors.should.be.empty;
					});
				});
			});
			describe('with "enum"', function() {
				it('can validate', function() {
					validator.validateSchema({
						type: 'integer',
						enum: [1, 2, 3]
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('can validate blank array', function() {
					validator.validateSchema({
						type: 'integer',
						enum: []
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if "enum" value is not an integer array', function() {
					validator.validateSchema({
						type: 'integer',
						enum: ['enum1', 'enum2', 'enum3']
					}, function(errors) {
						errors.should.not.be.empty;
					});
					validator.validateSchema({
						type: 'integer',
						enum: 1
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
		});
	});
});
