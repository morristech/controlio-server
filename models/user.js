const mongoose = require('mongoose');

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
    select: false,
  },
  password: {
    type: String,
    select: false,
  },
  token: {
    type: String,
    select: false,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
    select: false,
  },
  isDemo: {
    type: Boolean,
    required: true,
    default: false,
    select: false,
  },
  iosPushTokens: [{
    type: String,
    select: false,
    required: true,
    default: [],
  }],
  androidPushTokens: [{
    type: String,
    select: false,
    required: true,
    default: [],
  }],
  webPushTokens: [{
    type: String,
    select: false,
    required: true,
    default: [],
  }],
  name: {
    type: String,
    required: false,
    select: false,
  },
  phone: {
    type: String,
    required: false,
    select: false,
  },
  photo: {
    type: String,
    required: false,
    select: false,
  },
  /** Projects */
  projects: [{
    type: Schema.ObjectId,
    ref: 'project',
    select: false,
    required: true,
    default: [],
  }],
  /** System variables */
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

userSchema.methods.maxNumberOfProjects = (plan) => {
  if (plan === 0) {
    return 1;
  } else if (plan === 1) {
    return 5;
  } else if (plan === 2) {
    return 20;
  } else if (plan === 3) {
    return 50;
  }
  return 1;
};

mongoose.model('user', userSchema);
