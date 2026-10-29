/* eslint-disable */
/* global WebImporter */
/**
 * Parser: columns-media
 * Source: section.pp-media - team teaser (West Loop about + Heart of Chelsea team, photo left)
 * and pharmacy promo (World of Animals / Heart of Chelsea pharmacy, photo right).
 * Output: Columns (media), 1 row, 2 columns in source order (photo | copy or copy | photo).
 */
export default function parse(element, { document }) {
  const row = [...element.querySelectorAll(':scope > .pp-media-image, :scope > .pp-media-body')].map((col) => {
    const cell = document.createElement('div');
    if (col.classList.contains('pp-media-image')) {
      const img = col.querySelector('img');
      if (img) cell.append(img);
    } else {
      [...col.children].forEach((child) => cell.append(child));
    }
    return cell;
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns (media)', cells: [row] });
  element.replaceWith(block);
}
