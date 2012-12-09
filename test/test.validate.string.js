
var validator = require('../lib/validator');
var should = require('should');

describe('validator', function() {
	describe('#validate', function() {
		describe('[type:string]', function() {
			it('can validate', function() {
				validator.validate({
					type: 'string'
				}, 'proteus', function(errors) {
					errors.should.be.empty;
				});
			});
			it('fails if not a string', function() {
				validator.validate({
					type: 'string'
				}, 1, function(errors) {
					errors.should.not.be.empty;
				});
			});
			describe('with "minLength"', function() {
				it('can validate', function() {
					validator.validate({
						type: 'string',
						minLength: 4
					}, 'abcd', function(errors) {
						errors.should.be.empty;
					});
				});
				it('fails if less than minLength', function() {
					validator.validateSchema({
						type: 'string',
						minLength: 4
					}, 'abc', function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
			describe('with "maxLength"', function() {
				it('can validate', function() {
					validator.validate({
						type: 'string',
						maxLength: 4
					}, 'abcd', function(errors) {
						errors.should.be.empty;
					});
				});
				it('fails if greater than minLength', function() {
					validator.validateSchema({
						type: 'string',
						minLength: 4
					}, 'abcde', function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
			describe('with "pattern"', function() {
				it('can validate', function() {
					validator.validate({
						type: 'string',
						pattern: '^valid$'
					}, 'valid', function(errors) {
						errors.should.be.empty;
					});
				});
				it('fails if not match with the pattern', function() {
					validator.validateSchema({
						type: 'string',
						pattern: '^valid$'
					}, 'not valid', function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
			describe('with "format"', function() {
				it('can validate', function() {
					validator.validate({
						type: 'object',
						properties: {
							'date-time'    : { type: 'string', format: 'date-time' },
							'date'         : { type: 'string', format: 'date' },
							'time'         : { type: 'string', format: 'time' },
							'utc-millisec' : { type: 'string', format: 'utc-millisec' },
							'regex'        : { type: 'array', items: { type: 'string', format: 'regex' }},
							'color'        : { type: 'array', items: { type: 'string', format: 'color' }},
							'style'        : { type: 'array', items: { type: 'string', format: 'style' }},
							'phone'        : { type: 'array', items: { type: 'string', format: 'phone' }},
							'uri'          : { type: 'array', items: { type: 'string', format: 'uri' }},
							'email'        : { type: 'array', items: { type: 'string', format: 'email' }},
							'ip-address'   : { type: 'array', items: { type: 'string', format: 'ip-address' }},
							'ipv6'         : { type: 'array', items: { type: 'string', format: 'ipv6' }},
							'host-name'    : { type: 'array', items: { type: 'string', format: 'host-name' }}
						}
					}, {
						'date-time'    : '2012-01-02T03:04:05.123Z',
						'date'         : '2012-01-02',
						'time'         : '03:04:05',
						'utc-millisec' : '1354950312943',
						'regex'        : ['/^valid$/', '^valid$', 'valid'],
						'color'        : ['red', '#ff0000', 'rgb(255,0,0)', 'rgb(100%, 0%, 0%)'],
						'style'        : ['color:red;', 'display:none', 'background: #000 url(image/hoge.gif) no-repeat fixed right bottom;'],
						'phone'        : ['0120-111-222', '+81-0120-111-222'],
						'uri'          : ['https://github.com/ameba-proteus/proteus-validator'],
						'email'        : ['matsukaz@gmail.com'],
						'ip-address'   : ['123.123.123.123'],
						'ipv6'         : ['1111:2222:3333:4444:5555:6666:7777:8888'],
						'host-name'    : ['github.com']
					}, function(errors) {
						errors.should.be.empty;
					});
				});
//			});
//			describe('with "enum"', function() {
//				it('can validate', function() {
//					validator.validateSchema({
//						type: 'string',
//						enum: ['enum1', 'enum2', 'enum3']
//					}, function(errors) {
//						errors.should.be.empty;
//					});
//				});
//				it('can validate blank array', function() {
//					validator.validateSchema({
//						type: 'string',
//						enum: []
//					}, function(errors) {
//						errors.should.be.empty;
//					});
//				});
//				it('fails if not a string array', function() {
//					validator.validateSchema({
//						type: 'string',
//						enum: [1, 2, 3]
//					}, function(errors) {
//						errors.should.not.be.empty;
//					});
//				});
//				it('fails if not an array', function() {
//					validator.validateSchema({
//						type: 'string',
//						enum: 'enum1'
//					}, function(errors) {
//						errors.should.not.be.empty;
//					});
//				});
			});
		});
	});
});
