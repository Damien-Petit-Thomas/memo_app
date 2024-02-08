/* eslint-disable no-restricted-syntax */
/** @type {import('@sveltejs/kit').Handle} */
import registerShema from '$lib/validation/validationShema.js';

const map = {
  '/api/auth': registerShema,
};
export async function handle({ event, resolve }) {
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
