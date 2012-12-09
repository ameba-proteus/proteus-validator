
var validator = require('../lib/validator');
var should = require('should');

describe('validator', function() {
	describe('#validateSchema', function() {
		describe('[type:array]', function() {
			it('can validate', function() {
				validator.validateSchema({
					type: 'array'
				}, function(errors) {
					errors.should.be.empty;
				});
			});
			describe('with "minItems"', function() {
				it('can validate', function() {
					validator.validateSchema({
						type: 'array',
						minItems: 1
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('fails if not an integer', function() {
					validator.validateSchema({
						type: 'array',
						minItems: '1'
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('fails if a number with digits', function() {
					validator.validateSchema({
						type: 'array',
						minItems: 1.5
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('fails if negative integer', function() {
					validator.validateSchema({
						type: 'array',
						minItems: -1
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
			describe('with "maxItems"', function() {
				it('can validate', function() {
					validator.validateSchema({
						type: 'array',
						maxItems: 1
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('fails if not an integer', function() {
					validator.validateSchema({
						type: 'array',
						maxItems: '1'
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('fails if a number with digits', function() {
					validator.validateSchema({
						type: 'array',
						maxItems: 1.5
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('fails if negative integer', function() {
					validator.validateSchema({
						type: 'array',
						maxItems: -1
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
			describe('with "items"', function() {
				it('can validate', function() {
					validator.validateSchema({
						type: 'array',
						items: { type: 'string'}
					}, function(errors) {
						errors.should.be.empty;
					});
					validator.validateSchema({
						type: 'array',
						items: [
							{ type: 'string'},
							{ type: 'number' },
							{ type: 'integer' },
							{ type: 'boolean' },
							{ type: 'null' },
							{ type: 'any' },
							{ type: 'object' }
						]
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('can validate even if items are blank', function() {
					validator.validateSchema({
						type: 'array',
						items: []
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('fails if not an object or an array', function() {
					validator.validateSchema({
						type: 'array',
						items: 'items'
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
		});
	});
});
