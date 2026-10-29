/* eslint-disable */
/* global WebImporter */
/**
 * Parser: columns-features
 * Source: .pp-features (differentiators summarised from all four sites).
 * Output: Columns (features), 1 row - one column per feature: :icon:, H3, text.
 */
export default function parse(element, { document }) {
  const row = [...element.querySelectorAll('.pp-feature')].map((feature) => {
    const cell = document.createElement('div');
    const iconMatch = feature.textContent.match(/:([a-z0-9-]+):/);
    if (iconMatch) {
      const p = document.createElement('p');
      p.textContent = `:${iconMatch[1]}:`;
      cell.append(p);
    }
    feature.querySelectorAll('h3, p').forEach((el) => cell.append(el));
    return cell;
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns (features)', cells: [row] });
  element.replaceWith(block);
}
