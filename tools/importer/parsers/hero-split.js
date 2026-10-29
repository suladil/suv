/* eslint-disable */
/* global WebImporter */
/**
 * Parser: hero-split
 * Source: section.pp-hero (West Loop hero position, VO Vets split layout, Heart of Chelsea
 * two-weight headline).
 * Output: Hero, 1 column - row 1: image, row 2: eyebrow, H1, text, CTAs, location chooser.
 */
export default function parse(element, { document }) {
  const img = element.querySelector('.pp-hero-media img, img');
  const contentSrc = element.querySelector('.pp-hero-content') || element;

  const content = document.createElement('div');
  [...contentSrc.children].forEach((child) => {
    if (child.contains(img)) return;
    content.append(child);
  });

  const cells = [];
  if (img) cells.push([img]);
  cells.push([content]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero', cells });
  element.replaceWith(block);
}
