
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
				it('can validate', function() {
					validator.validateSchema({
						type: 'number',
						minimum: 4.5
					}, function(errors) {
						errors.should.be.empty;
					});
					validator.validateSchema({
						type: 'number',
						minimum: -4.5
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('fails if not a number', function() {
					validator.validateSchema({
						type: 'number',
						minimum: '4.5'
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
			describe('with "maximum"', function() {
				it('can validate', function() {
					validator.validateSchema({
						type: 'number',
						maximum: 4.5
					}, function(errors) {
						errors.should.be.empty;
					});
					validator.validateSchema({
						type: 'number',
						maximum: -4.5
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('fails if not a number', function() {
					validator.validateSchema({
						type: 'number',
						maximum: '4.5'
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
				it('fails if not a boolean', function() {
					validator.validateSchema({
						type: 'number',
						minimum: 4.5,
						exclusiveMinimum: 1
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('ignores validation if minimum is not defined', function() {
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
				it('fails if not a boolean', function() {
					validator.validateSchema({
						type: 'number',
						maximum: 4.5,
						exclusiveMaximum: 1
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('ignores validation if maximum is not defined', function() {
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
				it('fails if not a number array', function() {
					validator.validateSchema({
						type: 'number',
						enum: ['enum1', 'enum2', 'enum3']
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('fails if not an array', function() {
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
