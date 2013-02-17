/**
 * Validator module
 */
(function(){

	/**
	* properties
	*/
	var
	TYPE = 'type'
	, PROPERTIES = 'properties'
	// , PATTERN_PROPERTIES = 'patternProperties' // unsupported
	, ADDITIONAL_PROPERTIES = 'additionalProperties'
	, ITEMS = 'items'
	// , ADDITIONAL_ITEMS = 'additionalItems' // unsupported
	, REQUIRED = 'required'
	// , DEPENDENCIES = 'dependencies' // unsupported
	, MINIMUM = 'minimum'
	, MAXIMUM = 'maximum'
	, EXCLUSIVE_MINIMUM = 'exclusiveMinimum'
	, EXCLUSIVE_MAXIMUM = 'exclusiveMaximum'
	, MIN_ITEMS	= 'minItems'
	, MAX_ITEMS = 'maxItems'
	// , UNIQUE_ITEMS = 'uniqueItems' // unsupported
	, PATTERN = 'pattern'
	, MIN_LENGTH = 'minLength'
	, MAX_LENGTH = 'maxLength'
	, ENUM = 'enum'
	// , DEFAULT = 'default' // unsupported
	// , TITLE	= 'title'
	// , DESCRIPTION = 'description'
	, FORMAT = 'format'
	, SCHEMA = 'schema'
	, ONEOF = 'oneOf'
	// , DIVISIBLE_BY = 'divisibleBy' // unsupported
	// , DISALLOW = 'disallow' // unsupported
	// , EXTENDS = 'extends' // unsupported
	// , ID = 'id' // unsupported
	// , REF = '$ref' // unsupported
	// , SCHEMA ='$schema' // unsupported
	;

	/**
	* types
	*/
	var
	STRING = 'string'
	, NUMBER = 'number'
	, INTEGER = 'integer'
	, BOOLEAN = 'boolean'
	, NULL = 'null'
	, ANY = 'any'
	, OBJECT = 'object'
	, ARRAY =  'array'
	, MAP = 'map' // extended type
	;

	/**
	* formats
	*/
	var FORMATS = {
		/**
		 * This SHOULD be a date in ISO 8601 format of YYYY-MM-DDThh:mm:ssZ in UTC time.
		 * This is the recommended form of date/timestamp.
		 *
		 * Also supports YYYY-MM-DDThh:mm:ss.SSSTZD (e.g. 2012-12-10T19:20:30.456+09:00)
		 */
		'date-time':
			/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+\-]\d{2}:\d{2})$/,

		/**
		 * This SHOULD be a date in the format of YYYY-MM-DD.
		 * It is recommended that you use the "date-time" format
		 * instead of "date" unless you need to transfer only the date part.
		 */
		'date'
			: /^\d{4}-\d{2}-\d{2}$/,

		/**
		 * This SHOULD be a time in the format of hh:mm:ss.
		 * It is recommended that you use the "date-time" format
		 * instead of "time" unless you need to transfer only the time part.
		 *
		 * Also supports hh:mm:ss.SSS (e.g. 19:20:30.456)
		 */
		'time'
			: /^\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?$/,

		/**
		 * This SHOULD be the difference, measured in milliseconds,
		 * between the specified time and midnight, 00:00 of January 1, 1970 UTC.
		 * The value SHOULD be a number (integer or float).
		 */
		'utc-millisec'
			: function(input) { return !isNaN(parseInt(input,10));},

		/**
		 * A regular expression, following the regular expression specification
		 * from ECMA 262/Perl 5.
		 */
		'regex'
			: function(input) {
				try {
					new RegExp(input);
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
			: /^(?:(?:#?[0-9a-fA-F]{3,6})|(?:rgb\(\s*\b(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*\))|(?:rgb\(\s*(?:\d?\d%|100%)\s*,\s*(?:\d?\d%|100%)\s*,\s*(?:\d?\d%|100%)\s*\))|(?:maroon|red|orange|yellow|olive|green|purple|fuchsia|lime|teal|aqua|blue|navy|black|gray|silver|white|indianred|lightcoral|salmon|darksalmon|lightsalmon|crimson|firebrick|darkred|pink|lightpink|hotpink|deeppink|mediumvioletred|palevioletred|lightsalmon|coral|tomato|orangered|darkorange|gold|lightyellow|lemonchiffon|lightgoldenrodyellow|papayawhip|moccasin|peachpuff|palegoldenrod|khaki|darkkhaki|lavender|thistle|plum|violet|orchid|magenta|mediumorchid|mediumpurple|amethyst|blueviolet|darkviolet|darkorchid|darkmagenta|indigo|slateblue|darkslateblue|mediumslateblue|greenyellow|chartreuse|lawngreen|limegreen|palegreen|lightgreen|mediumspringgreen|springgreen|mediumseagreen|seagreen|forestgreen|darkgreen|yellowgreen|olivedrab|darkolivegreen|mediumaquamarine|darkseagreen|lightseagreen|darkcyan|cyan|lightcyan|paleturquoise|aquamarine|turquoise|mediumturquoise|darkturquoise|cadetblue|steelblue|lightsteelblue|powderblue|lightblue|skyblue|lightskyblue|deepskyblue|dodgerblue|cornflowerblue|mediumslateblue|royalblue|mediumblue|darkblue|midnightblue|cornsilk|blanchedalmond|bisque|navajowhite|wheat|burlywood|tan|rosybrown|sandybrown|goldenrod|darkgoldenrod|peru|chocolate|saddlebrown|sienna|brown|snow|honeydew|mintcream|azure|aliceblue|ghostwhite|whitesmoke|seashell|beige|oldlace|floralwhite|ivory|antiquewhite|linen|lavenderblush|mistyrose|gainsboro|lightgrey|darkgray|dimgray|lightslategray|slategray|darkslategray))$/i,

		/**
		 * This is a CSS style definition (like "color: red; background-color:#FFF"),
		 * based on CSS 2.1 [W3C.CR-CSS21-20070719].
		 */
		'style'
			: /^\s*[^:]+\s*:\s*[^:;]+\s*;{0,1}\s*$/,

		/**
		 * This SHOULD be a phone number (format MAY follow E.123).
		 */
		// TODO
		'phone'
			: function(){return true;},

		/**
		 * This value SHOULD be a URI.
		 *
		 * http://snipplr.com/view/6889/regular-expressions-for-uri-validationparsing/
		 */
		'uri'
			: /^(?:(?:[a-z0-9+.\-]+:\/\/)(?:(?:(?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?(?:(?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)(?::(?:\d*))?(?:\/(?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*)?|(?:[a-z0-9+.\-]+:)(?:\/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})+(?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*)?)(?:\?(?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*)?(?:#(?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*)?$/i,

		/*
		 * This SHOULD be an email address.
		 *
		 * http://fightingforalostcause.net/misc/2006/compare-email-regex.php
		 */
		'email'
			: /^(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){255,})(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){65,}@)(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22))(?:\.(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22)))*@(?:(?:(?!.*[^.]{64,})(?:(?:(?:xn--)?[a-z0-9]+(?:-[a-z0-9]+)*\.){1,126}){1,}(?:(?:[a-z][a-z0-9]*)|(?:(?:xn--)[a-z0-9]+))(?:-[a-z0-9]+)*)|(?:\[(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7})|(?:(?!(?:.*[a-f0-9][:\]]){7,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?)))|(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){5}:)|(?:(?!(?:.*[a-f0-9]:){5,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3}:)?)))?(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))(?:\.(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))){3}))\]))$/i,

		/**
		 * This SHOULD be an ip version 4 address.
		 */
		'ip-address'
			: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,

		/**
		 * This SHOULD be an ip version 6 address.
		 *
		 * http://home.deds.nl/~aeron/regex/
		 */
		'ipv6'
			: function(){return true;},
//			: /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i,

		/**
		 * This SHOULD be a host-name.
		 */
		'host-name'
			: /^(?:(?:[a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/
	};

	var toString = Object.prototype.toString;

    function isFunction(obj) {
      return typeof obj === 'function';
    }

	function isArray(obj) {
		return toString.call(obj) === '[object Array]';
	}

	function isObject(obj) {
		return obj === Object(obj);
	}

	function isNull(obj) {
		return obj === null;
	}

	function isUndefined(obj) {
		return obj === undefined;
	}

	function isNumber(obj) {
		return toString.call(obj) === '[object Number]';
	}

	function isString(obj) {
		return toString.call(obj) === '[object String]';
	}

	function isNaN(obj) {
		return isNumber(obj) && obj !== +obj;
	}

	function isRegExp(obj) {
		return toString.call(obj) === '[object RegExp]';
	}

	function isBoolean(obj) {
		return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	}

	function isEmpty(obj) {
		if (obj === null) {
			return true;
		}
		if (isArray(obj) || isString(obj)) {
			return obj.length === 0;
		}
		for (var key in obj) {
			if (has(obj, key)) {
				return false;
			}
		}
		return true;
	}

	function has(obj, name) {
		return Object.prototype.hasOwnProperty.call(obj, name);
	}

	/**
	* Schema constructor
	*
	* @param {object} schema
	*/
	var Schema = function(schema){
		this.schema = schema;
	};

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
	};
	
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
	};

	/**
	* Schema.validateObject
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateObject = function(schema, path) {
		
		var self = this;

		if (isString(schema)) {
			schema = { type: schema };
		}

		// check schema is an object and not null
		if (!isObject(schema) || isFunction(schema) || isArray(schema) || isNull(schema)) {
			self.error(path, '', 'must be of type [object] and not null', typeof schema);
			return;
		}
	
		// schema needs type property
		if (!has(schema, TYPE)) {
			self.error(path, '', 'must contain [' + TYPE + '] property', null);
			return;
		}

		// check required property
		self.validateRequired(schema, path);

		// check each properties depending on it's type
		switch(schema[TYPE]) {
			case STRING:
				self.validateMinLength(schema, path);
				self.validateMaxLength(schema, path);
				self.validatePattern(schema, path);
				self.validateFormat(schema, path);
				self.validateEnum(schema, path);
				break;
			case NUMBER:
				self.validateMinimum(schema, path, false);
				self.validateMaximum(schema, path, false);
				self.validateEnum(schema, path);
				break;
			case INTEGER:
				self.validateMinimum(schema, path, true);
				self.validateMaximum(schema, path, true);
				self.validateEnum(schema, path);
				break;
			case BOOLEAN:
			case NULL:
			case ANY:
				// nothing to validate
				break;
			case OBJECT:
				self.validateAdditionalProperties(schema, path);
				self.validateProperties(schema, path);
				self.validateOneOf(schema, path);
				break;
			case ARRAY:
				// check items
				if (has(schema, ITEMS)) {
					var items = schema[ITEMS];
					// if items are an array
					if (isArray(items)) {
						for (var i = 0; i < items.length; i++) {
							self.validateObject(items[i], createJSONPath(createJSONPath(path, ITEMS), i));
						}
					} else {
						self.validateObject(items, createJSONPath(path, ITEMS));
					}
				}
				self.validateMinItems(schema, path);
				self.validateMaxItems(schema, path);
				break;
			case MAP:
				self.validateObject(schema.schema, createJSONPath(path, SCHEMA));
				break;
			default:
				self.error(path, TYPE, 'must be one of [' + [STRING,NUMBER,INTEGER,BOOLEAN,NULL,ANY,OBJECT,ARRAY,MAP].join(' | ') + ']', schema[TYPE]);
				break;
		}
	};

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
		if (!isBoolean(v)) {
			this.error(path, property, 'must be of type [boolean]', typeof v);
			return false;
		}
		return true;
	};

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
		if (!isNumber(v) || v % 1 !== 0 || (positiveOnly ? v < 0 : false)) {
			this.error(path, property, 'must be of type [number] with no digits' + (positiveOnly ? ' greather than or equal to 0' : ''), v);
			return false;
		}
		return true;
	};

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
		if (!isNumber(v) || (positiveOnly ? v < 0 : false)) {
			this.error(path, property, 'must be of type [number]' + (positiveOnly ? ' greater than or equal to 0' : ''), v);
			return false;
		}
		return true;
	};

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
		if (!isString(v)) {
			this.error(path, property, 'must be of type [string]', v);
			return false;
		}
		return true;
	};

	/**
	* Schema.validateRequired
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateRequired = function(schema, path) {
		if (has(schema, REQUIRED)) {
			this.validateValueBoolean(schema, path, REQUIRED);
		}
	};

	/**
	* Schema.validateMinLength
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateMinLength = function(schema, path) {
		if (has(schema, MIN_LENGTH)) {
			this.validateValueInteger(schema, path, MIN_LENGTH, true);
		}
	};

	/**
	* Schema.validateMaxLength
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateMaxLength = function(schema, path) {
		if (has(schema, MAX_LENGTH)) {
			this.validateValueInteger(schema, path, MAX_LENGTH, true);
		}
	};

	/**
	* Schema.validatePattern
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validatePattern = function(schema, path) {
		if (has(schema, PATTERN)) {
			if (this.validateValueString(schema, path, PATTERN)) {
				var v = schema[PATTERN];
				try {
					new RegExp(v);
				} catch(e) {
					this.error(path, PATTERN, 'must be valid regular expression pattern', v);
				}
			}
		}
	};

	/**
	* Schema.validateFormat
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateFormat = function(schema, path) {
		if (has(schema, FORMAT)) {
			var v = schema[FORMAT];
			if (!has(FORMATS, v)) {
				this.error(path, FORMAT, 'must be one of [' + Object.keys(FORMATS).join(' | ') + ']', v);
			}
		}
	};

	/**
	* Schema.validateMinimum
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateMinimum = function(schema, path, noDigits) {
		if (has(schema, MINIMUM)) {
			var result;
			if (noDigits) {
				result = this.validateValueInteger(schema, path, MINIMUM, false);
			} else {
				result = this.validateValueNumber(schema, path, MINIMUM, false);
			}
			if (result) {
				this.validateExclusiveMinimum(schema, path, false);
			}
		}
	};

	/**
	* Schema.validateMaximum
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateMaximum = function(schema, path, noDigits) {
		if (has(schema, MAXIMUM)) {
			var result;
			if (noDigits) {
				result = this.validateValueInteger(schema, path, MAXIMUM, false);
			} else {
				result = this.validateValueNumber(schema, path, MAXIMUM, false);
			}
			if (result) {
				this.validateExclusiveMaximum(schema, path, false);
			}
		}
	};

	/**
	* Schema.validateExclusiveMinimum
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateExclusiveMinimum = function(schema, path) {
		if (has(schema, EXCLUSIVE_MINIMUM)) {
			this.validateValueBoolean(schema, path, EXCLUSIVE_MINIMUM);
		}
	};

	/**
	* Schema.validateExclusiveMaximum
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateExclusiveMaximum = function(schema, path) {
		if (has(schema, EXCLUSIVE_MAXIMUM)) {
			this.validateValueBoolean(schema, path, EXCLUSIVE_MAXIMUM);
		}
	};

	/**
	* Schema.validateEnum
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateEnum = function(schema, path) {
		if (has(schema, ENUM)) {
			var enums = schema[ENUM];
			if (!isArray(enums)) {
				this.error(path, ENUM, 'must be of type [array]', typeof enums);
				return;
			}
			var i;
			switch(schema[TYPE]) {
				case STRING:
					for (i = 0; i < enums.length; i++) {
						this.validateValueString(enums, createJSONPath(path, ENUM), i);
					}
					break;
				case NUMBER:
					for (i = 0; i < enums.length; i++) {
						this.validateValueNumber(enums, createJSONPath(path, ENUM), i, false);
					}
					break;
				case INTEGER:
					for (i = 0; i < enums.length; i++) {
						this.validateValueInteger(enums, createJSONPath(path, ENUM), i, false);
					}
					break;
			}
		}
	};

	/**
	* Schema.validateMinItems
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateMinItems = function(schema, path) {
		if (has(schema, MIN_ITEMS)) {
			this.validateValueInteger(schema, path, MIN_ITEMS, true);
		}
	};

	/**
	* Schema.MaxItems
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateMaxItems = function(schema, path) {
		if (has(schema, MAX_ITEMS)) {
			this.validateValueInteger(schema, path, MAX_ITEMS, true);
		}
	};

	/**
	* Schema.validateAdditionalProperties
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateAdditionalProperties = function(schema, path) {
		if (has(schema, ADDITIONAL_PROPERTIES)) {
			var v = schema[ADDITIONAL_PROPERTIES];
			// if additionalProperties are not of type boolean
			if (!isBoolean(v)) {
				this.validateObject(v, createJSONPath(path, ADDITIONAL_PROPERTIES));
			}
		}
	};

	/**
	* Schema.validateProperties
	*
	* @param {object} schema
	* @param {string} path
	*/
	Schema.prototype.validateProperties = function(schema, path) {
		if (has(schema, PROPERTIES)) {
			var v = schema[PROPERTIES];
			if (!isObject(v) || isFunction(v) || isArray(v)) {
				this.error(path, PROPERTIES, 'must be of type [object]', typeof v);
			} else {
				// validate each property
				for (var key in v) {
					this.validateObject(v[key], createJSONPath(path, key));
				}
			}
		}
	};

	/**
	 * Schema.validateOneOf
	 */
	Schema.prototype.validateOneOf = function(schema, path) {
		if (has(schema, ONEOF)) {
			var v = schema[ONEOF];
			if (!isArray(v)) {
				this.error(path, PROPERTIES, 'oneOf must have [array]', typeof v);
			} else {
				for (var i = 0; i < v.length; i++) {
					this.validateObject(v[i], createJSONPath(path, i));
				}
			}
		}
	};

	/**
	* Validator constructor
	*
	* @param {object} validations
	* @param {object} schema
	*/
	var Validator = function(validations, schema) {
		this.validations = validations;
		this.schema = schema;
	};

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
	};
	
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
	};
		
	/**
	 * Validator.validateProperty
	 *
	 * @param {object} schema
	 * @param instance
	 * @param {string} path
	 */
	Validator.prototype.validateProperty = function(schema, instance, path) {

		// convert to type schema
		if (isString(schema)) {
			schema = { type: schema };
		}

		// check type is not null nor any and instance is not null
		if (!(schema[TYPE] === NULL || schema[TYPE] === ANY) && isNull(instance)) {
			this.error(path, '', 'must not be null');
			return;
		}

		this.validateCustomValidation(schema, instance, path);

		// check each properties depending on it's type
		switch(schema[TYPE]) {
			case STRING:
				this.validateTypeString(schema, instance, path);
				break;
			case NUMBER:
				this.validateTypeNumber(schema, instance, path);
				break;
			case INTEGER:
				this.validateTypeInteger(schema, instance, path);
				break;
			case BOOLEAN:
				this.validateTypeBoolean(schema, instance, path);
				break;
			case OBJECT:
				this.validateTypeObject(schema, instance, path);
				break;
			case ARRAY:
				this.validateTypeArray(schema, instance, path);
				break;
		}
	};

	/**
	 * Validator.validateTypeObject
	 *
	 * @param {object} schema
	 * @param instance
	 * @param {string} path
	 */
	Validator.prototype.validateTypeObject = function(schema, instance, path) {

		// check instance is an object
		if (!isObject(instance) || isFunction(instance) || isArray(instance)) {
			this.error(path, '', 'must be of type [object]', typeof instance);
			return;
		}

		// check oneOf property
		if (has(schema, ONEOF)) {
			var oneof = schema[ONEOF];
			var errorBackup = this.errors;
			for (var i = 0; i < oneof.length; i++) {
				this.errors = [];
				this.validateProperty(oneof[i], instance, path);
				// if there are no errors, oneOf will be safe.
				if (this.errors.length === 0) {
					this.errors = errorBackup;
					return;
				}
				// concatnate errors
				this.errors = errorBackup.concat(this.errors);
			}
			return;
		}

		var property;

		// check each property from schema perspective to check required property
		for (property in schema[PROPERTIES]) {
			if (schema[PROPERTIES][property][REQUIRED]) {
				if (!has(instance, property)) {
					this.error(path, property, 'property is required');
				}
			}
		}

		// check each property from instance perspective
		for (property in instance) {
			var value = instance[property];
			var nextPath = createJSONPath(path, property);

			// if property is not defined in schema
			if (!has(schema[PROPERTIES], property)) {
				var additionalProperties = schema[ADDITIONAL_PROPERTIES];
				// if additionalProperties is defined in schema
				if (!isUndefined(additionalProperties) && !isNull(additionalProperties)) {
					// ignore if addtionalProperties are 'true'
					if (isBoolean(additionalProperties) && additionalProperties) {
						continue;
						// validate by addtionalProperties which contains schema object
					} else {
						var backup = this.errors;
						this.errors = [];
						this.validateProperty(additionalProperties, value, nextPath);
						// ignore if no errors occured
						if (isEmpty(this.errors)) {
							this.errors = backup;
							continue;
						}
						this.errors = backup;
						this.error(path, '', 'undefined property in schema and not valid against additionalProperties', property);
						continue;
					}
				}
				this.error(path, '', 'undefined property in schema', property);
				continue;
			}
			var nextSchema = schema[PROPERTIES][property];

			this.validateProperty(nextSchema, value, nextPath);
		}
	};

	/**
	 * Validator.validateTypeArray
	 *
	 * @param {object} schema
	 * @param instance
	 * @param {string} path
	 */
	Validator.prototype.validateTypeArray = function(schema, instance, path) {
		// check instance is an array
		if (!isArray(instance)) {
			this.error(path, '', 'must be of type [array]', typeof instance);
			return;
		}

		this.validateMinItems(schema, instance, path);
		this.validateMaxItems(schema, instance, path);

		// check all elements in an array if 'items' is defined in schema
		if (has(schema, ITEMS)) {
			var items = schema[ITEMS];
			for (var i = 0; i < instance.length; i++) {
				var value = instance[i];
				// if 'items' are defined as an array, need to validate each element in an array
				if (isArray(items)) {
					// backup current errors to get errors by 'items' validation
					var backup = this.errors;
					this.errors = [];
					var itemErrorCount = 0;
					for (var j = 0; j < items.length; j++) {
						this.validateProperty(items[j], value, createJSONPath(path, j));
						// if there are any errors, count up
						if (!isEmpty(this.errors)) {
							itemErrorCount++;
							this.errors = [];
						}
					}
					this.errors = backup;
					// if all validations defined in 'items' fails
					if (items.length === itemErrorCount) {
						this.error(path, i, 'must match with schema of type [array]', value);
					}
				} else {
					this.validateProperty(items, value, createJSONPath(path, i));
				}
			}
		}
	};

	/**
	* Validator.validateTypeString
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateTypeString = function(schema, instance, path) {
		if (!isString(instance)) {
			this.error(path, '', 'must be of type [string]', typeof instance);
			return;
		}
		this.validateMinLength(schema, instance, path);
		this.validateMaxLength(schema, instance, path);
		this.validatePattern(schema, instance, path);
		this.validateFormat(schema, instance, path);
		this.validateEnum(schema, instance,path);
	};

	/**
	* Validator.validateMinLength
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateMinLength = function(schema, instance, path) {
		if (has(schema, MIN_LENGTH)) {
			var minLength = schema[MIN_LENGTH];
			if (instance.length < minLength) {
				this.error(path, '', 'length must be greater than [' + minLength + ']', instance);
			}
		}
	};

	/**
	* Validator.validateMaxLength
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateMaxLength = function(schema, instance, path) {
		if (has(schema, MAX_LENGTH)) {
			var maxLength = schema[MAX_LENGTH];
			if (maxLength < instance.length) {
				this.error(path, '', 'length must be less than [' + maxLength + ']', instance);
			}
		}
	};

	/**
	* Validator.validatePattern
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validatePattern = function(schema, instance, path) {
		if (has(schema, PATTERN)) {
			var pattern = schema[PATTERN];
			if (!instance.match(pattern)) {
				this.error(path, '', 'must match against the regular expression [' + pattern + ']', instance);
			}
		}
	};

	/**
	* Validator.validateFormat
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateFormat = function(schema, instance, path) {
		if (has(schema, FORMAT)) {
			var format = schema[FORMAT];
			var formatFn = FORMATS[format];
			// if format is defined as RegExp
			if (isRegExp(formatFn)) {
				if (instance.match(formatFn)) {
					return;
				}
			// if format is defined as function
			} else if(isFunction(formatFn)) {
				if (formatFn(instance)) {
					return;
				}
			}
			this.error(path, '', 'must match against the format [' + format + ']', instance);
		}
	};

	/**
	* Validator.validateEnum
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateEnum = function(schema, instance, path) {
		if (has(schema, ENUM)) {
			var enums = schema[ENUM];
			// if instance value equal to one of enums
			for (var i = 0; i < enums.length; i++) {
				if (instance === enums[i]) {
					return;
				}
			}
			this.error(path, '', 'must be one of [' + enums.join(' | ') + ']', instance);
		}
	};

	/**
	* Validator.validateTypeNumber
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateTypeNumber = function(schema, instance, path) {
		if (!isNumber(instance) || isNaN(instance)) {
			this.error(path, '', 'must be of type [number]', typeof instance);
			return;
		}
		this.validateMinimum(schema, instance, path);
		this.validateMaximum(schema, instance, path);
		this.validateEnum(schema, instance,path);
	};

	/**
	* Validator.validateTypeInteger
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateTypeInteger = function(schema, instance, path) {
		if (!isNumber(instance) || instance % 1 !== 0) {
			this.error(path, '', 'must be of type [number] with no digits', typeof instance);
			return;
		}
		this.validateMinimum(schema, instance, path);
		this.validateMaximum(schema, instance, path);
		this.validateEnum(schema, instance,path);
	};

	/**
	* Validator.validateMinimum
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateMinimum = function(schema, instance, path) {
		if (has(schema, MINIMUM)) {
			var minimum = schema[MINIMUM];
			var exclusiveMinimum = schema[EXCLUSIVE_MINIMUM];
			if (exclusiveMinimum) {
				if (minimum >= instance) {
					this.error(path, '', 'must be greater than [' + minimum + ']', instance);
				}
			} else {
				if (minimum > instance) {
					this.error(path, '', 'must be greater than or equal to [' + minimum + ']', instance);
				}
			}
		}
	};

	/**
	* Validator.validateMaximum
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateMaximum = function(schema, instance, path) {
		if (has(schema, MAXIMUM)) {
			var maximum = schema[MAXIMUM];
			var exclusiveMaximum = schema[EXCLUSIVE_MAXIMUM];
			if (exclusiveMaximum) {
				if (instance >= maximum) {
					this.error(path, '', 'must be less than [' + maximum + ']', instance);
				}
			} else {
				if (instance > maximum) {
					this.error(path, '', 'must be less than or equal to [' + maximum + ']', instance);
				}
			}
		}
	};

	/**
	* Validator.validateTypeBoolean
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateTypeBoolean = function(schema, instance, path) {
		if (!isBoolean(instance)) {
			this.error(path, '', 'must be of type [boolean]', typeof instance);
		}
	};

	/**
	* Validator.validateMinItems
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateMinItems = function(schema, instance, path) {
		if (has(schema, MIN_ITEMS)) {
			var minItems = schema[MIN_ITEMS];
			if (instance.length < minItems) {
				this.error(path, '', 'need more than [' + minItems + '] objects', instance.length);
			}
		}
	};

	/**
	* Validator.validateMaxItems
	*
	* @param {object} schema
	* @param instance
	* @param {string} path
	*/
	Validator.prototype.validateMaxItems = function(schema, instance, path) {
		if (has(schema, MAX_ITEMS)) {
			var maxItems = schema[MAX_ITEMS];
			if (instance.length > maxItems) {
				this.error(path, '', 'need to be less than [' + maxItems + '] objects', instance.length);
			}
		}
	};

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
			if (has(schema, key)) {
				var message = this.validations[key](schema, instance);
				if (!isUndefined(message) && !isNull(message) && message !== '') {
					this.error(path, '', message, instance);
				}
			}
		}
	};


	/**
	* createJSONPath
	*
	* @param {string} path
	* @param {string} property
	* @returns {string} JSONPath
	*/
	function createJSONPath(path, property) {
		if (isString(property)) {
			return path + ((property !== '') ? '[\'' + property + '\']' : '');
		} else if (isNumber(property)) {
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

				if (isUndefined(callback) || !isFunction(callback)) {
					return fn();
				} else {
					callback(fn());
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
					var errors;
					// use registered schema
					if (isString(schema)) {
						var registeredSchema = schemas[schema];
						if (isUndefined(registeredSchema)) {
							errors = [];
							pushError(errors, '', '', 'specified schema is not registered', schema);
							return errors;
						}
						schema = registeredSchema;
					} else {
						// validate schema
						var schemaErrors = new Schema(schema).validate();
						if (!isEmpty(schemaErrors)) {
							errors = [];
							pushError(errors, '', '', 'specified schema validation failed', '');
							return errors;
						}
					}
					return new Validator(validations, schema).validate(instance);
				};

				if (isUndefined(callback) || !isFunction(callback)) {
					return fn();
				} else {
					callback(fn());
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
				if (!isFunction(fn)) {
					return false;
				}
				validations[name] = fn;
				return true;
			},

			/**
			* register schema
			*
			* @param {string} name
			* @param {object} schema
			* @param {Function} callback
			* @returns {array} errors
			*/
			registerSchema : function(name, schema, callback) {
				var fn = function(){
					// validate schema
					var errors = new Schema(schema).validate();
					if (isEmpty(errors)) {
						schemas[name] = schema;
					}
					return errors;
				};

				if (isUndefined(callback) || !isFunction(callback)) {
					return fn();
				} else {
					callback(fn());
				}
			},

			/**
			* unregister schema
			*
			* @param {string} name
			*/
			unregisterSchema : function(name) {
				delete schemas[name];
			},


			/**
			* create new validator
			*/
			createValidator : function() {
				return createInstance();
			},

			/**
			* available formats
			*/
			FORMATS : FORMATS
		};
	}

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

