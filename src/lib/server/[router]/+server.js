import { json } from '@sveltejs/kit';
import { controllers } from '$lib/server/controller';
import { setAuthToken } from '$lib/services/auth.service';

export async function GET({ request }) {
  const { userId } = request;
  const controller = controllers[`${request.url.split('/').pop()}Controller`];
  const response = await controller.getAll(userId);
  return json(response);
}

export async function POST({ cookies, request }) {
  const controller = request.url.split('/').pop();
  const finaleController = controllers[`${controller}Controller`];
  const { data } = await request.json();
  const response = await finaleController.create(data);
  if (controller === 'user') {
    setAuthToken({ cookies, token: response.token });
  }
  return json(response);
}

export async function PATCH({ request }) {
  const controller = controllers[`${request.url.split('/').pop()}Controller`];
  const { data, id } = await request.json();
  const response = await controller.update(data, id);
  return json(response);
}

export async function DELETE({ request }) {
  const { id } = await request.json();
  const controller = controllers[`${request.url.split('/').pop()}Controller`];
  const response = await controller.delete(id);
  return json(response);
}
