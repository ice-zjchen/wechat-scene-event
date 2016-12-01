
function ResponseBody(success, detail, message) {
	this.success = success || false;
	this.message = message || "default message";
	this.detail = detail || null;

	this.getter = function() {
		var body = {};
		body.success = this.success;
		body.message = this.message;

		if (success) {
			body.detail = this.detail;
		}
		else {
			body.error = this.detail;
		}

		return body;
	}
}

module.exports.ResponseBody = ResponseBody;
