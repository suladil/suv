/* eslint-disable */
/* global WebImporter */
/**
 * Parser: columns-footer
 * Source: footer.site-footer (VO Vets 4-column footer: brand, Visit Us with per-location
 * phone + hours, Services, Resources + 24/7 emergencies).
 * Output: Columns (footer-links), 1 row, 4 columns - one cell per footer column.
 * The bottom bar (.footer-bottom) is moved after the block, where the
 * consolidated-nav-footer transformer turns it into the second footer section.
 */
export default function parse(element, { document }) {
  const row = [...element.querySelectorAll(':scope > .footer-brand, :scope > .footer-col')].map((col) => {
    const cell = document.createElement('div');
    [...col.children].forEach((child) => cell.append(child));
    return cell;
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns (footer-links)', cells: [row] });
  const bottom = element.querySelector(':scope > .footer-bottom');
  if (bottom) element.after(bottom);
  element.replaceWith(block);
}
