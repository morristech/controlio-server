const mongoose = require('mongoose');
const config = require('../config');
const randomToken = require('random-token').create(config.randomTokenSalt);
const jwt = require('../helpers/jwt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  /** Stripe */
  stripeId: {
    type: String,
    required: true,
    select: false,
  },
  stripeSubscriptionId: {
    type: String,
    select: false,
  },
  plan: {
    type: Number,
    required: true,
    default: 0,
    select: false,
  },
  /** Variables */
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  photo: {
    type: String,
    required: false,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  isDemo: {
    type: Boolean,
    required: true,
    default: false,
  },
  /** Push tokens */
  iosPushTokens: [{
    type: String,
    required: true,
    default: [],
    select: false,
  }],
  androidPushTokens: [{
    type: String,
    required: true,
    default: [],
    select: false,
  }],
  webPushTokens: [{
    type: String,
    required: true,
    default: [],
    select: false,
  }],
  /** Projects */
  invites: [{
    type: Schema.ObjectId,
    ref: 'invite',
    required: true,
    default: [],
  }],
  projects: [{
    type: Schema.ObjectId,
    ref: 'project',
    required: true,
    default: [],
  }],
  /** System variables */
  password: {
    type: String,
    select: false,
  },
  token: {
    type: String,
    select: false,
  },
  tokenForPasswordReset: {
    type: String,
    select: false,
  },
  tokenForPasswordResetIsFresh: {
    type: Boolean,
    required: true,
    default: false,
    select: false,
  },
  magicToken: {
    type: String,
    select: false,
  },
});

userSchema.methods.generateResetPasswordToken = function generateResetPasswordToken() {
  const token = randomToken(10);

  this.tokenForPasswordReset = jwt.sign({
    token,
    userid: this._id,
  }, {
    expiresIn: '1d',
  });
  this.tokenForPasswordResetIsFresh = true;
};

userSchema.methods.generateMagicToken = function generateMagicToken() {
  const token = randomToken(10);

  this.magicToken = jwt.sign({
    token,
    userid: this._id,
  }, {
    expiresIn: '1d',
  });
};

userSchema.methods.maxProjects = function maxProjects() {
  switch (this.plan) {
    case 0:
      return 1;
    case 1:
      return 5;
    case 2:
      return 20;
    case 3:
      return 50;
    default:
      return 1;
  }
};

mongoose.model('user', userSchema);
