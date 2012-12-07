
var validator = require('../lib/validator');
var should = require('should');
var fs = require('fs');

describe('validator', function() {
	var schema01 = JSON.parse(fs.readFileSync(__dirname + '/resource/schema01.json'));
	var data01 = JSON.parse(fs.readFileSync(__dirname + '/resource/schema01-data01.json'));
	describe('#validate', function() {
		it('can validate asynchronously', function() {
			validator.validate(schema01, data01, function(errors) {
				errors.should.be.empty;
			});
		});
		it('can validate synchronously', function() {
			var errors = validator.validate(schema01, data01);
			errors.should.be.empty;
		});
	});
	describe('#registSchema', function() {
		it('can regist asynchronously', function() {
			validator.registSchema('schema01', schema01, function(errors) {
				errors.should.be.empty;
			});
		});
		it('can regist synchronously', function() {
			var errors = validator.registSchema('schema02', schema01);
			errors.should.be.empty;
		});
		it('can validate successfully', function() {
			validator.validate('schema01', data01, function(errors) {
				errors.should.be.empty;
				validator.validate('schema02', data01, function(errors) {
					errors.should.be.empty;
				});
			});
		});
	});
	describe('#unregistSchema', function() {
		it('can unregist', function() {
			validator.unregistSchema('schema02');
		});
		it('fails to validate', function() {
			validator.validate('schema02', data01, function(errors) {
				errors.should.not.be.empty;
			});
		});
	});

	describe('#addValidation', function() {
		it('can add custom validation', function() {
			validator.addValidation('throwErrorIfTwo', function(schema, instance) {
				if (schema.throwErrorIfTwo && instance === 2) {
					return 'error thrown by custom validation';
				}
			});
		});
		it('detects custom validation error', function() {
			schema01.properties.apiVersion['throwErrorIfTwo'] = true;
			validator.validate('schema01', data01, function(errors) {
				errors.should.not.be.empty;
			});
		});
		it('will succeed custom validation by value', function() {
			data01.apiVersion = 1;
			validator.validate('schema01', data01, function(errors) {
				errors.should.be.empty;
			});
		});
		it('will succeed custom validation by schema', function() {
			schema01.properties.apiVersion['throwErrorIfTwo'] = false;
			data01.apiVersion = 2;
			validator.validate('schema01', data01, function(errors) {
				errors.should.be.empty;
				delete schema01.properties.apiVersion['throwErrorIfTwo'];
			});
		});
	});
});
