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

const idParams = Joi.object().keys({
  id: Joi.number().integer()
    .required(),
});

const emailParams = Joi.object().keys({
  email: Joi.string().email({ minDomainAtoms: 2 }).required(),
});

const loanSchema = Joi.object().keys({
  userEmail: Joi.string().email({ minDomainAtoms: 2 }).required(),
  tenor: Joi.number().integer()
    .required(),
  amount: Joi.number()
    .required(),
});

const repaymentSchema = Joi.object().keys({
  paidAmount: Joi.number()
    .required(),
});

const loanIdParams = Joi.object().keys({
  loanId: Joi.number().integer()
    .required(),
});


export default {
  userSchema, loginSchema, idParams, emailParams, loanSchema, repaymentSchema, loanIdParams,
};
