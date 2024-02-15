/* eslint-disable no-restricted-syntax */
import userCreateSchema from '$lib/validation/createUserSchema';
import userLoginSchema from '$lib/validation/userLoginSchema';

const map = {
  '/api/user/auth/create': userCreateSchema,
  '/api/user/auth/getOne': userLoginSchema,
};
export async function validator({ event, resolve }) {
  for (const url of Object.keys(map)) {
    if (event.url.pathname.indexOf(url) > -1) {
      const { method } = event.request;
      // we need to clone, otherwise SvelteKit will respond with 'disturbed' error
      const req = event.request.clone();

      // eslint-disable-next-line no-await-in-loop
      const params = await req.json();
      if (map[url][method]) {
        const { error } = map[url][method].validate(params.data);
        if (error) {
          let msg = '';
          if (error.details.length && error.details[0].message) {
            msg = error.details[0].message;
          } else {
            msg = 'unknown validation error';
          }
          return new Response(`Validation: ${msg}`, { status: 400 });
        }
      }
    }
  }
  return resolve(event);
}
