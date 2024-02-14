import { sequence } from '@sveltejs/kit/hooks';
import { authenticateToken } from '$lib/server/sequences/auth';
import { validator } from '$lib/server/sequences/validation';



export const handle = sequence(authenticateToken, validator);
