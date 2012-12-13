proteus-validator
==============================

Proteus Validator is JSON Schema Validator which provides an interface for validating JSON objects against <a href="http://tools.ietf.org/html/draft-zyp-json-schema-03">JSON Schema Draft 3</a>. It runs both in a browser and on Node.js.

# Usage

## Prepare

#### Node.js

```js
var validator = require('proteus-validator');
```

#### browser

```html
<script type="text/javascript" src="http://underscorejs.org/underscore-min.js"></script>
<script type="text/javascript" src="https://github.com/caolan/async/tree/master/lib/async.js"></script>
<script type="text/javascript" src="proteus-validator/lib/validator.js"></script>
```

## validate schema

```js
var schema = { type: 'integer' };

// synchronous call
var errors = validator.validateSchema(schema);

// asynchronous call
validator.validateSchema(schema, function(errors) {
...
});
```

## validate json objects

```js
var schema = { type: 'integer' };
var instance = 1;

// synchronous call
var errors = validator.validate(schema, instance);

// asynchronous call
validator.validate(schema, instance, function(errors) {
//...
});
```

This also runs schema validation.
If you are going to validate many times by the same schema, it is recommended to register schema by registSchema method.

## regist schema

```js
var schema = { type: 'integer' };
var errors = validator.registSchema('schema1', schema);

// to use registered schema, send registered schema name instead of schema itself.
var errors = validator.validate('schema1', instance);

// you can also unregist schema
validator.unregistSchema('schema1');
```

## others

#### addValidation

You can create your own validation.

```js
validator.addValidation('customValidation', function(schema, instance) {
    console.log(schema.customValidation); // someschema
    console.log(instance);               // somevalue
});
validator.validate({
    type: 'object',
    properties: {
        prop: { type: 'string', customValidation: 'someschema' }
    }
},
{ prop: 'somevalue' },
function(errors) {
//...
});
```

#### createValidator

You can create new validator.

```js
var newValidator = validator.createValidator();
```

## Features

#### Definitions

<table>
<thead>
<tr>
<th align="center">Value</th>
<th align="center">JSON Schema Draft v3</th>
<th align="center">Proteus Validator</th>
<th align="center">Comments</th>
</tr>
</thead>
<tbody>
<tr>
<td align="left">type</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">properties</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">patternProperties</td>
<td align="center">✔</td>
<td align="center"></td>
<td align="left"></td>
</tr>
<tr>
<td align="left">additionalProperties</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">items</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">additionalItems</td>
<td align="center">✔</td>
<td align="center"></td>
<td align="left"></td>
</tr>
<tr>
<td align="left">required</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">dependencies</td>
<td align="center">✔</td>
<td align="center"></td>
<td align="left"></td>
</tr>
<tr>
<td align="left">minimum</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">maximum</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">exclusiveMinimum</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">exclusiveMaximum</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">minItems</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">maxItems</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">uniqueItems</td>
<td align="center">✔</td>
<td align="center"></td>
<td align="left"></td>
</tr>
<tr>
<td align="left">pattern</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">minLength</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">maxLength</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">enum</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">default</td>
<td align="center">✔</td>
<td align="center"></td>
<td align="left"></td>
</tr>
<tr>
<td align="left">title</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">description</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">format</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">divisibleBy</td>
<td align="center">✔</td>
<td align="center"></td>
<td align="left"></td>
</tr>
<tr>
<td align="left">disallow</td>
<td align="center">✔</td>
<td align="center"></td>
<td align="left"></td>
</tr>
<tr>
<td align="left">extends</td>
<td align="center">✔</td>
<td align="center"></td>
<td align="left"></td>
</tr>
<tr>
<td align="left">id</td>
<td align="center">✔</td>
<td align="center"></td>
<td align="left"></td>
</tr>
<tr>
<td align="left">$ref</td>
<td align="center">✔</td>
<td align="center"></td>
<td align="left"></td>
</tr>
<tr>
<td align="left">$schema</td>
<td align="center">✔</td>
<td align="center"></td>
<td align="left"></td>
</tr>
</tbody>
</table>

#### Types

<table>
<thead>
<tr>
<th align="center">Value</th>
<th align="center">JSON Schema Draft v3</th>
<th align="center">Proteus Validator</th>
<th align="center">Comments</th>
</tr>
</thead>
<tbody>
<tr>
<td align="left">string</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">number</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">integer</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">boolean</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">null</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">any</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">object</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">array</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">Union Types</td>
<td align="center">✔</td>
<td align="center"></td>
<td align="left"></td>
</tr>
</tbody>
</table>

#### String Formats

<table>
<thead>
<tr>
<th align="center">Value</th>
<th align="center">JSON Schema Draft v3</th>
<th align="center">Proteus Validator</th>
<th align="center">Comments</th>
</tr>
</thead>
<tbody>
<tr>
<td align="left">date-time</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">date</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">time</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">utc-millisec</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">regex</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">color</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">style</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">phone</td>
<td align="center">✔</td>
<td align="center"></td>
<td align="left">any string is allowed</td>
</tr>
<tr>
<td align="left">uri</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">email</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">ip-address</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
<tr>
<td align="left">ipv6</td>
<td align="center">✔</td>
<td align="center"></td>
<td align="left">any string is allowed</td>
</tr>
<tr>
<td align="left">host-name</td>
<td align="center">✔</td>
<td align="center">✔</td>
<td align="left"></td>
</tr>
</tbody>
</table>




