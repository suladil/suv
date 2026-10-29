/* eslint-disable */
/* global WebImporter */
/**
 * Parser: cards-icon
 * Source: .pp-service-list (West Loop featured services + World of Animals service tiles).
 * Output: Cards (services), 2 columns - cell 1: :icon: shortcode, cell 2: title, text, link.
 */
export default function parse(element, { document }) {
  const cells = [...element.querySelectorAll('.pp-service')].map((card) => {
    const bodySrc = card.querySelector('.pp-service-body');
    const iconMatch = card.textContent.match(/:([a-z0-9-]+):/);

    const iconCell = document.createElement('p');
    iconCell.textContent = iconMatch ? `:${iconMatch[1]}:` : '';

    const body = document.createElement('div');
    if (bodySrc) [...bodySrc.children].forEach((child) => body.append(child));
    return [iconCell, body];
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards (services)', cells });
  element.replaceWith(block);
}
