// dependent modules
var _ = 'undefined' === typeof _ ? require('underscore') : _;
var async = 'undefined' === typeof async ? require('async') : async;

/**
 * Validator module
 */
(function(){

	/**
	* properties
	*/
	var PROPERTIES = {
		TYPE					: 'type',
		PROPERTIES				: 'properties',
		ADDITIONAL_PROPERTIES	: 'additionalProperties',
		ITEMS					: 'items',
		REQUIRED				: 'required',
		MINIMUM					: 'minimum',
		MAXIMUM					: 'maximum',
		EXCLUSIVE_MINIMUM		: 'exclusiveMinimum',
		EXCLUSIVE_MAXIMUM		: 'exclusiveMaximum',
		MIN_ITEMS				: 'minItems',
		MAX_ITEMS				: 'maxItems',
		PATTERN					: 'pattern',
		MIN_LENGTH				: 'minLength',
		MAX_LENGTH				: 'maxLength',
		ENUM					: 'enum',
		TITLE					: 'title',
		DESCRIPTION				: 'description',
		FORMAT					: 'format'
	};

	/**
	* types
	*/
	var TYPES = {
		STRING		: 'string',
		NUMBER		: 'number',
		INTEGER		: 'integer',
		BOOLEAN		: 'boolean',
		NULL		: 'null',
		ANY			: 'any',
		OBJECT		: 'object',
		ARRAY		: 'array'
	};

	/**
	* formats
	*/
	var FORMATS = {
		/**
		 * This SHOULD be a date in ISO 8601 format of YYYY-MM-DDThh:mm:ssZ in UTC time.
		 * This is the recommended form of date/timestamp.
		 */
		'date-time':
			/^\d{4}-(?:0[0-9]{1}|1[0-2]{1})-[0-9]{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,

		/**
		 * This SHOULD be a date in the format of YYYY-MM-DD.
		 * It is recommended that you use the "date-time" format
		 * instead of "date" unless you need to transfer only the date part.
		 */
		'date'
			: /^\d{4}-(?:0[0-9]{1}|1[0-2]{1})-[0-9]{2}$/,

		/**
		 * This SHOULD be a time in the format of hh:mm:ss.
		 * It is recommended that you use the "date-time" format
		 * instead of "time" unless you need to transfer only the time part.
		 */
		'time'
			: /^\d{2}:\d{2}:\d{2}$/,

		/**
		 * This SHOULD be the difference, measured in milliseconds,
		 * between the specified time and midnight, 00:00 of January 1, 1970 UTC.
		 * The value SHOULD be a number (integer or float).
		 */
		'utc-millisec'
			: function(input) { return _.isNumber(input);},

		/**
		 * A regular expression, following the regular expression specification
		 * from ECMA 262/Perl 5.
		 */
		'regex'
		// TODO
			: function(input) { return true;},

		/**
		 * This is a CSS color (like "#FF0000" or "red"),
		 * based on CSS 2.1 [W3C.CR-CSS21-20070719].
		 */
		'color'
			: /(#?([0-9A-Fa-f]{3,6})\b)|(maroon)|(red)|(orange)|(yellow)|(olive)|(purple)|(fuchsia)|(white)|(lime)|(green)|(navy)|(blue)|(aqua)|(teal)|(black)|(silver)|(gray)|(rgb\(\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*\))|(rgb\(\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*\))/,

		/**
		 * This is a CSS style definition (like "color: red; background-color:#FFF"),
		 * based on CSS 2.1 [W3C.CR-CSS21-20070719].
		 */
		'style'
		// TODO
			: function(input) { return true;},

		/**
		 * This SHOULD be a phone number (format MAY follow E.123).
		 */
		'phone'
		// TODO
			: function(input) { return true;},

		/**
		 * This value SHOULD be a URI.
		 */
		'uri'
			: /^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|cat|coop|int|pro|tel|xxx|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2})?)|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/,

		/**
		 * This SHOULD be an email address.
		 */
		'email'
			: /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/,

		/**
		 * This SHOULD be an ip version 4 address.
		 */
		'ip-address':
		   	/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,

		/**
		 * This SHOULD be an ip version 6 address.
		 */
		'ipv6'
			: /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,

		/**
		 * This SHOULD be a host-name.
		 */
		'host-name'
			: /^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/
	}

	/**
	* Schema constructor
	*
	* @param {object} schema
	*/
	var Schema = function(schema){
		this.errors;
		this.schema = schema;
	}

	/**
	* Schema.error
	*
	* @param {string} path (JSONPath format)
	* @param {string} property
	* @param {string} message
	* @param actual
	*/
	Schema.prototype.error = function(path, property, message, actual) {
		pushError(this.errors, path, property, message, actual);
	}
	
	/**
	* Schema.validate
	*
	* @returns {object} errors
	*/
	Schema.prototype.validate = function() {
		// initialize errors
		this.errors = [];
	
		this.validateObject(this.schema, '$');
		return this.errors;
	}

	/**
	* Schema.validateObject
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateObject = function(schema, path) {

			// check schema is an object and not null
		if (!_.isObject(schema) || _.isFunction(schema) || _.isArray(schema) || _.isNull(schema)) {
			this.error(path, '', 'must be of type \'object\' and not null', typeof schema);
			return;
		}
	
		// schema needs type property
		if (!_.has(schema, PROPERTIES.TYPE)) {
			this.error(path, '', 'must contain \'' + PROPERTIES.TYPE + '\' property', null);
			return;
		}

		// check required property
		this.validateRequired(schema, path);

		// check each properties depending on it's type
		switch(schema[PROPERTIES.TYPE]) {
			case TYPES.STRING:
				this.validateMinLength(schema, path);
				this.validateMaxLength(schema, path);
				this.validatePattern(schema, path);
				this.validateFormat(schema, path);
				break;
			case TYPES.NUMBER:
				this.validateMinimum(schema, path, false);
				this.validateMaximum(schema, path, false);
				this.validateExclusiveMinimum(schema, path, false);
				this.validateExclusiveMaximum(schema, path, false);
				break;
			case TYPES.INTEGER:
				this.validateMinimum(schema, path, true);
				this.validateMaximum(schema, path, true);
				this.validateExclusiveMinimum(schema, path, true);
				this.validateExclusiveMaximum(schema, path, true);
				break;
			case TYPES.BOOLEAN:
			case TYPES.NULL:
			case TYPES.ANY:
				// nothing to validate
				break;
			case TYPES.OBJECT:
				this.validateAdditionalProperties(schema, path);
				this.validateProperties(schema, path);
				break;
			case TYPES.ARRAY:
				// check items
				if (_.has(schema, PROPERTIES.ITEMS)) {
					var items = schema[PROPERTIES.ITEMS];
					// if items are an array
					if (_.isArray(items)) {
						for (var i = 0; i < items.length; i++) {
							this.validateObject(items[i], createJSONPath(createJSONPath(path, PROPERTIES.ITEMS), i));
						}
					} else {
						this.validateObject(items, createJSONPath(path, PROPERTIES.ITEMS));
					}
				}
				this.validateMinItems(schema, path);
				this.validateMaxItems(schema, path);
				break;
			default:
				this.error(path, PROPERTIES.TYPE, 'must be one of \'' + _.values(TYPES).join(' | ') + '\'', schema[PROPERTIES.TYPE]);
				break;
		}
	}

	/**
	* Schema.validateBoolean
	*
	* @param {object} schema
	* @param {string} path
	* @param {string} property
	*/
	Schema.prototype.validateBoolean = function(schema, path, property) {
		var v = schema[property];
		if (!_.isBoolean(v)) {
			this.error(path, property, 'must be of type \'boolean\'', typeof v);
		}
	}

	/**
	* Schema.validateInteger
	*
	* @param {object} schema
	* @param {string} path
	* @param {string} property
	* @param {string} positiveOnly
	*/
	Schema.prototype.validateInteger = function(schema, path, property, positiveOnly) {
		var v = schema[property];
		if (!_.isNumber(v) || v % 1 !== 0 || (positiveOnly ? v < 0 : false)) {
			this.error(path, property, 'must be of type \'number\' with no digits' + (positiveOnly ? ' greather than or equal to 0' : ''), v);
		}
	}

	/**
	* Schema.validateNumber
	*
	* @param {object} schema
	* @param {string} path
	* @param {string} property
	* @param {string} positiveOnly
	*/
	Schema.prototype.validateNumber = function(schema, path, property, positiveOnly) {
		var v = schema[property];
		if (!_.isNumber(v) || (positiveOnly ? v < 0 : false)) {
			this.error(path, property, 'must be of type \'number\'' + (positiveOnly ? ' greater than or equal to 0' : ''), v);
		}
	}

	/**
	* Schema.validateRequired
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateRequired = function(schema, path) {
		if (_.has(schema, PROPERTIES.REQUIRED)) {
			this.validateBoolean(schema, path, PROPERTIES.REQUIRED);
		}
	}

	/**
	* Schema.validateMinLength
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateMinLength = function(schema, path) {
		if (_.has(schema, PROPERTIES.MIN_LENGTH)) {
			this.validateInteger(schema, path, PROPERTIES.MIN_LENGTH, true);
		}
	}

	/**
	* Schema.validateMaxLength
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateMaxLength = function(schema, path) {
		if (_.has(schema, PROPERTIES.MAX_LENGTH)) {
			this.validateInteger(schema, path, PROPERTIES.MAX_LENGTH, true);
		}
	}

	/**
	* Schema.validatePattern
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validatePattern = function(schema, path) {
		if (_.has(schema, PROPERTIES.PATTERN)) {
			var v = schema[PROPERTIES.PATTERN];
			if (!_.isString(v)) {
				this.error(path, PROPERTIES.PATTERN, 'must be of type \'string\'', typeof v);
			}
		}
	}

	/**
	* Schema.validateFormat
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateFormat = function(schema, path) {
		if (_.has(schema, PROPERTIES.FORMAT)) {
			var v = schema[PROPERTIES.FORMAT];
			if (!_.has(FORMATS, v)) {
				this.errorProperty(path, PROPERTIES.FORMAT, 'must be one of \'' + FORMATS.join(' | ') + '\'', v);
			}
		}
	}

	/**
	* Schema.validateMinimum
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateMinimum = function(schema, path, noDigits) {
		if (_.has(schema, PROPERTIES.MINIMUM)) {
			if (noDigits) {
				this.validateInteger(schema, path, PROPERTIES.MINIMUM, false);
			} else {
				this.validateNumber(schema, path, PROPERTIES.MINIMUM, false);
			}
		}
	}

	/**
	* Schema.validateMaximum
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateMaximum = function(schema, path, noDigits) {
		if (_.has(schema, PROPERTIES.MAXIMUM)) {
			if (noDigits) {
				this.validateInteger(schema, path, PROPERTIES.MAXIMUM, false);
			} else {
				this.validateNumber(schema, path, PROPERTIES.MAXIMUM, false);
			}
		}
	}

	/**
	* Schema.validateExclusiveMinimum
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateExclusiveMinimum = function(schema, path) {
		if (_.has(schema, PROPERTIES.EXCLUSIVE_MINIMUM)) {
			this.validateBoolean(schema, path, EXCLUSIVE_MINIMUM);
		}
	}

	/**
	* Schema.validateExclusiveMaximum
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateExclusiveMaximum = function(schema, path) {
		if (_.has(schema, PROPERTIES.EXCLUSIVE_MAXIMUM)) {
			this.validateBoolean(schema, path, EXCLUSIVE_MAXIMUM);
		}
	}

	/**
	* Schema.validateMinItems
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateMinItems = function(schema, path) {
		if (_.has(schema, PROPERTIES.MIN_ITEMS)) {
			this.validateInteger(schema, path, PROPERTIES.MIN_ITEMS, true);
		}
	}

	/**
	* Schema.MaxItems
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateMaxItems = function(schema, path) {
		if (_.has(schema, PROPERTIES.MAX_ITEMS)) {
			this.validateInteger(schema, path, PROPERTIES.MAX_ITEMS, true);
		}
	}

	/**
	* Schema.validateAdditionalProperties
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateAdditionalProperties = function(schema, path) {
		if (_.has(schema, PROPERTIES.ADDITIONAL_PROPERTIES)) {
			var v = schema[PROPERTIES.ADDITIONAL_PROPERTIES];
			// if additionalProperties are not of type boolean
			if (!_.isBoolean(v)) {
				this.validateObject(v, createJSONPath(path, PROPERTIES.ADDITIONAL_PROPERTIES));
			}
		}
	}

	/**
	* Schema.validateProperties
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateProperties = function(schema, path) {
		if (_.has(schema, PROPERTIES.PROPERTIES)) {
			var v = schema[PROPERTIES.PROPERTIES];
			if (!_.isObject(v) || _.isFunction(v) || _.isArray(v)) {
				this.error(path, PROPERTIES.PROPERTIES, 'must be of type \'object\'', typeof v);
			} else {
				// validate each property
				for (var key in v) {
					this.validateObject(v[key], createJSONPath(path, key));
				}
			}
		}
	}

	/**
	* Validator constructor
	*
	* @param {object} validations
	* @param {object} schema
	*/
	var Validator = function(validations, schema) {
		this.validations = validations;
		this.schema = schema;
		this.errors;
	}

	/**
	* Validator.error
	*
	* @param {string} path (JSONPath format)
	* @param {string} property
	* @param {string} message
	* @param actual
	*/
	Validator.prototype.error = function(path, property, message, actual) {
		pushError(this.errors, path, property, message, actual);
	}
	
	/**
	* Validator.validate
	*
	* @param instance
	* @returns {object} errors
	*/
	Validator.prototype.validate = function(instance) {
		// initialize errors
		this.errors = [];
		var path = '$';

		this.validateProperty(this.schema, instance, path);
		return this.errors;
	}
		
	/**
	 * Validator.validateProperty
	 *
	 * @param {object} schema
	 * @param instance
	 * @param {string} path
	 */
	Validator.prototype.validateProperty = function(schema, instance, path) {

		// check type is not null nor any and instance is not null
		if (!(schema[PROPERTIES.TYPE] === TYPES.NULL || schema[PROPERTIES.TYPE] === TYPES.ANY) && _.isNull(instance)) {
			this.error(path, '', 'must not be null');
			return;
		}

		this.validateCustomValidation(schema, instance, path);

		// check each properties depending on it's type
		switch(schema[PROPERTIES.TYPE]) {
			case TYPES.STRING:
				this.validateString(schema, instance, path);
				break;
			case TYPES.NUMBER:
				this.validateNumber(schema, instance, path);
				break;
			case TYPES.INTEGER:
				this.validateInteger(schema, instance, path);
				break;
			case TYPES.BOOLEAN:
				this.validateBoolean(schema, instance, path);
				break;
			case TYPES.OBJECT:
				// check instance is an object
				if (!_.isObject(instance) || _.isFunction(instance) || _.isArray(instance)) {
					this.error(path, '', 'must be of type \'object\'', typeof instance);
					break;
				}

				// check each property from schema perspective to check required property
				for (var property in schema[PROPERTIES.PROPERTIES]) {
					if(schema[PROPERTIES.PROPERTIES][property][PROPERTIES.REQUIRED]) {
						if (!_.has(instance, property)) {
							this.error(path, property, 'property is required');
						}
					}
				}

				// check each property from instance perspective
				for (var property in instance) {
					// if property is not defined in schema
					if (!_.has(schema[PROPERTIES.PROPERTIES], property)) {
						// ignore if addtionalProperties are 'true'
						if (schema[PROPERTIES.ADDITIONAL_PROPERTIES]) {
							continue;
						}
						this.error(path, '', 'undefined property in schema', property);
						continue;
					}
					var value = instance[property];
					var nextSchema = schema[PROPERTIES.PROPERTIES][property];
					var nextPath = createJSONPath(path, property);

					this.validateProperty(nextSchema, value, nextPath);
				}
				break;
			case TYPES.ARRAY:
				// check instance is an array
				if (!_.isArray(instance)) {
					this.error(path, '', 'must be of type \'Array\'', typeof instance);
					break;
				}

				this.validateMinItems(schema, instance, path);
				this.validateMaxItems(schema, instance, path);

				// check all elements in an array if 'items' is defined in schema
				if (_.has(schema, PROPERTIES.ITEMS)) {
					var items = schema[PROPERTIES.ITEMS];
					var nextPath = createJSONPath(path, property);
					for (var i = 0; i < instance.length; i++) {
						var value = instance[i];
						// if 'items' are defined as an array, need to validate each element in an array
						if (_.isArray(items)) {
							// backup current errors to get errors by 'items' validation
							var backup = this.errors;
							this.errors = [];
							var itemErrorCount = 0;
							for (var j = 0; j < items.length; j++) {
								this.validateProperty(items[j], value, createJSONPath(nextPath, j));
								// if there are any errors, count up
								if (!_.isEmpty(this.errors)) {
									itemErrorCount++;
									this.errors = [];
								}
							}
							this.errors = backup;
							// if all validations defined in 'items' fails
							if (items.length === itemErrorCount) {
								this.error(nextPath, i, 'must match with schema of type \'array\'', value);
							}
						} else {
							this.validateProperty(items, value, createJSONPath(nextPath, i));
						}
					}
				}
				break;
		}
	}

	/**
	* Validator.validateString
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateString = function(schema, instance, path) {
		if (!_.isString(instance)) {
			this.error(path, '', 'must be of type \'string\'', typeof instance);
			return;
		}
		this.validateMinLength(schema, instance, path);
		this.validateMaxLength(schema, instance, path);
		this.validatePattern(schema, instance, path);
		this.validateFormat(schema, instance, path);
	}

	/**
	* Validator.validateMinLength
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateMinLength = function(schema, instance, path) {
		if (_.has(schema, PROPERTIES.MIN_LENGTH)) {
			var minLength = schema[PROPERTIES.MIN_LENGTH];
			if (instance.length < minLength) {
				this.error(path, '', 'length must be greater than \'' + minLength + '\'', instance);
			}
		}
	}

	/**
	* Validator.validateMaxLength
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateMaxLength = function(schema, instance, path) {
		if (_.has(schema, PROPERTIES.MAX_LENGTH)) {
			var maxLength = schema[PROPERTIES.MAX_LENGTH];
			if (maxLength < instance.length) {
				this.error(path, '', 'length must be less than \'' + maxLength + '\'', instance);
			}
		}
	}

	/**
	* Validator.validatePattern
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validatePattern = function(schema, instance, path) {
		if (_.has(schema, PROPERTIES.PATTERN)) {
			var pattern = schema[PROPERTIES.PATTERN];
			if (!instance.match(pattern)) {
				this.error(path, '', 'must match against the regular expression \'' + pattern + '\'', instance);
			}
		}
	}

	/**
	* Validator.validateFormat
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateFormat = function(schema, instance, path) {
		if (_.has(schema, PROPERTIES.FORMAT)) {
			var format = schema[PROPERTIES.FORMAT];
			var formatFn = FORMATS[format];
			// if format is defined as RegExp
			if (_.isRegExp(formatFn)) {
				if (instance.match(formatFn)) {
					return;
				}
			// if format is defined as function
			} else if(_.isFunction(formatFn)) {
				if (formatFn(instance)) {
					return;
				}
			}
			this.error(path, '', 'must match against the format \'' + format + '\'', instance);
		}
	}

	/**
	* Validator.validateNumber
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateNumber = function(schema, instance, path) {
		if (!_.isNumber(instance)) {
			this.error(path, '', 'must be of type \'number\'', typeof instance);
			return;
		}
		this.validateMinimum(schema, instance, path);
		this.validateMaximum(schema, instance, path);
	}

	/**
	* Validator.validateInteger
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateInteger = function(schema, instance, path) {
		if (!_.isNumber(instance) || instance % 1 !== 0) {
			this.error(path, '', 'must be of type \'number\' with no digits', typeof instance);
			return;
		}
		this.validateMinimum(schema, instance, path);
		this.validateMaximum(schema, instance, path);
	}

	/**
	* Validator.validateMinimum
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateMinimum = function(schema, instance, path) {
		if (_.has(schema, PROPERTIES.MINIMUM)) {
			if (schema[PROPERTIES.EXCLUSIVE_MINIMUM]) {
				if (!(schema[PROPERTIES.MINIMUM] < instance)) {
					this.error(path, '', 'must be greater than \'' + instance + '\'', instance);
				}
			} else {
				if (!(schema[PROPERTIES.MINIMUM] <= instance)) {
					this.error(path, '', 'must be greater than or equal to \'' + instance + '\'', instance);
				}
			}
		}
	}

	/**
	* Validator.validateMaximum
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateMaximum = function(schema, instance, path) {
		if (_.has(schema, PROPERTIES.MAXIMUM)) {
			if (schema[PROPERTIES.EXCLUSIVE_MAXIMUM]) {
				if (!(instance < schema[PROPERTIES.MAXIMUM])) {
					this.error(path, '', 'must be less than \'' + instance + '\'', instance);
				}
			} else {
				if (!(instance <= schema[PROPERTIES.MAXIMUM])) {
					this.error(path, '', 'must be less than or equal to \'' + instance + '\'', instance);
				}
			}
		}
	}

	/**
	* Validator.validateBoolean
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateBoolean = function(schema, instance, path) {
		if (!_.isBoolean(instance)) {
			this.error(path, '', 'must be of type \'boolean\'', typeof instance);
		}
	}

	/**
	* Validator.validateMinItems
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateMinItems = function(schema, instance, path) {
		if (_.has(schema, PROPERTIES.MIN_ITEMS)) {
			var minItems = schema[PROPERTIES.MIN_ITEMS];
			if (instance.length < minItems) {
				this.error(path, '', 'need more than \'' + minItems + '\' objects', instance.length);
			}
		}
	}

	/**
	* Validator.validateMaxItems
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateMaxItems = function(schema, instance, path) {
		if (_.has(schema, PROPERTIES.MAX_ITEMS)) {
			var maxItems = schema[PROPERTIES.MAX_ITEMS];
			if (instance.length > maxItems) {
				this.error(path, '', 'need to be less than \'' + maxItems + '\' objects', instance.length);
			}
		}
	}

	/**
	* Validator.validateCustomValidation
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateCustomValidation = function(schema, instance, path) {
		for (var key in this.validations) {
			// if schema has cutom validation property
			if (_.has(schema, key)) {
				var message = this.validations[key](schema, instance);
				if (!_.isUndefined(message) && !_.isNull(message) && message !== '') {
					this.error(path, '', message, instance);
				}
			}
		}
	}


	/**
	* createJSONPath
	*
	* @param {string} path
	* @param {string} property
	* @returns {string} JSONPath
	*/
	function createJSONPath(path, property) {
		if (_.isString(property)) {
			return path + ((property !== '') ? '[\'' + property + '\']' : '');
		} else if (_.isNumber(property)) {
			return path + '[' + property + ']';
		}
		return path;
	}

	/**
	* pushError
	*
	* @param {object} errors
	* @param {string} path (JSONPath format)
	* @param {string} property
	* @param {string} message
	* @param actual
	*/
	function pushError(errors, path, property, message, actual) {
		errors.push({
			property: createJSONPath(path, property),
			message: message,
			actual: actual
		});
	}

	/**
	* createInstance
	*
	* @returns {object} public interface for validator module
	*/
	function createInstance() {
		var validations = {};
		var schemas = {};
		return {
			/**
			* check if schema is valid
			*
			* @param {object} schema
			*/
			validateSchema : function(schema, callback) {
				var fn = function(){
					return new Schema(schema).validate();
				};

				if (_.isUndefined(callback) || !_.isFunction(callback)) {
					return fn();
				} else {
					async.nextTick(function(){
						callback(fn());
					});
				}
			},

			/**
			* validate
			*
			* @param {string|object} schema
			* @param {object} instance
			* @param {function} callback
			*/
			validate : function(schema, instance, callback) {
				var fn = function(){
					// use registered schema
					if (_.isString(schema)) {
						var registeredSchema = this.schemas[schema];
						if (_.isNull(registeredSchema)) {
							var errors = {};
							pushError(errors, '', '', 'specified schema is not registered', schema);
							return errors;
						}
						schema = registeredSchema;
					} else {
						// validate schema
						var schemaErrors = new Schema(schema).validate();
						if (!_.isEmpty(schemaErrors)) {
							var errors = {};
							pushError(errors, '', '', 'specified schema validation failed', '');
							return errors;
						}
					}
					return new Validator(validations, schema).validate(instance);
				};

				if (_.isUndefined(callback) || !_.isFunction(callback)) {
					return fn();
				} else {
					async.nextTick(function(){
						callback(fn());
					});
				}
			},

			/**
			* add original validation
			*
			* @param {object} instance
			* @param {function} fn
			* @returns {boolean} success or failure
			*/
			addValidation : function(name, fn) {
				if (!_.isFunction(fn)) {
					return false;
				}
				validations[name] = fn;
				return true;
			},

			/**
			* regist schema
			*
			* @param {object} instance
			* @param {object} schema
			*/
			registSchema : function(name, schema, callback) {
				var fn = function(){
					// validate schema
					var errors = new Schema(schema).validate();
					if (_.isEmpty(errors)) {
						this.schemas[name] = schema;
					}
					return errors;
				};

				if (_.isUndefined(callback) || !_.isFunction(callback)) {
					return fn();
				} else {
					async.nextTick(function(){
						callback(fn());
					});
				}
			},

			/**
			* create new validator
			*/
			createValidator : function() {
				return createInstance();
			}
		}
	};

	// export
	var instance = createInstance();
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

