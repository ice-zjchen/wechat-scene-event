var expect = require('chai').expect;
var request = require('superagent');
var db = require('../utils/db');

describe("User API", function() {
  var user = {
    openid: 'openid007',
    nickname: 'JANE',
    sex: 1,
    province: 'PROVINCE',
    city: 'CITY',
    country: 'CN',
    headimgurl: 'http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46',
    privilege: [ 'PRIVILEGE1', 'PRIVILEGE2'],
    unionid: 'unionid001'
  };

  before(function(done) {
    db.hset('users', user.openid, JSON.stringify(user), function(err, result) {done();});
  });

  describe("get all users", function() {

    var url = "http://localhost:3000/api/users";

    it("return status 200", function(done) {
      request.get(url)
      .set('Accept', 'application/json')
      .end(function(err, res){
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it("return success flag", function(done) {
      request.get(url)
      .set('Accept', 'application/json')
      .end(function(err, res){
        expect(res.body.success).to.equal(true);
        done();
      });
    });

  });

  describe("get user by openid", function() {

    var url = "http://localhost:3000/api/user/openid007";

    it("return success flag", function(done) {
      request.get(url)
      .set('Accept', 'application/json')
      .end(function(err, res){
        expect(res.body.success).to.equal(true);
        done();
      });
    });

    it("return empty detail", function(done) {
      request.get(url+Math.random())
      .set('Accept', 'application/json')
      .end(function(err, res){
        expect(res.body.detail).to.equal(null);
        done();
      });
    });

  });

  describe("add a new user", function() {

    var url = "http://localhost:3000/api/user";

    it("return success flag", function(done) {
      var u = new Object(user);
      u.openid = u.openid + Math.random();

      request.post(url)
      .send(u)
      .set('Accept', 'application/json')
      .end(function(err, res){
        expect(res.body.success).to.equal(true);
        done();
      });
    });

    it("return false flag without OPENID", function(done) {
      var u = new Object(user);
      delete u.openid;

      request.post(url)
      .send(u)
      .set('Accept', 'application/json')
      .end(function(err, res){
        expect(res.body.success).to.equal(false);
        done();
      });
    });

    it("return false flag without NICKNAME", function(done) {
      var u = new Object(user);
      delete u.nickname;

      request.post(url)
      .send(u)
      .set('Accept', 'application/json')
      .end(function(err, res){
        expect(res.body.success).to.equal(false);
        done();
      });
    });

    it("return false flag without HEADIMGURL", function(done) {
      var u = new Object(user);
      delete u.headimgurl;

      request.post(url)
      .send(u)
      .set('Accept', 'application/json')
      .end(function(err, res){
        expect(res.body.success).to.equal(false);
        done();
      });
    });

  });

});