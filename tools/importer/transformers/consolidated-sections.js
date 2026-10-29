/* eslint-disable */
/* global WebImporter */
/**
 * Transformer: consolidated-sections
 * Uses payload.template.sections to add section breaks (<hr>) and Section Metadata blocks.
 * Both are inserted as siblings of the section element in beforeTransform, so they survive
 * parsers that replace a whole section element (hero, columns-media).
 */
export default function transform(hookName, element, payload) {
  if (hookName !== 'beforeTransform') return;
  const { document } = payload;
  const sections = (payload.template && payload.template.sections) || [];

  const found = sections
    .map((section) => {
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let el = null;
      selectors.some((sel) => {
        el = element.querySelector(sel);
        return !!el;
      });
      return el ? { section, el } : null;
    })
    .filter(Boolean);

  found.forEach(({ section, el }, i) => {
    if (section.style) {
      const meta = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      el.after(meta);
    }
    if (i > 0) el.before(document.createElement('hr'));
  });
}
