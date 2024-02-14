import Joi from 'joi';

export default {
  POST: Joi.object({
    name: Joi.string().alphanum().min(3).max(30)
      .required()
      .messages({
        'string.base': 'Le nom  doit ếtre en toutes lettres',
        'string.empty': 'Il faut un nom d',
        'string.min': 'Le nom  doit contenir au moins 3 caractères',
        'string.max': 'Le nom ne doit pas dépasser 30 caractères',
        'any.required': 'Le nom est requis',
      }),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
    confirmPassword: Joi.ref('password'),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required()
      .messages({
        'string.base': 'L\'adresse email doit être une chaîne de caractères',
        'string.empty': 'L\'adresse email ne doit pas être vide',
        'string.email': 'L\'adresse email doit être au format email',
        'any.required': 'L\'adresse email est requise',
      }),
  }),
  PUT: Joi.object({
    name: Joi.string().alphanum().min(3).max(30)
      .required(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
    confirmPassword: Joi.ref('password'),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  }),
  DELETE: Joi.object({
    name: Joi.string().alphanum().min(3).max(30)
      .required(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
  }),
  GET: Joi.object({
    password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
  }),
};
