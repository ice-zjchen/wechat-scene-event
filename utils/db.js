var bluebird = require("bluebird");
var redis = require("redis");
var config = require('config');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

var dbConfig = config.get('redis');
var client = redis.createClient(dbConfig);

module.exports = client;