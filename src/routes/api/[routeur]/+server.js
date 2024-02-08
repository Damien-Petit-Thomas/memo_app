import { json } from '@sveltejs/kit';
import { controllers } from '$lib/controller';

export async function GET({ request }) {
  const controller = controllers[`${request.url.split('/').pop()}Controller`];
  const response = await controller.getAll();
  return json(response);
}

export async function POST({ request }) {
  const controller = controllers[`${request.url.split('/').pop()}Controller`];
  const { data } = await request.json();
  const response = await controller.create(data);
  return json(response);
}

export async function PATCH({ request }) {
  const controller = controllers[`${request.url.split('/').pop()}Controller`];
  const { data } = await request.json();
  const { id } = data;
  const response = await controller.update(data, id);
  return json(response);
}

export async function DELETE({ request }) {
  const { id } = await request.json();
  const controller = controllers[`${request.url.split('/').pop()}Controller`];
  const response = await controller.delete(id);
  return json(response);
}
