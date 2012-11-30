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
    }
}

console.log('error : ' + JSON.stringify(Validator.validateSchema(schema)));

var schema2 = {
	name : 'test2',
	type : 'string',
	required: true
}

console.log('error : ' + JSON.stringify(Validator.validateSchema(schema2)));

