var Validator = require('jsonschema').Validator;
var db = require('../utils/db');

var v = new Validator();

var schema = {
	"type": "object",
  "required": [ "openid", "headimgurl", "nickname" ],

  "openid": { "type": "string"},
  "nickname": { "type": "string"},
  "headimgurl": { "type": "string"},
  "sex": { "type": "integer"},
  "province": { "type": "string"},
  "city": { "type": "string"},
  "country": { "type": "string"},
  "privilege": { "type": "array"},
  "unionid": { "type": "string"}
};

module.exports.validate = function(instance) {
	return v.validate(instance, schema);
}

module.exports.getUserListAsync = function(instance) {
	db.hgetallAsync('users');
}
