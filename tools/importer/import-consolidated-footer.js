/* eslint-disable */
/* global WebImporter */

import columnsFooterParser from './parsers/columns-footer.js';
import cleanupTransformer from './transformers/consolidated-cleanup.js';
import sectionsTransformer from './transformers/consolidated-sections.js';
import navFooterTransformer from './transformers/consolidated-nav-footer.js';

const PAGE_TEMPLATE = {
  name: 'consolidated-footer',
  description: 'Footer document (/footer) built from the consolidated source footer (VO Vets 4-column footer, World of Animals locations list, Heart of Chelsea quick links).',
  urls: [
    'http://localhost:4600/footer.html',
  ],
  blocks: [
    { name: 'columns-footer', instances: ['footer.site-footer'] },
  ],
  sections: [],
};

const parsers = { 'columns-footer': columnsFooterParser };

const transformers = [cleanupTransformer, sectionsTransformer, navFooterTransformer];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((fn) => {
    try { fn(hookName, element, enhancedPayload); }
    catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (!parser) return;
      try { parser(block.element, { document, url, params }); }
      catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
    });

    executeTransformers('afterTransform', main, payload);

    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: 'Footer', template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }];
  },
};
