import joi from 'joi';

export default {
  POST: joi.object({
    name: joi.string().alphanum().min(3).max(30)
      .required()
      .messages({
        'string.base': 'Le nom  doit ếtre en toutes lettres',
        'string.empty': 'Il faut un nom ',
        'string.min': 'Le nom  doit contenir au moins 3 caractères',
        'string.max': 'Le nom ne doit pas dépasser 30 caractères',
        'any.required': 'Le nom est requis',
      }),
    password: joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
    confirmPassword: joi.ref('password'),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required()
      .messages({
        'string.base': 'L\'adresse email doit être une chaîne de caractères',
        'string.empty': 'L\'adresse email ne doit pas être vide',
        'string.email': 'L\'adresse email doit être au format email',
        'any.required': 'L\'adresse email est requise',
      }),
  }),
};
