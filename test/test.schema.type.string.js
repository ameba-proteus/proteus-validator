
var validator = require('../lib/validator');
var should = require('should');

describe('validator', function() {
	describe('#validateSchema', function() {
		describe('[type:string]', function() {
			it('can validate', function() {
				validator.validateSchema({
					type: 'string'
				}, function(errors) {
					errors.should.be.empty;
				});
			});
			describe('with "minLength"', function() {
				it('can validate', function() {
					validator.validateSchema({
						type: 'string',
						minLength: 4
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if "minLength" value is not an integer', function() {
					validator.validateSchema({
						type: 'string',
						minLength: '4'
					}, function(errors) {
						errors.should.not.be.empty;
					});
					validator.validateSchema({
						type: 'string',
						minLength: 4.5
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('will fail if "minLength" value is negative integer', function() {
					validator.validateSchema({
						type: 'string',
						minLength: -4
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
			describe('with "maxLength"', function() {
				it('can validate', function() {
					validator.validateSchema({
						type: 'string',
						maxLength: 4
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if "maxLength" value is not an integer', function() {
					validator.validateSchema({
						type: 'string',
						maxLength: '4'
					}, function(errors) {
						errors.should.not.be.empty;
					});
					validator.validateSchema({
						type: 'string',
						maxLength: 4.5
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('will fail if "maxLength" value is negative integer', function() {
					validator.validateSchema({
						type: 'string',
						maxLength: -4
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
			describe('with "pattern"', function() {
				it('can validate', function() {
					validator.validateSchema({
						type: 'string',
						pattern: '^valid$'
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if "pattern" value is not a string', function() {
					validator.validateSchema({
						type: 'string',
						pattern: 1
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('will fail if "pattern" value is not valid pattern', function() {
					validator.validateSchema({
						type: 'string',
						pattern: '^(invalid-pattern$'
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
			describe('with "format"', function() {
				it('can validate', function() {
					validator.validateSchema({
						type: 'object',
						properties: {
							'date-time'    : { type: 'string', format: 'date-time' },
							'date'         : { type: 'string', format: 'date' },
							'time'         : { type: 'string', format: 'time' },
							'utc-millisec' : { type: 'string', format: 'utc-millisec' },
							'regex'        : { type: 'string', format: 'regex' },
							'color'        : { type: 'string', format: 'color' },
							'style'        : { type: 'string', format: 'style' },
							'phone'        : { type: 'string', format: 'phone' },
							'uri'          : { type: 'string', format: 'uri' },
							'email'        : { type: 'string', format: 'email' },
							'ip-address'   : { type: 'string', format: 'ip-address' },
							'ipv6'         : { type: 'string', format: 'ipv6' },
							'host-name'    : { type: 'string', format: 'host-name' }
						}
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if "format" value is not a string', function() {
					validator.validateSchema({
						type: 'string',
						format: 1
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('will fail if "format" value is undefined format', function() {
					validator.validateSchema({
						type: 'string',
						format: 'undefined-format'
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
			describe('with "enum"', function() {
				it('can validate', function() {
					validator.validateSchema({
						type: 'string',
						enum: ['enum1', 'enum2', 'enum3']
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('can validate blank array', function() {
					validator.validateSchema({
						type: 'string',
						enum: []
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if "enum" value is not a string array', function() {
					validator.validateSchema({
						type: 'string',
						enum: [1, 2, 3]
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('will fail if "enum" value is not an array', function() {
					validator.validateSchema({
						type: 'string',
						enum: 'enum1'
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
		});
	});
});
