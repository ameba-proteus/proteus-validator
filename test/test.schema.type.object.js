
var validator = require('../lib/validator');
var should = require('should');

describe('validator', function() {
	describe('#validateSchema', function() {
		describe('[type:object]', function() {
			describe('with "properties"', function() {
				it('can validate', function() {
					validator.validateSchema({
						type: 'object',
						properties: {
							prop1: { type: 'string' },
							prop2: { type: 'number' },
							prop3: { type: 'integer' },
							prop4: { type: 'boolean' },
							prop5: { type: 'null' },
							prop6: { type: 'any' },
							prop7: { type: 'object' },
							prop8: { type: 'array' }
						}
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('can validate even if properties are not defined', function() {
					validator.validateSchema({
						type: 'object'
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('can validate even if properties are blank', function() {
					validator.validateSchema({
						type: 'object',
						properties: {}
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('fails if properties are null', function() {
					validator.validateSchema({
						type: 'object',
						properties: null
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
			describe('with "additionalProperties"', function() {
				it('can validate', function() {
					validator.validateSchema({
						type: 'object',
						properties: {
							prop1: { type: 'string' },
							prop2: { type: 'string' }
						},
						additionalProperties: true
					}, function(errors) {
						errors.should.be.empty;
					});
					validator.validateSchema({
						type: 'object',
						properties: {
							prop1: { type: 'string' },
							prop2: { type: 'string' }
						},
						additionalProperties: false
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('fails if not a boolean', function() {
					validator.validateSchema({
						type: 'object',
						properties: {
							prop1: { type: 'string' },
							prop2: { type: 'string' }
						},
						additionalProperties: 'true'
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
		});
	});
});
