<script>
  export let doc;
  export let title;
  let toc = [];

  function generateToc(content) {
    const lines = content.split("\n");
    const toc = [];
    const tocRegex = /^#{1,6} (.*)$/;
    lines.forEach((line) => {
      const match = line.match(tocRegex);
      if (match) {
        const link = `#${slugiFy(match[1])}`;
        const level = match[0].match(/#/g).length;
        toc.push({ title: match[1], level, link });
      }
    });

    return toc;
  }

  doc.forEach((content) => {
    toc.push(generateToc(content.content));
    toc = toc.flat();
  });

  function slugiFy(data) {
    return data
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
  }
  const slugTitle = slugiFy(title);

  function scrollToMiddle(id) {
    // on retire le   # de l'id
    id = id.substring(1);
    const element = document.getElementById(id);
    if (element) {
      const offset =
        element.offsetTop - window.innerHeight * 0.1 + element.offsetHeight / 2;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  }
</script>

<div class="wrapper">
  <nav>
    <a href="/admin/create-memo"><button>éditer</button></a>
    <a href={slugTitle}><h3>{title}</h3></a>
    <ul>
      {#each toc as { title, level, link }}
        <li class="level-{level}">
          <!-- <a href={link}>{title}</a> -->
          <a href={link} on:click|preventDefault={() => scrollToMiddle(link)}
            >{title}</a
          >
        </li>{/each}
    </ul>
  </nav>
</div>

<style>
  .wrapper {
    min-width: 15%;
    display: flex;
    flex-direction: column;
  }
  nav {
    color: #ddd;
    position: fixed;
    top: 10%;
    height: 100vh;
    overflow-y: auto;
    padding: 1rem;
  }
  .level-1 {
    font-size: 1.5rem;
  }

  .level-2 {
    font-size: 1rem;
  }

  .level-3 {
    font-size: 0.8rem;
  }

  .level-4 {
    margin-left: 0.6rem;
  }

  .level-5 {
    font-size: 0.4rem;
  }

  .level-6 {
    font-size: 0.2rem;
  }

  a {
    color: #ddd;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 400;
  }

  nav h3 {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }
  button {
    margin: 0 0 2rem 0;
    padding: 0.2rem 5rem;
  }

  button:hover {
    text-transform: uppercase;
    background-color: #6b3939;
    color: #ddd;
  }

  ul {
    list-style: none;
    padding-left: 1rem;
    border-left: 1px solid #ddd;
  }

  li {
    padding: 0.2rem;
    margin-bottom: 0.5rem;
  }

  li:hover {
    border-radius: 0.5rem 0 0 0.5rem;
    background-color: #6b3939;
  }
</style>
