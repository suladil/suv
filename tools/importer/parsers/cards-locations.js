/* eslint-disable */
/* global WebImporter */
/**
 * Parser: cards-locations
 * Source: .pp-location-list (West Loop location cards + VO Vets address/hours/phone +
 * Heart of Chelsea region label).
 * Output: Cards (locations), 2 columns - cell 1: photo, cell 2: region, name, address,
 * hours, phone, Book CTA.
 */
export default function parse(element, { document }) {
  const cells = [...element.querySelectorAll('.pp-location')].map((card) => {
    const img = card.querySelector('img');
    const body = document.createElement('div');
    const bodySrc = card.querySelector('.pp-location-body') || card;
    [...bodySrc.children].forEach((child) => {
      if (child !== img && !child.contains(img)) body.append(child);
    });
    return [img || '', body];
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards (locations)', cells });
  element.replaceWith(block);
}
