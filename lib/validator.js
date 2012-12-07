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
		PATTERN_PROPERTIES			: 'patternProperties',			// unsupported
		ADDITIONAL_PROPERTIES			: 'additionalProperties',
		ITEMS					: 'items',
		ADDITIONAL_ITEMS				: 'additionalItems',			// unsupported
		REQUIRED				: 'required',
		DEPENDENCIES				: 'dependencies',			// unsupported
		MINIMUM					: 'minimum',
		MAXIMUM					: 'maximum',
		EXCLUSIVE_MINIMUM			: 'exclusiveMinimum',
		EXCLUSIVE_MAXIMUM			: 'exclusiveMaximum',
		MIN_ITEMS				: 'minItems',
		MAX_ITEMS				: 'maxItems',
		UNIQUE_ITEMS				: 'uniqueItems',			// unsupported
		PATTERN					: 'pattern',
		MIN_LENGTH				: 'minLength',
		MAX_LENGTH				: 'maxLength',
		ENUM					: 'enum',
		DEFAULT					: 'default',			// unsupported
		TITLE					: 'title',
		DESCRIPTION				: 'description',
		FORMAT					: 'format',
		DIVISIBLE_BY			: 'divisibleBy',			// unsupported
		DISALLOW				: 'disallow',			// unsupported
		EXTENDS					: 'extends',			// unsupported
		ID						: 'id',			// unsupported
		REF						: '$ref',			// unsupported
		SCHEMA					: '$schema'			// unsupported
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
		ANY		: 'any',
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
			: function(input) {
				try {
					var regexp = new RegExp(input);
				} catch(e) {
					return false;
				}
				return true;
			},

		/**
		 * This is a CSS color (like "#FF0000" or "red"),
		 * based on CSS 2.1 [W3C.CR-CSS21-20070719].
		 * rgb() format is also allowed.
		 * Not only 17 'basic color names specified in CSS 2.1, 143 'X11 color names' are also allowed.
		 */
		'color'
			: /^(?:(?:#?[0-9a-fA-F]{3,6})|(?:rgb\(\s*\b(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*\))|(?:maroon|red|orange|yellow|olive|green|purple|fuchsia|lime|teal|aqua|blue|navy|black|gray|silver|white|indianred|lightcoral|salmon|darksalmon|lightsalmon|crimson|firebrick|darkred|pink|lightpink|hotpink|deeppink|mediumvioletred|palevioletred|lightsalmon|coral|tomato|orangered|darkorange|gold|lightyellow|lemonchiffon|lightgoldenrodyellow|papayawhip|moccasin|peachpuff|palegoldenrod|khaki|darkkhaki|lavender|thistle|plum|violet|orchid|magenta|mediumorchid|mediumpurple|amethyst|blueviolet|darkviolet|darkorchid|darkmagenta|indigo|slateblue|darkslateblue|mediumslateblue|greenyellow|chartreuse|lawngreen|limegreen|palegreen|lightgreen|mediumspringgreen|springgreen|mediumseagreen|seagreen|forestgreen|darkgreen|yellowgreen|olivedrab|darkolivegreen|mediumaquamarine|darkseagreen|lightseagreen|darkcyan|cyan|lightcyan|paleturquoise|aquamarine|turquoise|mediumturquoise|darkturquoise|cadetblue|steelblue|lightsteelblue|powderblue|lightblue|skyblue|lightskyblue|deepskyblue|dodgerblue|cornflowerblue|mediumslateblue|royalblue|mediumblue|darkblue|midnightblue|cornsilk|blanchedalmond|bisque|navajowhite|wheat|burlywood|tan|rosybrown|sandybrown|goldenrod|darkgoldenrod|peru|chocolate|saddlebrown|sienna|brown|snow|honeydew|mintcream|azure|aliceblue|ghostwhite|whitesmoke|seashell|beige|oldlace|floralwhite|ivory|antiquewhite|linen|lavenderblush|mistyrose|gainsboro|lightgrey|darkgray|dimgray|lightslategray|slategray|darkslategray))$/i,

		/**
		 * This is a CSS style definition (like "color: red; background-color:#FFF"),
		 * based on CSS 2.1 [W3C.CR-CSS21-20070719].
		 */
		'style'
			: /^\s*[^:]+\s*:\s*[^;]+\s*;{0,1}\s*$/,

		/**
		 * This SHOULD be a phone number (format MAY follow E.123).
		 *
		 * http://blog.stevenlevithan.com/archives/validate-phone-number
		 */
		'phone'
			: /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/,

		/**
		 * This value SHOULD be a URI.
		 *
		 * http://snipplr.com/view/6889/regular-expressions-for-uri-validationparsing/
		 */
		'uri'
			: /^(?:([a-z0-9+.-]+:\/\/)((?:(?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)(:(?:\d*))?(\/(?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*)?|([a-z0-9+.-]+:)(\/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})+(?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*)?)(\?(?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*)?(#(?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*)?$/i,

		/**
		 * This SHOULD be an email address.
		 *
		 * http://blog.livedoor.jp/dankogai/archives/51189905.html
		 */
		'email'
			: /^(?:(?:(?:(?:[a-zA-Z0-9_!#\$\%&'*+/=?\^`{}~|\-]+)(?:\.(?:[a-zA-Z0-9_!#\$\%&'*+/=?\^`{}~|\-]+))*)|(?:"(?:\\[^\r\n]|[^\\"])*")))\@(?:(?:(?:(?:[a-zA-Z0-9_!#\$\%&'*+/=?\^`{}~|\-]+)(?:\.(?:[a-zA-Z0-9_!#\$\%&'*+/=?\^`{}~|\-]+))*)|(?:\[(?:\\\S|[\x21-\x5a\x5e-\x7e])*\])))$/,

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
			this.error(path, '', 'must be of type [object] and not null', typeof schema);
			return;
		}
	
		// schema needs type property
		if (!_.has(schema, PROPERTIES.TYPE)) {
			this.error(path, '', 'must contain [' + PROPERTIES.TYPE + '] property', null);
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
				this.validateEnum(schema, path);
				break;
			case TYPES.NUMBER:
				this.validateMinimum(schema, path, false);
				this.validateMaximum(schema, path, false);
				this.validateEnum(schema, path);
				break;
			case TYPES.INTEGER:
				this.validateMinimum(schema, path, true);
				this.validateMaximum(schema, path, true);
				this.validateEnum(schema, path);
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
				this.error(path, PROPERTIES.TYPE, 'must be one of [' + _.values(TYPES).join(' | ') + ']', schema[PROPERTIES.TYPE]);
				break;
		}
	}

	/**
	* Schema.validateValueBoolean
	*
	* @param {object} schema
	* @param {string} path
	* @param {string} property
	* @returns {boolean} success or failure
	*/
	Schema.prototype.validateValueBoolean = function(schema, path, property) {
		var v = schema[property];
		if (!_.isBoolean(v)) {
			this.error(path, property, 'must be of type [boolean]', typeof v);
			return false;
		}
		return true;
	}

	/**
	* Schema.validateValueInteger
	*
	* @param {object} schema
	* @param {string} path
	* @param {string} property
	* @param {string} positiveOnly
	* @returns {boolean} success or failure
	*/
	Schema.prototype.validateValueInteger = function(schema, path, property, positiveOnly) {
		var v = schema[property];
		if (!_.isNumber(v) || v % 1 !== 0 || (positiveOnly ? v < 0 : false)) {
			this.error(path, property, 'must be of type [number] with no digits' + (positiveOnly ? ' greather than or equal to 0' : ''), v);
			return false;
		}
		return true;
	}

	/**
	* Schema.validateValueNumber
	*
	* @param {object} schema
	* @param {string} path
	* @param {string} property
	* @param {string} positiveOnly
	* @returns {boolean} success or failure
	*/
	Schema.prototype.validateValueNumber = function(schema, path, property, positiveOnly) {
		var v = schema[property];
		if (!_.isNumber(v) || (positiveOnly ? v < 0 : false)) {
			this.error(path, property, 'must be of type [number]' + (positiveOnly ? ' greater than or equal to 0' : ''), v);
			return false;
		}
		return true;
	}

	/**
	* Schema.validateValueString
	*
	* @param {object} schema
	* @param {string} path
	* @param {string} property
	* @returns {boolean} success or failure
	*/
	Schema.prototype.validateValueString = function(schema, path, property) {
		var v = schema[property];
		if (!_.isString(v)) {
			this.error(path, property, 'must be of type [string]', v);
			return false;
		}
		return true;
	}

	/**
	* Schema.validateRequired
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateRequired = function(schema, path) {
		if (_.has(schema, PROPERTIES.REQUIRED)) {
			this.validateValueBoolean(schema, path, PROPERTIES.REQUIRED);
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
			this.validateValueInteger(schema, path, PROPERTIES.MIN_LENGTH, true);
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
			this.validateValueInteger(schema, path, PROPERTIES.MAX_LENGTH, true);
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
			if (this.validateValueString(schema, path, PROPERTIES.PATTERN)) {
				var v = schema[PROPERTIES.PATTERN];
				try {
					var regexp = new RegExp(v);
				} catch(e) {
					this.error(path, PROPERTIES.PATTERN, 'must be valid regular expression pattern', v);
				}
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
				this.error(path, PROPERTIES.FORMAT, 'must be one of [' + Object.keys(FORMATS).join(' | ') + ']', v);
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
			var result;
			if (noDigits) {
				result = this.validateValueInteger(schema, path, PROPERTIES.MINIMUM, false);
			} else {
				result = this.validateValueNumber(schema, path, PROPERTIES.MINIMUM, false);
			}
			if (result) {
				this.validateExclusiveMinimum(schema, path, false);
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
			var result;
			if (noDigits) {
				result = this.validateValueInteger(schema, path, PROPERTIES.MAXIMUM, false);
			} else {
				result = this.validateValueNumber(schema, path, PROPERTIES.MAXIMUM, false);
			}
			if (result) {
				this.validateExclusiveMaximum(schema, path, false);
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
			this.validateValueBoolean(schema, path, PROPERTIES.EXCLUSIVE_MINIMUM);
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
			this.validateValueBoolean(schema, path, PROPERTIES.EXCLUSIVE_MAXIMUM);
		}
	}

	/**
	* Schema.validateEnum
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateEnum = function(schema, path) {
		if (_.has(schema, PROPERTIES.ENUM)) {
			var enums = schema[PROPERTIES.ENUM];
			if (!_.isArray(enums)) {
				this.error(path, PROPERTIES.ENUM, 'must be of type [array]', typeof enums);
				return;
			}
			switch(schema[PROPERTIES.TYPE]) {
				case TYPES.STRING:
					for (var i = 0; i < enums.length; i++) {
						this.validateValueString(enums, createJSONPath(path, PROPERTIES.ENUM), i);
					}
					break;
				case TYPES.NUMBER:
					for (var i = 0; i < enums.length; i++) {
						this.validateValueNumber(enums, createJSONPath(path, PROPERTIES.ENUM), i, false);
					}
					break;
				case TYPES.INTEGER:
					for (var i = 0; i < enums.length; i++) {
						this.validateValueInteger(enums, createJSONPath(path, PROPERTIES.ENUM), i, false);
					}
					break;
			}
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
			this.validateValueInteger(schema, path, PROPERTIES.MIN_ITEMS, true);
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
			this.validateValueInteger(schema, path, PROPERTIES.MAX_ITEMS, true);
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
				this.error(path, PROPERTIES.PROPERTIES, 'must be of type [object]', typeof v);
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
				this.validateTypeString(schema, instance, path);
				break;
			case TYPES.NUMBER:
				this.validateTypeNumber(schema, instance, path);
				break;
			case TYPES.INTEGER:
				this.validateTypeInteger(schema, instance, path);
				break;
			case TYPES.BOOLEAN:
				this.validateTypeBoolean(schema, instance, path);
				break;
			case TYPES.OBJECT:
				// check instance is an object
				if (!_.isObject(instance) || _.isFunction(instance) || _.isArray(instance)) {
					this.error(path, '', 'must be of type [object]', typeof instance);
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
					this.error(path, '', 'must be of type [array]', typeof instance);
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
								this.error(nextPath, i, 'must match with schema of type [array]', value);
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
	* Validator.validateTypeString
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateTypeString = function(schema, instance, path) {
		if (!_.isString(instance)) {
			this.error(path, '', 'must be of type [string]', typeof instance);
			return;
		}
		this.validateMinLength(schema, instance, path);
		this.validateMaxLength(schema, instance, path);
		this.validatePattern(schema, instance, path);
		this.validateFormat(schema, instance, path);
		this.validateEnum(schema, instance,path);
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
				this.error(path, '', 'length must be greater than [' + minLength + ']', instance);
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
				this.error(path, '', 'length must be less than [' + maxLength + ']', instance);
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
				this.error(path, '', 'must match against the regular expression [' + pattern + ']', instance);
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
			this.error(path, '', 'must match against the format [' + format + ']', instance);
		}
	}

	/**
	* Validator.validateEnum
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateEnum = function(schema, instance, path) {
		if (_.has(schema, PROPERTIES.ENUM)) {
			var enums = schema[PROPERTIES.ENUM];
			// if instance value equal to one of enums
			for (var i = 0; i < enums.length; i++) {
				if (instance === enums[i]) {
					return;
				}
			}
			this.error(path, '', 'must be one of [' + enums.join(' | ') + ']', instance);
		}
	}

	/**
	* Validator.validateTypeNumber
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateTypeNumber = function(schema, instance, path) {
		if (!_.isNumber(instance)) {
			this.error(path, '', 'must be of type [number]', typeof instance);
			return;
		}
		this.validateMinimum(schema, instance, path);
		this.validateMaximum(schema, instance, path);
		this.validateEnum(schema, instance,path);
	}

	/**
	* Validator.validateTypeInteger
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateTypeInteger = function(schema, instance, path) {
		if (!_.isNumber(instance) || instance % 1 !== 0) {
			this.error(path, '', 'must be of type [number] with no digits', typeof instance);
			return;
		}
		this.validateMinimum(schema, instance, path);
		this.validateMaximum(schema, instance, path);
		this.validateEnum(schema, instance,path);
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
					this.error(path, '', 'must be greater than [' + instance + ']', instance);
				}
			} else {
				if (!(schema[PROPERTIES.MINIMUM] <= instance)) {
					this.error(path, '', 'must be greater than or equal to [' + instance + ']', instance);
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
					this.error(path, '', 'must be less than [' + instance + ']', instance);
				}
			} else {
				if (!(instance <= schema[PROPERTIES.MAXIMUM])) {
					this.error(path, '', 'must be less than or equal to [' + instance + ']', instance);
				}
			}
		}
	}

	/**
	* Validator.validateTypeBoolean
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateTypeBoolean = function(schema, instance, path) {
		if (!_.isBoolean(instance)) {
			this.error(path, '', 'must be of type [boolean]', typeof instance);
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
				this.error(path, '', 'need more than [' + minItems + '] objects', instance.length);
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
				this.error(path, '', 'need to be less than [' + maxItems + '] objects', instance.length);
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
						var registeredSchema = schemas[schema];
						if (_.isUndefined(registeredSchema)) {
							var errors = [];
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
			* @param {string} name
			* @param {object} schema
			* @param {Function} callback
			* @returns {array} errors
			*/
			registSchema : function(name, schema, callback) {
				var fn = function(){
					// validate schema
					var errors = new Schema(schema).validate();
					if (_.isEmpty(errors)) {
						schemas[name] = schema;
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
			* unregist schema
			*
			* @param {string} name
			*/
			unregistSchema : function(name) {
				delete schemas[name];
			},


			/**
			* create new validator
			*/
			createValidator : function() {
				return createInstance();
			},

			/**
			* available properties
			*/
			PROPERTIES : PROPERTIES,

			/**
			* available types
			*/
			TYPES : TYPES,
			/**
			* available formats
			*/
			FORMATS : FORMATS
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

