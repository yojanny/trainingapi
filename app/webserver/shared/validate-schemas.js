const Joi = require('joi');

async function validateEmailPassword(payload) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(3).max(30).required(),
  });

  Joi.assert(payload, schema);
}

async function validateWorkoutId(payload) {
  const schema = Joi.object({
    workoutId: Joi.number().integer().positive().required(),
  });

  Joi.assert(payload, schema);
}

async function validateWorkout(payload) {
  const schema = Joi.object({
    description: Joi.string().min(16).max(128).required(),
    name: Joi.string().min(3).max(30).required(),
    typology: Joi.string().min(3).max(30).required(),
    muscle: Joi.string().min(3).max(30).required(),
  });

  Joi.assert(payload, schema);
}

async function validateWorkoutUpdate(payload) {
  const schema = Joi.object({
    description: Joi.string().min(16).max(128).allow(''),
    name: Joi.string().min(3).max(30).allow(''),
    typology: Joi.string().min(3).max(30).allow(''),
    muscle: Joi.string().min(3).max(30).allow(''),
  });

  Joi.assert(payload, schema);
}

module.exports = {
  validateEmailPassword,
  validateWorkoutId,
  validateWorkout,
  validateWorkoutUpdate,
};
