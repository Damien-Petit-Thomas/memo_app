import { json } from '@sveltejs/kit';
import { controllers } from '$lib/server/controller';
import { setAuthToken } from '$lib/services/auth.service';

export async function POST({ cookies, request }) {
  const controllerMethod = request.url.split('/').pop();
  const { data } = await request.json();
  const response = await controllers.userController[controllerMethod](data);
  if (response.ok && controllerMethod === 'getOne') {
    setAuthToken({ cookies, token: response.token });
  }
  return json(response);
}
