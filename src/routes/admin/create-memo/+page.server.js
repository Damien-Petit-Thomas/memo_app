export const load = async ({ fetch }) => {
  try {
    const url = import.meta.env.VITE_BACK_CONTAINER_NAME;
    const content = await fetch(`http://${url}/api/contentType`);
    const contents = await content.json();
    return { contents };
  } catch (error) {
    return { error: 'Unable to fetch currencies' };
  }
};
