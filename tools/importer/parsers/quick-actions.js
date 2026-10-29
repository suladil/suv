/* eslint-disable */
/* global WebImporter */
/**
 * Parser: quick-actions
 * Source: section.pp-quick-actions > ul (West Loop hero CTA bar, expanded to 4 actions).
 * Output: Quick Actions, one row per action, 2 columns matching the quick-action model:
 *   cell 1 (icon) - icon name, e.g. "calendar" (resolves to /icons/calendar.svg)
 *   cell 2 (text) - link + short text.
 */
export default function parse(element, { document }) {
  const cells = [...element.querySelectorAll(':scope > li')].map((li) => {
    const link = li.querySelector('a');
    const text = li.querySelector('.pp-action-text');
    // icon shortcode is the leading text, e.g. ":calendar:"
    const iconMatch = li.textContent.match(/:([a-z0-9-]+):/);

    const iconCell = document.createElement('div');
    if (iconMatch) iconCell.textContent = iconMatch[1];

    const textCell = document.createElement('div');
    if (link) {
      const p = document.createElement('p');
      p.append(link);
      textCell.append(p);
    }
    if (text) {
      const p = document.createElement('p');
      p.textContent = text.textContent.trim();
      textCell.append(p);
    }
    return [iconCell, textCell];
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Quick Actions', cells });
  element.replaceWith(block);
}
