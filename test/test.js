var Validator = require('..');

//Validator.validate(undefined,{ type: 'string' },function(){console.log('hoge')});

var schema = {
    name : "test",
    type : "object",
    additionalProperties : false,
    properties :
    {
        fullName                        : { type : "string", required : true },
        age                             : { type : "integer", required : true },
        optionalItem                    : { type : "string" },
        state                           : { type : "string" },
        city                            : { type : "string" },
        zip                             : { type : "integer", required : true, format : "postal-code" },
        married                         : { type : "boolean", required : true },
        dozen                           : { type : "integer", required : true, minimum : 12, maximum : 12 },
        dozenOrBakersDozen              : { type : "integer", required : true, minimum : 12, maximum : 13 },
        favoriteEvenNumber              : { type : "integer", required : true, divisibleBy : 2 },
        topThreeFavoriteColors          : { type : "array", required : true, minItems : 3, maxItems : 3, uniqueItems : true, items : { type : "string", format : "color" }},
        favoriteSingleDigitWholeNumbers : { type : "array", required : true, minItems : 1, maxItems : 10, uniqueItems : true, items : { type : "integer", minimum : 0, maximum : 9 }},
        favoriteFiveLetterWord          : { type : "string", required : true, minLength : 5, maxLength : 5 },
        emailAddresses                  : { type : "array", required : true, minItems : 1, uniqueItems : true, items : { type : "string", format : "email" }},
        ipAddresses                     : { type : "array", required : true, uniqueItems : true, items : { type : "string", format : "ip-address" }},
        favorite                        : { type : "object", required: true, properties : {
                                                  date : { type : "string", required : true },
                                                  site : { type : "string", required : true, format: "uri" }
                                              }
                                          },
        hoge                            : { type : "string", fuga : "foo" }
    }
}

Validator.validateSchema(schema, function(err) {
	console.log('error : ' + JSON.stringify(err, null, ' '));
});

var instance = {
    fullName : "John Doe",
    age : 47,
    state : "Massachusetts",
    city : "Boston",
    zip : 02201,
    married : false,
    dozen : 12,
    dozenOrBakersDozen : 13,
    favoriteEvenNumber : 14,
    topThreeFavoriteColors : [ "red", "purple", "lime" ],
    favoriteSingleDigitWholeNumbers : [ 7 ],
    favoriteFiveLetterWord : "coder",
    emailAddresses :
    [
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@letters-in-local.org",
//        "01234567890@numbers-in-local.net",
//        "&'*+-./=?^_{}~@other-valid-characters-in-local.net",
//        "mixed-1234-in-{+^}-local@sld.net",
//        "a@single-character-in-local.org",
//        "\"quoted\"@sld.com",
//        "\"\\e\\s\\c\\a\\p\\e\\d\"@sld.com",
//        "\"quoted-at-sign@sld.org\"@sld.com",
//        "\"escaped\\\"quote\"@sld.com",
//        "\"back\\slash\"@sld.com",
//        "one-character-third-level@a.example.com",
//        "single-character-in-sld@x.org",
//        "local@dash-in-sld.com",
//        "letters-in-sld@123.com",
//        "one-letter-sld@x.org",
//        "uncommon-tld@sld.museum",
//        "uncommon-tld@sld.travel",
//        "uncommon-tld@sld.mobi",
//        "country-code-tld@sld.uk",
//        "country-code-tld@sld.rw",
//        "local@sld.newTLD",
//        "the-total-length@of-an-entire-address.cannot-be-longer-than-two-hundred-and-fifty-four-characters.and-this-address-is-254-characters-exactly.so-it-should-be-valid.and-im-going-to-add-some-more-words-here.to-increase-the-lenght-blah-blah-blah-blah-bla.org",
//        "the-character-limit@for-each-part.of-the-domain.is-sixty-three-characters.this-is-exactly-sixty-three-characters-so-it-is-valid-blah-blah.com",
        "local@sub.domains.com"
    ],
    ipAddresses : [ "127.0.0.1", "24.48.64.2", "192.168.1.1", "209.68.44.3", "2.2.2.2" ],
    favorite : {
        date : 'a',
        site : "http://www.facebook.com/",
    },
    hoge : 'foo'
}

Validator.addValidation('fuga', function(schema, instance) {
	if (instance !== schema.fuga) {
		return 'value must be \'' + schema.fuga + '\'';
	}
	return;
});

Validator.validate(schema, instance, function(err) {
	console.log('error : ' + JSON.stringify(err, null, ' '));
});


