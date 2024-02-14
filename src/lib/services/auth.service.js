import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export async function authentifyUser(user, password) {
  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) throw new Error('Invalid password', { statusCode: 400 });
  const token = jwt.sign({
    id: user.id,
    email: user.email,
    name: user.name,
  }, process.env.JWT_SECRET, { expiresIn: '1d' });
  console.log('token', token);
  return token;
}

export async function setAuthToken({ cookies, token }) {
  const userId = jwt.decode(token).id;
  cookies.set('AuthorizationToken', `Bearer ${token}`, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
    path: '/',
  });
  cookies.set('userId', userId, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
    path: '/',
  });
}

export async function clearAuthToken({ cookies }) {
  cookies.set('AuthorizationToken', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
  cookies.set('userId', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
}
