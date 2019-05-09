import Joi from 'joi';

const userSchema = Joi.object().keys({
  firstName: Joi.string().alphanum().min(3).max(20)
    .required(),
  lastName: Joi.string().alphanum().min(3).max(20)
    .required(),
  email: Joi.string().email({ minDomainAtoms: 2 }).required(),
  password: Joi.string().min(6).max(20).required(),
  address: Joi.string().min(2).max(100).required(),
});

const loginSchema = Joi.object().keys({
  email: Joi.string().email({ minDomainAtoms: 2 }).required(),
  password: Joi.string().min(6).max(20).required(),
});

export default {
  userSchema, loginSchema,
};
