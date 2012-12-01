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
		'date-time'		: '',
		'date'			: '',
		'time'			: '',
		'utc-millisec'		: '',
		'regex'			: '',
		'color'			: '',
		'style'			: '',
		'phone'			: '',
		'uri'			: '',
		'email'			: '',
		'ip-address'		: '',
		'ipv6'			: '',
		'host-name'		: '',
		'alpha'			: '',
		'alphanumeric'		: ''
	}

	var Schema = (function(){

		var validate = function(schema) {
			var errors = [];

			// if not object
			if (!_.isObject(schema)) {
				errors.push('Schema must be an object.');
				return errors;
			}
			return validateObject(schema, errors);
		}

		var validateObject = function(schema, errors) {
			// need type property
			if (!_.has(schema, PROP_TYPE)) {
				errors.push('Schema must contain "' + PROP_TYPE + '" property.');
				return errors;
			}

			// check required property
			if (_.has(schema, PROP_REQUIRED)) {
				if (!_.isBoolean(schema[PROP_REQUIRED])) {
					errors.push('"' + PROP_REQUIRED + '" property\'s value must be "boolean".');
				}
			}

			switch(schema.type) {
				case TYPE_STRING:
				case TYPE_NUMBER:
				case TYPE_INTEGER:
				case TYPE_BOOLEAN:
				case TYPE_NULL:
				case TYPE_DATE:
				case TYPE_ANY:
					return validateProperty(schema, errors);
				case TYPE_OBJECT:
					if (_.has(schema, PROP_ADDITIONAL_PROPERTIES)) {
						if (_.isObject(schema[PROP_ADDITIONAL_PROPERTIES])) {
							validateObject(schema[PROP_ADDITIONAL_PROPERTIES], errrors);
						} else {
							if (!_.isBoolean(schema[PROP_ADDITIONAL_PROPERTIES])) {
								errors.push('"' + PROP_ADDITIONAL_PROPERTIES + '" property\'s value must be "boolean" or "object".');
							}
						}
					}
					if (_.has(schema, PROP_PROPERTIES)) {
						if (!_.isObject(schema[PROP_PROPERTIES])) {
							errors.push('"' + PROP_PROPERTIES + '" property\'s value must be "object".');
						} else {
							for (var key in schema[PROP_PROPERTIES]) {
								validateObject(schema[PROP_PROPERTIES][key], errors);
							}
						}
					}
				case TYPE_ARRAY:
					if (_.has(schema, PROP_ITEMS)) {
						if (!_.isObject(schema[PROP_ITEMS])) {
							errors.push('"' + PROP_ITEMS + '" property\'s value must be "object".');
						} else {
							validateObject(schema[PROP_ITEMS], errors);
						}
					}
					if (_.has(schema, PROP_MIN_ITEMS)) {
						if (!_.isNumber(schema[PROP_MIN_ITEMS]) || schema[PROP_MIN_ITEMS] < 0) {
							errors.push('"' + PROP_MIN_ITEMS + '" property\'s value must be a number greater than or equal to 0.');
						}
					}
					if (_.has(schema, PROP_MAX_ITEMS)) {
						if (!_.isNumber(schema[PROP_MAX_ITEMS]) || schema[PROP_MAX_ITEMS] <= 0) {
							errors.push('"' + PROP_MAX_ITEMS + '" property\'s value must be a number greater than 0.');
						}
					}
			}
			return errors;
		}

		var validateProperty = function(schema, errors) {
		
			switch(schema[PROP_TYPE]) {
				case TYPE_STRING:
					if (_.has(schema, PROP_MIN_LENGTH)) {
						if (!_.isNumber(schema[PROP_MIN_LENGTH]) || schema[PROP_MIN_LENGTH] < 0) {
							errors.push('"' + PROP_REQUIRED + '" property\'s value must be a number greater than or equal to 0.');
						}
					}
					if (_.has(schema, PROP_MAX_LENGTH)) {
						if (!_.isNumber(schema[PROP_MAX_LENGTH]) || schema[PROP_MAX_LENGTH] <= 0) {
							errors.push('"' + PROP_MAX_LENGTH + '" property\'s value must be a number greater than 0.');
						}
					}
					if (_.has(schema, PROP_PATTERN)) {
						if (!_.isRegExp(schema[PROP_PATTERN])) {
							errors.push('"' + PROP_PATTERN + '" property\'s value must be "RegExp".');
						}
					}
					if (_.has(schema, PROP_FORMAT)) {
						if (!_.has(FORMATS, schema[PROP_FORMAT])) {
							errors.push('"' + PROP_FORMAT + '" property\'s value is invalid.');
						}
					}
					break;
				case TYPE_NUMBER:
					if (_.has(schema, PROP_MINIMUM)) {
						if (!_.isNumber(schema[PROP_MINIMUM])) {
							errors.push('"' + PROP_MINIMUM + '" property\'s value must be a number.');
						}
					}
					if (_.has(schema, PROP_MAXIMUM)) {
						if (!_.isNumber(schema[PROP_MAXIMUM])) {
							errors.push('"' + PROP_MAXIMUM + '" property\'s value must be a number.');
						}
					}
					if (_.has(schema, PROP_EXCLUSIVE_MINIMUM)) {
						if (!_.isNumber(schema[PROP_EXCLUSIVE_MINIMUM])) {
							errors.push('"' + PROP_EXCLUSIVE_MINIMUM + '" property\'s value must be a number.');
						}
					}
					if (_.has(schema, PROP_EXCLUSIVE_MAXIMUM)) {
						if (!_.isNumber(schema[PROP_EXCLUSIVE_MAXIMUM])) {
							errors.push('"' + PROP_EXCLUSIVE_MAXIMUM + '" property\'s value must be a number.');
						}
					}
					break;
				case TYPE_INTEGER:
					if (_.has(schema, PROP_MINIMUM)) {
						if (!_.isNumber(schema[PROP_MINIMUM]) || schema[PROP_MINIMUM] % 1 !== 0) {
							errors.push('"' + PROP_MINIMUM + '" property\'s value must be a number with no digits.');
						}
					}
					if (_.has(schema, PROP_MAXIMUM)) {
						if (!_.isNumber(schema[PROP_MAXIMUM]) || schema[PROP_MAXIMUM] % 1 !== 0) {
							errors.push('"' + PROP_MAXIMUM + '" property\'s value must be a number with no digits.');
						}
					}
					if (_.has(schema, PROP_EXCLUSIVE_MINIMUM)) {
						if (!_.isNumber(schema[PROP_EXCLUSIVE_MINIMUM]) || schema[PROP_MINIMUM] % 1 !== 0) {
							errors.push('"' + PROP_EXCLUSIVE_MINIMUM + '" property\'s value must be a number with no digits.');
						}
					}
					if (_.has(schema, PROP_EXCLUSIVE_MAXIMUM)) {
						if (!_.isNumber(schema[PROP_EXCLUSIVE_MAXIMUM]) || schema[PROP_MAXIMUM] % 1 !== 0) {
							errors.push('"' + PROP_EXCLUSIVE_MAXIMUM + '" property\'s value must be a number with no digits.');
						}
					}
					break;
				case TYPE_BOOLEAN:
					// nothing to validate
					break;
				case TYPE_NULL:
					// nothing to validate
					break;
				case TYPE_DATE:
					// nothing to validate
					break;
				case TYPE_ANY:
					// nothing to validate
					break;
			}
			return errors;
		}


//		var validateRequired = function(schema) {
//			if (_.has(schema.required)) {
//				if (!_.isBoolean(schema.required)) {
//					throw new Error('"required" property value must be boolean.');
//				}
//			}
//		}

		return {
			validate: validate
		}
	})();


	var Validator = function() {
		this.validations = {};
		this.schemas = {};
	}

//	/**
//	* Primitive Types
//	*/
//	var PRIMITIVE_TYPES = [
//		'string',
//		'number',
//		'function',
//		'boolean',
//		'int',
//		'null'
//	];
//
//	var PROPS = [
//		'type',
//		'required'
//	];





	/**
	* _Validator.validate
	*
	* @param {object} obj
	* @param {object} schema
	* @param {function} callback
	*/
	Validator.prototype.validate = function(obj, schema, callback) {

		// validate schema
		if (Schema.validate(schema)) {
			// TODO error
		}



//		// validate obj
//		if (primitiveTypes.indexOf(schema.type) !== -1 ) {
//			return this.validateProp(undefined, obj, schema, callback);
//		}
//
//		if (schema.type === 'object') {
//			return this.validateSchema(obj, schema, '', callback);
//		}
//
//		if (schema.type === 'array') {
//			return this.validateSchema(obj, schema, '', callback);
//		}
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

