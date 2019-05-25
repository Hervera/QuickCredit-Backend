import Joi from 'joi';

const userSchema = Joi.object().keys({
  firstname: Joi.string().alphanum().min(3).max(20)
    .required(),
  lastname: Joi.string().alphanum().min(3).max(20)
    .required(),
  email: Joi.string().email({ minDomainAtoms: 2 }).required(),
  password: Joi.string().min(6).max(20).required(),
  address: Joi.string().min(2).max(100).required(),
  isadmin: Joi.boolean().allow(null),
  status: Joi.allow(null),
  createdon: Joi.allow(null),
  updatedon: Joi.allow(null),
});

const loginSchema = Joi.object().keys({
  email: Joi.string().email({ minDomainAtoms: 2 }).required(),
  password: Joi.string().min(6).max(20).required(),
});

const idParams = Joi.object().keys({
  id: Joi.number().integer().positive()
    .required(),
});

const emailParams = Joi.object().keys({
  email: Joi.string().email({ minDomainAtoms: 2 }).required(),
});

const loanSchema = Joi.object().keys({
  useremail: Joi.string().email({ minDomainAtoms: 2 }).required(),
  tenor: Joi.number().positive().integer().min(1)
    .max(12)
    .required(),
  amount: Joi.number().positive().required(),
});

const repaymentSchema = Joi.object().keys({
  loanid: Joi.number().positive().integer().required(),
  paidamount: Joi.number().positive().required(),
});

const loanidParams = Joi.object().keys({
  loanid: Joi.number().integer().positive().required(),
});

const loanStatusSchema = Joi.object().keys({
  id: Joi.number().integer().positive().required(),
  status: Joi.string().valid('approved', 'rejected').required(),
});


export default {
  userSchema, loginSchema, idParams, emailParams, loanSchema, repaymentSchema, loanidParams, loanStatusSchema,
};
