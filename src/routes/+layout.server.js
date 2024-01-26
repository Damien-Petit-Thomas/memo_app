export const load = async ({ fetch }) => {
  const url = import.meta.env.VITE_BACK_CONTAINER_NAME;
  try {
    const [
      cateoriesResponse,
      todosResponse,
      tagResponse,
      memoResponse,
      allMemmo,
      lexicons,
      linksResponse,
      styleResponse,
    ] = await Promise.all([
      fetch(
        `http://${url}/api/category`,
      ),
      fetch(
        `http://${url}/api/todo`,
      ),
      fetch(
        `http://${url}/api/tag`,
      ),
      fetch(
        `http://${url}/api/memo`,
      ),
      fetch(
        `http://${url}/api/memo/all`,
      ),

      fetch(
        `http://${url}/api/lexicon`,
      ),
      fetch(
        `http://${url}/api/link`,
      ),
      fetch(
        `http://${url}/api/style`,
      ),
    ]);
    if (!cateoriesResponse.ok) {
      throw new Error(`HTTP error: ${cateoriesResponse.status}`);
    }
    if (!todosResponse.ok) {
      throw new Error(`HTTP error: ${todosResponse.status}`);
    }
    if (!tagResponse.ok) {
      throw new Error(`HHTP error ${tagResponse.status}`);
    }
    if (!memoResponse.ok) {
      throw new Error(`HHTP error ${tagResponse.status}`);
    }
    if (!allMemmo.ok) {
      throw new Error(`HHTP error ${tagResponse.status}`);
    }
    if (!lexicons.ok) {
      throw new Error(`HHTP error ${tagResponse.status}`);
    }
    if (!linksResponse.ok) {
      throw new Error(`HHTP error ${tagResponse.status}`);
    }
    if (!styleResponse.ok) {
      throw new Error(`HHTP error ${tagResponse.status}`);
    }
    const tags = await tagResponse.json();
    const memos = await memoResponse.json();
    const categories = await cateoriesResponse.json();
    const todos = await todosResponse.json();
    const fullmemos = await allMemmo.json();
    const lexicon = await lexicons.json();
    const links = await linksResponse.json();
    const styles = await styleResponse.json();
    return {
      tags, categories, todos, memos, fullmemos, lexicon, links, styles,
    };
  } catch (error) {
    return { error: 'Unable to fetch currencies' };
  }
};
