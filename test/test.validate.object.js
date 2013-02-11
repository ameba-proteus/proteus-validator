
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
			describe('with "oneOf"', function() {
				it('can validate oneOf', function() {
					validator.validate({
						type: 'object',
						oneOf: [{
							type: 'object',
							properties: {
								prop1: {
									type: 'string',
									required: true
								}
							}
						}, {
							type: 'object',
							properties: {
								prop2: {
									type: 'string',
									required: true
								}
							}
						}]
					}, {
						prop2: 'test'
					}, function(errors) {
						errors.should.be.empty;
					});
				});
				it('fail all of oneOf validations', function() {
					validator.validate({
						type: 'object',
						oneOf: [{
							type: 'object',
							properties: {
								prop1: {
									type: 'string',
									required: true
								}
							}
						}, {
							type: 'object',
							properties: {
								prop2: {
									type: 'string',
									required: true
								}
							}
						}]
					}, {
						prop3: 'test'
					}, function(errors) {
						errors.should.not.be.empty;
					});
				});
				it('nested oneOf properties', function() {
					var schema = {
						type: 'object',
						oneOf: [{
							type: 'object',
							properties: {
								prop1: {
									type: 'string',
									'enum': ['text1','text2']
								},
								prop2: {
									type: 'object',
									oneOf: [{
										type: 'object',
										properties: {
											prop1: { type: 'string', required: true }
										}
									}, {
										type: 'object',
										properties: {
											prop2: { type: 'string', required: true }
										}
									}]
								}
							}
						}, {
							type: 'object',
							properties: {
								prop1: {
									type: 'string',
									'enum': ['text3','text4']
								},
								prop3: {
									type: 'object',
									oneOf: [{
										type: 'object',
										properties: {
											prop1: { type: 'number', required: true }
										}
									}, {
										type: 'object',
										properties: {
											prop2: { type: 'number', required: true }
										}
									}]
								}
							}
						}]
					};
					validator.validate(schema, {
						prop1: 'text1',
						prop2: {
							prop1: 'prop1'
						}
					}, function(errors) {
						errors.should.be.empty;
					});
					validator.validate(schema, {
						prop1: 'text2',
						prop2: {
							prop2: 'prop2'
						}
					}, function(errors) {
						errors.should.be.empty;
					});
					validator.validate(schema, {
						prop1: 'text2',
						prop2: {
							prop2: 100
						}
					}, function(errors) {
						errors.should.not.be.empty;
					});
					validator.validate(schema, {
						prop1: 'text3',
						prop3: {
							prop1: 100
						}
					}, function(errors) {
						errors.should.be.empty;
					});
					validator.validate(schema, {
						prop1: 'text5',
						prop3: {
							prop1: 100
						}
					}, function(errors) {
						errors.should.not.be.empty;
					});


				});
			});
		});
	});
});
