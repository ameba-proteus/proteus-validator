
var validator = require('../lib/validator');
var should = require('should');

describe('validator', function() {
	describe('#validate', function() {
		describe('[type:object]', function() {
			it('can validate', function() {
				validator.validate({
					type: 'object'
				}, {}, function(errors) {
					errors.should.be.empty;
				});
			});
			it('will fail if value is not an object', function() {
				validator.validate({
					type: 'object'
				}, '1', function(errors) {
					errors.should.not.be.empty;
				});
				validator.validate({
					type: 'object'
				}, null, function(errors) {
					errors.should.not.be.empty;
				});
				validator.validate({
					type: 'object'
				}, undefined, function(errors) {
					errors.should.not.be.empty;
				});
				validator.validate({
					type: 'object'
				}, [], function(errors) {
					errors.should.not.be.empty;
				});
				validator.validate({
					type: 'object'
				}, function(){}, function(errors) {
					errors.should.not.be.empty;
				});
			});
			describe('with "properties"', function() {
				it('can validate', function() {
					validator.validate({
						type: 'object',
						properties: {
							prop1: { type: 'string' }
						}
					}, { prop1: 'value' }, function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if property is not defined', function() {
					validator.validate({
						type: 'object',
						properties: {
							prop1: { type: 'string' }
						}
					}, { prop1: 'value', prop2: 'value' }, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('can validate if property is not defined and "additionalProperties" are true', function() {
					validator.validate({
						type: 'object',
						properties: {
							prop1: { type: 'string' }
						},
						additionalProperties: true
					}, { prop1: 'value', prop2: 'value' }, function(errors) {
						errors.should.be.empty;
					});
				});
				it('can validate if value is valid against "additionalProperties" schema', function() {
					validator.validate({
						type: 'object',
						properties: {
							prop1: { type: 'string' }
						},
						additionalProperties: {
							type: 'string'
						}
					}, { prop1: 'value', prop2: 'value' }, function(errors) {
						errors.should.be.empty;
					});
					validator.validate({
						type: 'object',
						properties: {
							prop1: { type: 'string' }
						},
						additionalProperties: {
							type: 'object',
							properties: {
								subprop1: { type: 'integer'}
							}
						}
					}, { prop1: 'value', prop2: { subprop1: 1 } }, function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if property is not defined and not valid against "additionalProperties" schema', function() {
					validator.validate({
						type: 'object',
						properties: {
							prop1: { type: 'string' }
						},
						additionalProperties: {
							type: 'string'
						}
					}, { prop1: 'value', prop2: 1 }, function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
		});
	});
});
