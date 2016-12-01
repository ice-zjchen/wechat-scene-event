var Validator = require('jsonschema').Validator;
var v = new Validator();

var schema = {
	"type": "object",
  "seqid": { "type": "integer" },
  "title": { "type": "string" },
  "cover": { "type": "string" },
  "department": { "type": "string" },
  "description": { "type": "string" },
  "required": [ "seqid", "title", "cover", "department", "description" ]
};

module.exports.validate = function(instance) {
	return v.validate(instance, schema);
}
