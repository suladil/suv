/* eslint-disable */
/* global WebImporter */
/**
 * Parser: columns-stats
 * Source: .pp-stats (Heart of Chelsea number counters).
 * Output: Columns (stats), 1 row - one column per stat: H3 value + label paragraph.
 */
export default function parse(element, { document }) {
  const row = [...element.querySelectorAll('.pp-stat')].map((stat) => {
    const cell = document.createElement('div');
    const value = stat.querySelector('.pp-stat-value');
    const label = stat.querySelector('.pp-stat-label');
    if (value) {
      const h3 = document.createElement('h3');
      h3.textContent = value.textContent.trim();
      cell.append(h3);
    }
    if (label) {
      const p = document.createElement('p');
      p.textContent = label.textContent.trim();
      cell.append(p);
    }
    return cell;
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns (stats)', cells: [row] });
  element.replaceWith(block);
}
