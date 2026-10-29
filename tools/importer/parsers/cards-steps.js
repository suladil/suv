/* eslint-disable */
/* global WebImporter */
/**
 * Parser: cards-steps
 * Source: ol.pp-steps (World of Animals first-time clients journey).
 * Output: Cards (steps), one row per step, 2 columns matching the card model:
 *   cell 1 (image) - empty, steps have no image
 *   cell 2 (text)  - H3 + description.
 * Step numbers come from CSS counters.
 */
export default function parse(element, { document }) {
  const cells = [...element.querySelectorAll(':scope > li')].map((li) => {
    const cell = document.createElement('div');
    [...li.children].forEach((child) => cell.append(child));
    return ['', cell];
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards (steps)', cells });
  element.replaceWith(block);
}
