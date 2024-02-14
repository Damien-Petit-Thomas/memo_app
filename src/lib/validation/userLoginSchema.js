import Joi from 'joi';

export default {
  POST: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required()
      .messages({
        'string.base': 'L\'adresse email doit valide',
        'string.empty': 'Le champ email est vide',
        'string.email': 'L\'adresse email doit être au format email',
        'any.required': 'L\'adresse email est requise',
      }),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
  }),
};
