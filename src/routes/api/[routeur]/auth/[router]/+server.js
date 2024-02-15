import { json } from '@sveltejs/kit';
import { controllers } from '$lib/server/controller';
import { setAuthToken, clearAuthToken } from '$lib/services/auth.service';

export async function POST({ cookies, request }) {
  console.log("cookies", cookies)
  const controllerMethod = request.url.split('/').pop();
  const { data } = await request.json();
  const response = await controllers.userController[controllerMethod](data);
  if (response && controllerMethod === 'getOne') {
    clearAuthToken({ cookies });
    setAuthToken({ cookies, token: response.token });
  }
  return json(response);
}
