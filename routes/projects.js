/** Dependencies */
const express = require('express');
const db = require('../helpers/db');
const auth = require('../helpers/auth');
const validate = require('express-validation');
const validation = require('../validation/projects');
const errors = require('../helpers/errors');
const _ = require('lodash');
const validator = require('validator');
const demo = require('../helpers/demo');

const router = express.Router();

/** Private API check */
router.use(auth.checkToken);

/** Method to get a project by id */
router.get('/project', validate(validation.getProject), (req, res, next) => {
  const userId = req.user._id;
  const projectId = req.query.projectid;

  db.getProject(userId, projectId)
    .then(project => res.send(project))
    .catch(err => next(err));
});

/** Method to get a list of the projects */
router.get('/', validate(validation.getProjects), (req, res, next) => {
  const userId = req.user._id;
  const skip = parseInt(req.query.skip || 0, 10);
  const limit = parseInt(req.query.limit || 20, 10);
  const type = req.query.type || 'all';
  const query = req.query.query || '';

  db.getProjects(userId, skip, limit, type, query)
    .then(projects => res.send(projects))
    .catch(err => next(err));
});

/** Method to get invites to projects for user */
router.get('/invites', (req, res, next) => {
  const userId = req.user._id;
  db.getInvites(userId)
    .then(invites => res.send(invites))
    .catch(err => next(err));
});

/** Check if not demo */
router.use(demo.checkDemo);

/** Method to create a new project */
router.post('/', validate(validation.post), (req, res, next) => {
  const project = _.clone(req.body);
  project.progressEnabled = req.body.progressEnabled || false;
  project.userId = req.user._id;
  if (project.type === 'client') {
    if (validator.isEmail(project.managerEmail)) {
      project.managerEmail = project.managerEmail.toLowerCase();
    } else {
      next(errors.validManagerEmail());
      return;
    }
  } else if (project.type === 'manager') {
    project.clientEmails = _.uniq(req.body.clientEmails.map(email => email.toLowerCase()))
      .filter(email => validator.isEmail(email));
  }
  db.addProject(project)
    .then(dbproject => res.send(dbproject))
    .catch(err => next(err));
});

/** Method to accept or reject invite */
router.post('/invite', validate(validation.postInvite), (req, res, next) => {
  const userId = req.user._id;
  const inviteId = req.body.inviteid;
  const accept = req.body.accept;

  db.acceptInvite(userId, inviteId, accept)
    .then(() => res.send({ success: true }))
    .catch(err => next(err));
});

/** Method to delete an invite */
router.delete('/invite', validate(validation.deleteInvite), (req, res, next) => {
  const userId = req.user._id;
  const inviteId = req.body.inviteid;

  db.removeInvite(userId, inviteId)
    .then(() => res.send({ success: true }))
    .catch(err => next(err));
});

/** Method to add managers */
router.post('/managers', validate(validation.postManagers), (req, res, next) => {
  const userId = req.user._id;
  const projectId = req.body.projectid;
  const managers = _.uniq(req.body.managers.map(email => email.toLowerCase()));

  if (managers.includes('giraffe@controlio.co')) {
    next(errors.addDemoAsClient());
    return;
  }

  db.addManagers(userId, projectId, managers)
    .then(() => res.send({ success: true }))
    .catch(err => next(err));
});

/** Method to delete a manager */
router.delete('/manager', validate(validation.deleteManager), (req, res, next) => {
  const userId = req.user._id;
  const managerId = req.body.managerid;
  const projectId = req.body.projectid;

  db.removeManager(userId, managerId, projectId)
    .then(() => res.send({ success: true }))
    .catch(err => next(err));
});

/** Method to delete a client */
router.delete('/client', validate(validation.deleteClient), (req, res, next) => {
  const userId = req.user._id;
  const clientId = req.body.clientid;
  const projectId = req.body.projectid;

  db.removeClient(userId, clientId, projectId)
    .then(() => res.send({ success: true }))
    .catch(err => next(err));
});

/** Method to add clients */
router.post('/clients', validate(validation.postClients), (req, res, next) => {
  const userId = req.user._id;
  const projectId = req.body.projectid;
  const clients = _.uniq(req.body.clients.map(email => email.toLowerCase()));

  if (clients.includes('giraffe@controlio.co')) {
    next(errors.addDemoAsClient());
    return;
  }

  db.addClients(userId, projectId, clients)
    .then(() => res.send({ success: true }))
    .catch(err => next(err));
});

/** Method to edit project */
router.put('/', validate(validation.put), (req, res, next) => {
  const userId = req.user._id;
  const projectId = req.body.projectid;
  const title = req.body.title;
  let description = req.body.description;
  if (description && description.length <= 0) {
    description = null;
  }
  const image = req.body.image;
  const progressEnabled = req.body.progressEnabled || false;

  db.editProject(userId, projectId, title, description, image, progressEnabled)
    .then(project => res.send(project))
    .catch(err => next(err));
});

/** Method to edit progress */
router.put('/progress', validate(validation.putProgress), (req, res, next) => {
  const userId = req.user._id;
  const projectId = req.body.projectid;
  const progress = req.body.progress;

  db.editProgress(userId, projectId, progress)
    .then(() => res.send({ success: true }))
    .catch(err => next(err));
});

/** Method to leave project */
router.post('/leave', validate(validation.leave), (req, res, next) => {
  const userId = req.user._id;
  const projectId = req.body.projectid;

  db.leaveProject(userId, projectId)
    .then(() => res.send({ success: true }))
    .catch(err => next(err));
});

/** Method to delete project */
router.delete('/', validate(validation.delete), (req, res, next) => {
  const userId = req.user._id;
  const projectId = req.body.projectid;

  db.deleteProject(userId, projectId)
    .then(() => res.send({ success: true }))
    .catch(err => next(err));
});


/** Method to finish the project */
router.post('/finish', validate(validation.finish), (req, res, next) => {
  const userId = req.user._id;
  const projectId = req.body.projectid;

  db.finishProject(userId, projectId, true)
    .then(project => res.send(project))
    .catch(err => next(err));
});

/** Method to revive the project */
router.post('/revive', validate(validation.finish), (req, res, next) => {
  const userId = req.user._id;
  const projectId = req.body.projectid;

  db.finishProject(userId, projectId, false)
    .then(project => res.send(project))
    .catch(err => next(err));
});

/** Export */
module.exports = router;
