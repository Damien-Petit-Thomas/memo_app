import { json } from '@sveltejs/kit';
import { clearAuthToken } from '$lib/services/auth.service.js';

export async function POST({ cookies }) {
  clearAuthToken({ cookies });
  console.log('on retire le token de l\'utilisateur et on le redirige vers la page de login')
  return json({ success: true });
}
