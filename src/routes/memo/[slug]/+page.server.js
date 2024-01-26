
export const load = async ({ fetch }) => {
  const url = import.meta.env.VITE_BACK_CONTAINER_NAME;

  try {
    const response = await fetch(`http://${url}/api/memo`);
    const contents = await response.json();
    return { contents };
  } catch (error) {
    return { error: 'Unable to fetch currencies' };
  }
};
