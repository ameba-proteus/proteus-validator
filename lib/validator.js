// need underscore module
var _ = 'undefined' === typeof _ ? require('underscore') : _;

/**
 * Validator module
 */
(function(){

	var PROP_TYPE						= 'type';
	var PROP_PROPERTIES					= 'properties';
	var PROP_ADDITIONAL_PROPERTIES		= 'additionalProperties';
	var PROP_ITEMS						= 'items';
	var PROP_REQUIRED					= 'required';
	var PROP_MINIMUM					= 'minimum';
	var PROP_MAXIMUM					= 'maximum';
	var PROP_EXCLUSIVE_MINIMUM			= 'exclusiveMinimum';
	var PROP_EXCLUSIVE_MAXIMUM			= 'exclusiveMaximum';
	var PROP_MIN_ITEMS					= 'minItems';
	var PROP_MAX_ITEMS					= 'maxItems';
	var PROP_PATTERN					= 'pattern';
	var PROP_MIN_LENGTH					= 'minLength';
	var PROP_MAX_LENGTH					= 'maxLength';
	var PROP_ENUM						= 'enum';
	var PROP_TITLE						= 'title';
	var PROP_DESCRIPTION				= 'description';
	var PROP_FORMAT						= 'format';

	var TYPE_STRING			= 'string';
	var TYPE_NUMBER			= 'number';
	var TYPE_INTEGER		= 'integer';
	var TYPE_BOOLEAN		= 'boolean';
	var TYPE_NULL			= 'null';
	var TYPE_DATE			= 'date';
	var TYPE_ANY			= 'any';
	var TYPE_OBJECT			= 'object';
	var TYPE_ARRAY			= 'array';

	var FORMATS = {
		'date-time'			: '',
		'date'				: '',
		'time'				: '',
		'utc-millisec'		: '',
		'regex'				: '',
		'color'				: '',
		'style'				: '',
		'phone'				: '',
		'uri'				: '',
		'email'				: '',
		'ip-address'		: '',
		'ipv6'				: '',
		'host-name'			: '',
		'alpha'				: '',
		'alphanumeric'		: ''
	}

	var Schema = (function(){
		var errors;

		var error = function(msg) {
			errors.push(msg);
		}

		var errorProperty = function(property, expected, actual) {
			errors.push('property "' + property + '" must be ' + expected + ' [' + actual + ']');
		}

		var validate = function(schema) {
			// initialize errors
			errors = [];

			// if not object
			if (!_.isObject(schema)) {
				error('schema must be type of "object"');
				return errors;
			}

			validateObject(schema);
			return errors;
		}

		var validateObject = function(schema) {
			// need type property
			if (!_.has(schema, PROP_TYPE)) {
				error('schema must contain "' + PROP_TYPE + '" property.');
				return;
			}

			// check required property
			validateRequired(schema);

			switch(schema.type) {
				case TYPE_STRING:
				case TYPE_NUMBER:
				case TYPE_INTEGER:
				case TYPE_BOOLEAN:
				case TYPE_NULL:
				case TYPE_DATE:
				case TYPE_ANY:
					validateProperty(schema, errors);
					break;
				case TYPE_OBJECT:
					validateAdditionalProperties(schema);
					validateProperties(schema);
					break;
				case TYPE_ARRAY:
					if (_.has(schema, PROP_ITEMS)) {
						var v = schema[PROP_ITEMS];
						if (!_.isObject(v)) {
							errorProperty(PROP_ITEMS, ' of type "object"', v);
						} else {
							validateObject(v, errors);
						}
					}
					validateMinItems(schema);
					validateMaxItems(schema);
					break;
				default:
					errors.push('invalid type.');
			}
			return errors;
		}

		var validateProperty = function(schema) {
			switch(schema[PROP_TYPE]) {
				case TYPE_STRING:
					validateMinLength(schema);
					validateMaxLength(schema);
					validatePattern(schema);
					validateFormat(schema);
					break;
				case TYPE_NUMBER:
					validateMinimum(schema, false);
					validateMaximum(schema, false);
					validateExclusiveMinimum(schema, false);
					validateExclusiveMaximum(schema, false);
					break;
				case TYPE_INTEGER:
					validateMinimum(schema, true);
					validateMaximum(schema, true);
					validateExclusiveMinimum(schema, true);
					validateExclusiveMaximum(schema, true);
					break;
				case TYPE_BOOLEAN:
				case TYPE_NULL:
				case TYPE_DATE:
				case TYPE_ANY:
					// nothing to validate
					break;
			}
			return errors;
		}

		var validateBoolean = function(schema, property) {
			var v = schema[property];
			if (!_.isBoolean(v)) {
				errorProperty(property, 'of type "boolean"', v);
			}
		}

		var validateInteger = function(schema, property, positiveOnly) {
			var v = schema[property];
			if (!_.isNumber(v) || v % 1 !== 0 || (positiveOnly ? v < 0 : false)) {
				errorProperty(property, 'of type "number" with no digits' + (positiveOnly ? ' greather than or equal to 0' : ''), v);
			}
		}

		var validateNumber = function(schema, property, positiveOnly) {
			var v = schema[property];
			if (!_.isNumber(v) || (positiveOnly ? v < 0 : false)) {
				errorProperty(property, 'of type "number"' + (positiveOnly ? ' greater than or equal to 0' : ''), v);
			}
		}

		var validateRequired = function(schema) {
			if (_.has(schema, PROP_REQUIRED)) {
				validateBoolean(schema, PROP_REQUIRED);
			}
		}

		var validateMinLength = function(schema) {
			if (_.has(schema, PROP_MIN_LENGTH)) {
				validateInteger(schema, PROP_MIN_LENGTH, true);
			}
		}

		var validateMaxLength = function(schema) {
			if (_.has(schema, PROP_MAX_LENGTH)) {
				validateInteger(schema, PROP_MAX_LENGTH, true);
			}
		}

		var validatePattern = function(schema) {
			if (_.has(schema, PROP_PATTERN)) {
				var v = schema[PROP_PATTERN];
				if (!_.isRegExp(v)) {
					errorProperty(PROP_PATTERN, 'of type "RegExp"', v);
				}
			}
		}

		var validateFormat = function(schema) {
			if (_.has(schema, PROP_FORMAT)) {
				var v = schema[PROP_FORMAT];
				if (!_.has(FORMATS, v)) {
					errorProperty(PROP_FORMAT, 'one of "' + FORMATS.join('|') + '"', v);
				}
			}
		}

		var validateMinimum = function(schema, noDigits) {
			if (_.has(schema, PROP_MINIMUM)) {
				if (noDigits) {
					validateInteger(schema, PROP_MINIMUM, false);
				} else {
					validateNumber(schema, PROP_MINIMUM, false);
				}
			}
		}

		var validateMaximum = function(schema, noDigits) {
			if (_.has(schema, PROP_MAXIMUM)) {
				if (noDigits) {
					validateInteger(schema, PROP_MAXIMUM, false);
				} else {
					validateNumber(schema, PROP_MAXIMUM, false);
				}
			}
		}

		var validateExclusiveMinimum = function(schema, noDigits) {
			if (_.has(schema, PROP_EXCLUSIVE_MINIMUM)) {
				if (noDigits) {
					validateInteger(schema, PROP_EXCLUSIVE_MINIMUM, false);
				} else {
					validateNumber(schema, PROP_EXCLUSIVE_MINIMUM, false);
				}
			}
		}

		var validateExclusiveMaximum = function(schema, noDigits) {
			if (_.has(schema, PROP_EXCLUSIVE_MAXIMUM)) {
				if (noDigits) {
					validateInteger(schema, PROP_EXCLUSIVE_MAXIMUM, false);
				} else {
					validateNumber(schema, PROP_EXCLUSIVE_MAXIMUM, false);
				}
			}
		}

		var validateMinItems = function(schema) {
			if (_.has(schema, PROP_MIN_ITEMS)) {
				validateInteger(schema, PROP_MIN_ITEMS, true);
			}
		}

		var validateMaxItems = function(schema) {
			if (_.has(schema, PROP_MAX_ITEMS)) {
				validateInteger(schema, PROP_MAX_ITEMS, true);
			}
		}

		var validateAdditionalProperties = function(schema) {
			if (_.has(schema, PROP_ADDITIONAL_PROPERTIES)) {
				var v = schema[PROP_ADDITIONAL_PROPERTIES];
				if (_.isObject(v)) {
					validateObject(v, errrors);
				} else {
					if (!_.isBoolean(v)) {
						errorProperty(PROP_ADDITIONAL_PROPERTIES, 'of type "boolean" or "object"', v);
					}
				}
			}
		}

		var validateProperties = function(schema) {
			if (_.has(schema, PROP_PROPERTIES)) {
				var v = schema[PROP_PROPERTIES];
				if (!_.isObject(v)) {
					errorProperty(PROP_PROPERTIES, 'of type "object"', v);
				} else {
					for (var key in v) {
						validateObject(v[key], errors);
					}
				}
			}
		}

		return {
			validate: validate
		}
	})();


	var Validator = function() {
		this.validations = {};
		this.schemas = {};
	}






	/**
	* _Validator.validate
	*
	* @param {object} obj
	* @param {object} schema
	* @param {function} callback
	*/
	Validator.prototype.validate = function(obj, schema, callback) {

		// validate schema
		var errors = Schema.validate(schema);

		if (_.isEmpty(errors)) {
			return;
		}


	}


	/**
	 * Validation.validateProp
	 *
	 * @param {string} name
	 * @param {string|object} value
	 * @param {object} schema
	 * @param {function} callback
	 */
	Validator.prototype.validateProp = function(prop, value, schema, callback) {


		// skip if it's not a required param and it's empty
		if (schema.required !== true && _.isUndefined(value)) {
			return callback();
		}

		
	}

	/**
	* _Validator.addValidation
	*
	* @param {object} obj
	* @param {function} fn
	*/
	Validator.prototype.addValidation = function(name, fn) {
		this.validations[name] = fn;
	}

	/**
	* _Validator.registSchema
	*
	* @param {object} obj
	* @param {object} schema
	*/
	Validator.prototype.registSchema = function(name, schema) {
		this.schemas[name] = schema;
	}










	function createInstance() {
		var _validator = new Validator();
		return {
			/**
			* check if schema is valid
			*
			* @param {object} schema
			*/
			validateSchema : function(schema) {
				return Schema.validate(schema);
			},

			/**
			* validate
			*
			* @param {object} obj
			* @param {object} schema
			* @param {function} callback
			*/
			validate : function(obj, schema, callback) {
				_validator.validate(obj, schema, callback);
			},

			/**
			* add original validation
			*
			* @param {object} obj
			* @param {function} fn
			*/
			addValidation : function(name, fn) {
				_validator.addValidation(name, fn);
			},

			/**
			* regist schema
			*
			* @param {object} obj
			* @param {object} schema
			*/
			registSchema : function(name, schema) {
				_validator.registSchema(name, schema);
			},

			/**
			* create new validator
			*/
			createValidator : function() {
				return createInstance();
			}
		}
	};
	var instance = createInstance();


	// export
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = instance;
	} else if (typeof define !== 'undefined') {
		define(function() {
			return instance;
		});
	} else {
		var oldModule = this.validator;
		this.validator = instance;
		return {
			noConflict: function() {
				this.validator = oldModule;
				return instance;
			}
		};
	}

})();

