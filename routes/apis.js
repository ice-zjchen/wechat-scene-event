var express = require('express');
var md5 = require('blueimp-md5');
var db = require('../utils/db');
var userModel = require('../models/users');
var programModel = require('../models/programs');
var ResponseBody = require('../utils/api').ResponseBody;
var router = express.Router();

function resErrorHandler(res, resBody) {
	return function(err) {
		console.error(err);
		resBody = new ResponseBody(false, err, '失败');

		return res.json(resBody.getter());
	}
}

/* users operations */
router.get('/users', function(req, res, next) {
	var resBody;

	db.hgetallAsync('users').then(function(result) {
		if (!result) {
			resBody = new ResponseBody(true, result, '查询为空');
		}
		else {
			var detail = {};
			for (key in result) {
				detail[key] = JSON.parse(result[key]);
				delete detail[key].openid;
			}

			resBody = new ResponseBody(true, detail, '成功');
		}

		return res.json(resBody.getter());

	}).catch(resErrorHandler(res, resBody));
});



router.get('/user/current', function(req, res, next) {
	var resBody;
	var token = req.cookies[global.LOGIN_TOKEN];

	db.getAsync(token).then(function(openid) {
		return db.hgetAsync('users', openid);
	}).then(function(result) {
		if (!result) {
			resBody = new ResponseBody(true, result, '查询为空');
		}
		else {
			var detail = JSON.parse(result);
			delete detail.openid;
			resBody = new ResponseBody(true, detail, '成功');
		}

		return res.json(resBody.getter());

	}).catch(resErrorHandler(res, resBody));
});

router.get('/user/:openid', function(req, res, next) {
	var resBody;

	db.hgetAsync('users', req.params.openid).then(function(result) {
		if (!result) {
			resBody = new ResponseBody(true, result, '查询为空');
		}
		else {
			var detail = JSON.parse(result);
			delete detail.openid;
			resBody = new ResponseBody(true, detail, '成功');
		}

		return res.json(resBody.getter());

	}).catch(resErrorHandler(res, resBody));
});


router.post('/user', function(req, res, next) {
	var resBody;
	var validResult = userModel.validate(req.body);

	if (!validResult.valid) {
		return res.json({ success: false, error: validResult.errors[0].message });
	}
	else {
		req.body.createdTime = new Date();

		db.hsetAsync('users', req.body.openid, JSON.stringify(req.body)).then(function(result) {
			var msg = (result === 1)? '添加成功': '更新成功';
			resBody = new ResponseBody(true, result, msg);

			return res.json(resBody.getter());

		}).catch(resErrorHandler(res, resBody));
	}
});

/* programs operations */
router.get('/programs', function(req, res, next) {
	
	db.hgetall('programs', function(err, result) {
		var resBody;

		if (err) {
			console.error(err);
			resBody = new ResponseBody(false, err, '失败');
			return res.json(resBody.getter());
		}

		if (!result) {
			resBody = new ResponseBody(true, result, '查询为空');
		}
		else {
			var detail = {};
			for (key in result) {
				detail[key] = JSON.parse(result[key]);
			}

			resBody = new ResponseBody(true, detail, '成功');
		}

		return res.json(resBody.getter());
	});

});

router.get('/program/:seqid', function(req, res, next) {
	
	db.hget('programs', req.params.seqid, function(err, result) {
		var resBody;

		if (err) {
			console.error(err);
			resBody = new ResponseBody(false, err, '失败');
			return res.json(resBody.getter());
		}
		if (!result) {
			resBody = new ResponseBody(true, result, '查询为空');
		}
		else {
			resBody = new ResponseBody(true, JSON.parse(result), '成功');
		}

		return res.json(resBody.getter());
	});

});

router.post('/program', function(req, res, next) {
	var validResult = programModel.validate(req.body);

	if (!validResult.valid) {
		return res.json({ success: false, error: validResult.errors[0].message });
	}
	else {
		req.body.createdTime = new Date();

		db.hset("programs", req.body.seqid, JSON.stringify(req.body), function(err, result) {
			var resBody;

			if (err) {
				console.error(err);
				resBody = new ResponseBody(false, err, '失败');
				return res.json(resBody.getter());
			}

			var msg = (result === 1)? '添加成功': '更新成功';
			resBody = new ResponseBody(true, result, msg);

			return res.json(resBody.getter());
		});
	}

});


router.get('/login', function(req, res, next) {
	var token = md5(req.query.openid, Date.now());

	db.setAsync(token, req.query.openid).then(function(result) {
		return db.expireAsync(token, 12*3600); //秒
	}).then(function(result) {
		res.cookie(global.LOGIN_TOKEN, token, { expires: new Date(Date.now() + 12*3600*1000), domain: req.hostname, path: '/', httpOnly: true });
		return res.send(token);
	}).catch(function(err) {

	});

});







module.exports = router;
