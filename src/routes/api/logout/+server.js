import { json } from '@sveltejs/kit';
import { clearAuthToken } from '$lib/services/auth.service.js';

export async function POST({ cookies }) {
  clearAuthToken({ cookies });
  return json({ success: true });
}
