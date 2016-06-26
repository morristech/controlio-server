var express = require('express');
var router = express.Router();
var dbmanager = rootRequire('helpers/dbmanager');
var auth = rootRequire('helpers/auth');

// Private API

router.use(auth.checkToken);

router.post('/', function(req, res, next) {
  
});

router.post('/getprojects', function(req, res, next) {
  var userId = req.get('x-access-user-id');
  var skip = req.body.skip || 0;
  var limit = req.body.limit || 20;
  dbmanager.getProjects(userId, skip, limit, function(err, projects) {
    if (err) {
      next(err);
    } else {
      res.send(projects);
    }
  });
});

// DEBUG

router.get('/removeallprojects', function(req, res, next) {
  dbmanager.debug.removeAllUsers(function(err) {
    if (err) {
      next(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// Export

module.exports = router;