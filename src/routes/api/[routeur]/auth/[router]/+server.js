import { json } from '@sveltejs/kit';
import { controllers } from '$lib/server/controller';
import { setAuthToken } from '$lib/services/auth.service';

// export async function GET({ cookies, request }) {
//   console.log('cookies', cookies);
//   const controller = controllers[`${request.url.split('/').pop()}Controller`];
//   const response = await controller.getAll();
//   return json(response);
// }

export async function POST({ cookies, request }) {
  const controllerMethod = request.url.split('/').pop();
  const { data } = await request.json();
  const response = await controllers.userController[controllerMethod](data);
  if (response && controllerMethod === 'getOne') {
    setAuthToken({ cookies, token: response.token });
  }
  return json(response);
}

// export async function PATCH({ request }) {
//   const controller = controllers[`${request.url.split('/').pop()}Controller`];
//   const { data, id } = await request.json();
//   const response = await controller.update(data, id);
//   return json(response);
// }

// export async function DELETE({ request }) {
//   const { id } = await request.json();
//   const controller = controllers[`${request.url.split('/').pop()}Controller`];
//   const response = await controller.delete(id);
//   return json(response);
// }
