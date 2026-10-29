/* eslint-disable */
/* global WebImporter */
/**
 * Parser: cards-testimonials
 * Source: .pp-review-list (West Loop rating summary + Heart of Chelsea quote style).
 * Output: Cards (testimonials), one row per review, 2 columns matching the card model:
 *   cell 1 (image) - empty, testimonials have no image
 *   cell 2 (text)  - star rating, quote, reviewer + location.
 */
export default function parse(element, { document }) {
  const cells = [...element.querySelectorAll('.pp-review')].map((review) => {
    const cell = document.createElement('div');
    [...review.children].forEach((child) => cell.append(child));
    return ['', cell];
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards (testimonials)', cells });
  element.replaceWith(block);
}
