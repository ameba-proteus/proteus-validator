
var validator = require('../lib/validator');
var should = require('should');
var fs = require('fs');

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
				it('can validate', function() {
					validator.validateSchema({
						type: 'integer',
						minimum: 4
					}, function(errors) {
						errors.should.be.empty;
					});
					validator.validateSchema({
						type: 'integer',
						minimum: -4
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('fails if not a number', function() {
					validator.validateSchema({
						type: 'integer',
						minimum: '4'
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('fails if not an integer', function() {
					validator.validateSchema({
						type: 'integer',
						minimum: 4.5
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
			describe('with "maximum"', function() {
				it('can validate', function() {
					validator.validateSchema({
						type: 'integer',
						maximum: 4
					}, function(errors) {
						errors.should.be.empty;
					});
					validator.validateSchema({
						type: 'integer',
						maximum: -4
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('fails if not a integer', function() {
					validator.validateSchema({
						type: 'integer',
						maximum: '4'
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('fails if not an integer', function() {
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
				it('fails if not a boolean', function() {
					validator.validateSchema({
						type: 'integer',
						minimum: 4,
						exclusiveMinimum: 1
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('ignores validation if minimum is not defined', function() {
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
				it('fails if not a boolean', function() {
					validator.validateSchema({
						type: 'integer',
						maximum: 4,
						exclusiveMaximum: 1
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('ignores validation if maximum is not defined', function() {
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
				it('fails if not a integer array', function() {
					validator.validateSchema({
						type: 'integer',
						enum: ['enum1', 'enum2', 'enum3']
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('fails if not an array', function() {
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
