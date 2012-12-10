
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
			it('will fail if value is not a string', function() {
				validator.validate({
					type: 'string'
				}, null, function(errors) {
					errors.should.not.be.empty;
				});
				validator.validate({
					type: 'string'
				}, undefined, function(errors) {
					errors.should.not.be.empty;
				});
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
				it('will fail if value\'s length is less than "minLength"', function() {
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
				it('will fail if value\'s length is greater than "maxLength"', function() {
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
				it('will fail if value does not match against "pattern"', function() {
					validator.validateSchema({
						type: 'string',
						pattern: '^valid$'
					}, 'not valid', function(errors) {
						errors.should.not.be.empty;
					});
				});
			});
			describe('with "format"', function() {
				describe('[date-time]', function() {
					it('can validate', function() {
						validator.validate({
							type: 'array', items: [
								{ type: 'string', format: 'date-time' }
							]}, [
								'2012-01-02T03:04:05.123Z',
								'2012-01-02T03:04:05Z',
								'2012-01-02T03:04:05+09:00',
								'2012-01-02T03:04:05-02:00',
								'2012-13-02T03:04:05.123Z',
								'2012-01-42T03:04:05.123Z',
								'2012-01-02T73:04:05.123Z',
								'2012-01-02T03:74:05.123Z',
								'2012-01-02T03:04:75.123Z',
								'3012-01-02T03:04:05.123Z'
							], function(errors) {
								errors.should.be.empty;
							}
						);
					});
					it('will fail if value does not match with "date-time" format', function() {
						validator.validate({
							type: 'array', items: [
								{ type: 'string', format: 'date-time' }
							]}, [
								'2012-01-02 03:04:05.123Z',
								'2012/01/02T03:04:05.123Z',
								'2012-01-02T03:04:05.123',
								'2012-1-02T03:04:05.123Z',
								'2012-01-02T03:04:05.123+9:00',
								'2012-01-02T03:04:05.123-9'
							], function(errors) {
								errors.should.not.be.empty;
								errors.should.have.length(6);
							}
						);
					});
				});
				describe('[date]', function() {
					it('can validate', function() {
						validator.validate({
							type: 'array', items: [
								{ type: 'string', format: 'date' }
							]}, [
								'2012-01-02',
								'2012-13-02',
								'2012-01-42'
							], function(errors) {
								errors.should.be.empty;
							}
						);
					});
					it('will fail if value does not match with "date" format', function() {
						validator.validate({
							type: 'array', items: [
								{ type: 'string', format: 'date' }
							]}, [
								'2012/01/02',
								'2012-1-02'
							], function(errors) {
								errors.should.not.be.empty;
								errors.should.have.length(2);
							}
						);
					});
				});
				describe('[time]', function() {
					it('can validate', function() {
						validator.validate({
							type: 'array', items: [
								{ type: 'string', format: 'time' }
							]}, [
								'03:04:05.123',
								'03:74:05',
								'43:04:05.123',
								'03:74:05.123',
								'03:04:75.123'
							], function(errors) {
								errors.should.be.empty;
							}
						);
					});
					it('will fail if value does not match with "date" format', function() {
						validator.validate({
							type: 'array', items: [
								{ type: 'string', format: 'date-time' }
							]}, [
								'0304:05.123',
								'a3:04:05.123'
							], function(errors) {
								errors.should.not.be.empty;
								errors.should.have.length(2);
							}
						);
					});
				});
				describe('[utc-millisec]', function() {
					it('can validate', function() {
						validator.validate({
							type: 'array', items: [
								{ type: 'string', format: 'utc-millisec' }
							]}, [
								'1354950312943',
								'-1354950312943',
								'1354950312943.555'
							], function(errors) {
								errors.should.be.empty;
							}
						);
					});
					it('will fail if value does not match with "utc-millisec" format', function() {
						validator.validate({
							type: 'array', items: [
								{ type: 'string', format: 'utc-millisec' }
							]}, [
								'alphabet',
							], function(errors) {
								errors.should.not.be.empty;
								errors.should.have.length(1);
							}
						);
					});
				});
				describe('[regex]', function() {
					it('can validate', function() {
						validator.validate({
							type: 'array', items: [
								{ type: 'string', format: 'regex' }
							]}, [
								'/^valid$/',
								'/^valid$/i',
								'^valid$',
								'valid'
							], function(errors) {
								errors.should.be.empty;
							}
						);
					});
					it('will fail if value does not match with "regex" format', function() {
						validator.validate({
							type: 'array', items: [
								{ type: 'string', format: 'regex' }
							]}, [
								'(invalid',
								'[invalid'
							], function(errors) {
								errors.should.not.be.empty;
								errors.should.have.length(2);
							}
						);
					});
				});
				describe('[color]', function() {
					it('can validate', function() {
						validator.validate({
							type: 'array', items: [
								{ type: 'string', format: 'color' }
							]}, [
								'red',
								'#ff0000',
								'rgb(255,0,0)',
								'rgb(100%, 0%, 0%)'
							], function(errors) {
								errors.should.be.empty;
							}
						);
					});
					it('will fail if value does not match with "color" format', function() {
						validator.validate({
							type: 'array', items: [
								{ type: 'string', format: 'color' }
							]}, [
								'invalidcolor',
								'#12',
								'#1234567',
								'#GGGGGG',
								'rgb(256,0,0)',
								'rgb(101%,0,0)',
								'rgb(a,0,0)',
								'rgb(a%,0,0)'
							], function(errors) {
								errors.should.not.be.empty;
								errors.should.have.length(8);
							}
						);
					});
				});
				describe('[style]', function() {
					it('can validate', function() {
						validator.validate({
							type: 'array', items: [
								{ type: 'string', format: 'style' }
							]}, [
								'color:red;',
								'display:none',
								'background: #000 url(image/hoge.gif) no-repeat fixed right bottom;'
							], function(errors) {
								errors.should.be.empty;
							}
						);
					});
					it('will fail if value does not match with "style" format', function() {
						validator.validate({
							type: 'array', items: [
								{ type: 'string', format: 'style' }
							]}, [
								'color-red',
								'color::red'
							], function(errors) {
								errors.should.not.be.empty;
								errors.should.have.length(2);
							}
						);
					});
				});
				describe('[phone]', function() {
					it('can validate', function() {
						validator.validate({
							type: 'array', items: [
								{ type: 'string', format: 'phone' }
							]}, [
								'0120-111-222',
								'+81-0120-111-222',
								'(0120)111-111',
								'(0120) 111 1111',
								'0120111111'
							], function(errors) {
								errors.should.be.empty;
							}
						);
					});
//					it('will fail if value does not match with "phone" format', function() {
//						validator.validate({
//							type: 'array', items: [
//								{ type: 'string', format: 'phone' }
//							]}, [
//								'0120-111-2224567',
//								'a120-111-222',
//								'(0120-111-222',
//								'0120)111-222'
//							], function(errors) {
//								errors.should.not.be.empty;
//								errors.should.have.length(4);
//							}
//						);
//					});
				});
				describe('[uri]', function() {
					it('can validate', function() {
						validator.validate({
							type: 'array', items: [
								{ type: 'string', format: 'uri' }
							]}, [
								'https://github.com/ameba-proteus/proteus-validator',
								'http://some.url/.$,;:&=?!*~@#_()\'',
								'urn:isan:0000-0000-9E59-0000-O-0000-0000-2',
								'urn:lex:eu:council:directive:2010-03-09;2010-19-UE',
								'https://www.google.co.jp/search?q=proteus+%E3%83%97%E3%83%AD%E3%83%86%E3%82%A6%E3%82%B9&aq=f&oq=proteus+%E3%83%97%E3%83%AD%E3%83%86%E3%82%A6%E3%82%B9&aqs=chrome.0.57j0l3j62.3258&sugexp=chrome,mod=17&sourceid=chrome&ie=UTF-8'
							], function(errors) {
								errors.should.be.empty;
							}
						);
					});
					it('will fail if value does not match with "uri" format', function() {
						validator.validate({
							type: 'array', items: [
								{ type: 'string', format: 'uri' }
							]}, [
								'https://github.com/ameba-proteus/proteus-validator\\',
								'https://github.com/ameba-proteus/proteus-validator"',
								'https://github.com/ameba-proteus/proteus-validator|',
								'https://github.com/ameba-proteus/proteus-validator`',
								'https://github.com/ameba-proteus/proteus-validator^',
								'https://github.com/ameba-proteus/proteus-validator<',
								'https://github.com/ameba-proteus/proteus-validator>',
								'https://github.com/ameba-proteus/proteus-validator{',
								'https://github.com/ameba-proteus/proteus-validator}',
								'https://github.com/ameba-proteus/proteus-validator[',
								'https://github.com/ameba-proteus/proteus-validator]'
							], function(errors) {
								errors.should.not.be.empty;
								errors.should.have.length(11);
							}
						);
					});
				});
				describe('[email]', function() {
					it('can validate', function() {
						validator.validate({
							type: 'array', items: [
								{ type: 'string', format: 'email' }
							]}, [
								'matsukaz@gmail.com',
								// http://fightingforalostcause.net/misc/2006/compare-email-regex.php
								'1234567890123456789012345678901234567890123456789012345678901234@iana.org',
								'\"first\\\"last\"@iana.org',
								'\"first@last\"@iana.org',
								'first.last@[12.34.56.78]',
								'first.last@[IPv6:::12.34.56.78]',
								'first.last@[IPv6:1111:2222:3333:4444:5555:6666:7777:8888]',
								'x@x23456789.x23456789.x23456789.x23456789.x23456789.x23456789',
								'first.last@3com.com',
								'first.last@x23456789012345678901234567890123456789012345678901234567890123.iana.org',
								'\"Abc\@def\"@iana.org',
								'customer/department=shipping@iana.org',
								'!def!xyz%abc@iana.org',
								'+1~1+@iana.org',
								'{_test_}@iana.org',
								't*est+test-test@iana.org',
								'test@123.123.123.x123',
								'+@b.c',
								'first.last@[IPv6:0123:4567:89ab:cdef::11.22.33.44]'
							], function(errors) {
								errors.should.be.empty;
							}
						);
					});
					it('will fail if value does not match with "email" format', function() {
						validator.validate({
							type: 'array', items: [
								{ type: 'string', format: 'email' }
							]}, [
								'first.last@[IPv6:1111:2222:3333::4444:5555:12.34.56.78]',
								'first.last@example.123',
								'first.last@com',
								'\"Fred Bloggs\"@iana.org',
								'\"[[ test ]]\"@iana.org',
								'(foo)cal(bar)@(baz)iamcal.com(quux)',
								'cal@iamcal(woo).(yay)com'
							], function(errors) {
								errors.should.not.be.empty;
								errors.should.have.length(7);
							}
						);
					});
				});
				describe('[ip-address]', function() {
					it('can validate', function() {
						validator.validate({
							type: 'array', items: [
								{ type: 'string', format: 'ip-address' }
							]}, [
								'123.123.123.123',
								'1.2.3.4'
							], function(errors) {
								errors.should.be.empty;
							}
						);
					});
					it('will fail if value does not match with "ip-address" format', function() {
						validator.validate({
							type: 'array', items: [
								{ type: 'string', format: 'ip-address' }
							]}, [
								'323.123.123.123',
								'a23.123.123.123',
								'123.123.123'
							], function(errors) {
								errors.should.not.be.empty;
								errors.should.have.length(3);
							}
						);
					});
				});
//				describe('[ipv6]', function() {
//					it('can validate', function() {
//						validator.validate({
//							type: 'array', items: [
//								{ type: 'string', format: 'ipv6' }
//							]}, [
//								'1111:2222:3333:4444:5555:6666:7777:8888',
//								'FE80:0000:0000:0000:0202:B3FF:FE1E:8329',
//								'2001:db8::0:1:0:0:1',
//								'2001:db8:0000:0:1::1',
//								'2001:db8:aaaa:bbbb:cccc:dddd:eeee:1',
//								'2001:db8:0:0:aaaa::1',
//								'[2001:db8:0:0:aaaa::1]:80'
//							], function(errors) {
//								errors.should.be.empty;
//							}
//						);
//					});
//					it('will fail if value does not match with "ipv6" format', function() {
//						validator.validate({
//							type: 'array', items: [
//								{ type: 'string', format: 'ipv6' }
//							]}, [
//								'::01.02.03.04',
//								'0:0:0:255.255.255.255',
//								'1fff::a88:85a3::172.31.128.1',
//								'[2001:db8:0:0:aaaa::1:80',
//								'2001:db8:0:0:aaaa::1]:80'
//							], function(errors) {
//								errors.should.not.be.empty;
//								errors.should.have.length(3);
//							}
//						);
//					});
//				});
				describe('[host-name]', function() {
					it('can validate', function() {
						validator.validate({
							type: 'array', items: [
								{ type: 'string', format: 'host-name' }
							]}, [
								'github.com',
								'vali-D.c-om0'
							], function(errors) {
								errors.should.be.empty;
							}
						);
					});
					it('will fail if value does not match with "host-name" format', function() {
						validator.validate({
							type: 'array', items: [
								{ type: 'string', format: 'host-name' }
							]}, [
								'invalid.com-',
								'invalid.0com',
								'invalid.-com',
								'0invalid.com',
								'invalid-.com',
								'-invalid.com'
							], function(errors) {
								errors.should.not.be.empty;
								errors.should.have.length(6);
							}
						);
					});
				});
			});
			describe('with "enum"', function() {
				it('can validate', function() {
					validator.validate({
						type: 'array', items: [
							{ type: 'string', enum: ['enum1', 'enum2', 'enum3']}
					]}, [
						'enum1',
						'enum2',
						'enum3'
					], function(errors) {
						errors.should.be.empty;
					});
				});
				it('will fail if value is not defined as "enum"', function() {
					validator.validate({
						type: 'array', items: [
							{ type: 'string', enum: ['enum1', 'enum2', 'enum3']}
					]}, [
						'enum4',
						'enum5'
					], function(errors) {
						errors.should.not.be.empty;
						errors.should.have.length(2);
					});
				});
			});
		});
	});
});
