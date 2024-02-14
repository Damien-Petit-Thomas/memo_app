// sequence.auth.js

import jwt from 'jsonwebtoken';

export async function authenticateToken({ event, resolve }) {
  const token = event.cookies.get('AuthorizationToken');
  if (token) {
    try {
      const jwtUser = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);

      event.locals.user = { id: jwtUser.id, email: jwtUser.email, name: jwtUser.name };
    } catch (error) {
      console.error(error);
    }
  }
  return resolve(event);
}
