export default function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    if (row.querySelector('picture') && !row.querySelector('h1, h2, p:not(:has(picture))')) {
      row.classList.add('hero-media');
    } else {
      row.classList.add('hero-content');
    }
  });

  const content = block.querySelector('.hero-content');
  if (!content) return;
  block.classList.toggle('hero-split', !!block.querySelector('.hero-media'));

  // a paragraph with several plain links becomes the location chooser (chips)
  content.querySelectorAll('p').forEach((p) => {
    const links = p.querySelectorAll(':scope > a');
    if (links.length >= 2) {
      p.classList.add('hero-locations');
      links.forEach((a) => a.classList.remove('button'));
    }
  });
}
