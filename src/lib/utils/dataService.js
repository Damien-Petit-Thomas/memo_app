export const memoData = async (id) => {
  try {
    const url = import.meta.env.VITE_BACK_CONTAINER_NAME;
    const response = await fetch(`http://${url}/api/memo/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: 'Unable to fetch currencies' };
  }
};
