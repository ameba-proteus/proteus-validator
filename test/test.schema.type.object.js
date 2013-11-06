
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
        it('can validate if "properties" are not defined', function() {
          validator.validateSchema({
            type: 'object'
          }, function(errors) {
            errors.should.be.empty;
          });
        });
        it('can validate if "properties" are blank', function() {
          validator.validateSchema({
            type: 'object',
            properties: {}
          }, function(errors) {
            errors.should.be.empty;
          });
        });
        it('will fail if "properties" are null', function() {
          validator.validateSchema({
            type: 'object',
            properties: null
          }, function(errors) {
            errors.should.not.be.empty;
          });
        });
        it('can validate string style schemas', function() {
          validator.validateSchema({
            type: 'object',
            properties: {
              prop1: 'integer',
              prop2: 'number',
              prop3: 'string'
            }
          }, function(errors) {
            errors.should.be.empty;
          });
        });
      });
      describe('with "additionalProperties"', function() {
        it('can validate if "additionalProperties" are boolean', function() {
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
        it('can validate if "additionalProperties" are schema object', function() {
          validator.validateSchema({
            type: 'object',
            properties: {
              prop1: { type: 'string' },
              prop2: { type: 'string' }
            },
            additionalProperties: {
              type: 'object',
              properties: {
                subprop1: {
                  type: 'string'
                }
              }
            }
          }, function(errors) {
            errors.should.be.empty;
          });
        });
        it('will fail if "additionalProperties" value is not a boolean', function() {
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
        it('will fail if "additionalProperties" value is not schema object', function() {
          validator.validateSchema({
            type: 'object',
            properties: {
              prop1: { type: 'string' },
              prop2: { type: 'string' }
            },
            additionalProperties: {
              prop1: 'value'
            }
          }, function(errors) {
            errors.should.not.be.empty;
          });
        });
      });
      describe('with oneOf', function() {
        it('can validate with oneOf', function() {
          validator.validateSchema({
            type: 'object',
            oneOf: [{
              type: 'object',
              properties: {
                prop1: { type: 'string' }
              }
            },{
              type: 'object',
              properties: {
                prop2: { type: 'string' }
              }
            }]
          }, function(errors) {
            errors.should.be.empty;
          });
        });
        it('will fail if oneOf is not array', function() {
          validator.validateSchema({
            type: 'object',
            oneOf: {
              type: 'object',
              properties: {
                prop2: { type: 'string' }
              }
            }
          }, function(errors) {
            errors.should.not.be.empty;
          });
        });
        it('will fail if oneOf has non object schema', function() {
          validator.validateSchema({
            type: 'object',
            oneOf: [{
              type: 'invalid'
            }, {
              type: 'object',
              properties: {
                prop1: { type: 'string' }
              }
            }]
          }, function(errors) {
            errors.should.not.be.empty;
          });
        });
      });
    });
  });
});
