/* eslint-disable */
/* global WebImporter */

import heroSplitParser from './parsers/hero-split.js';
import quickActionsParser from './parsers/quick-actions.js';
import cardsLocationsParser from './parsers/cards-locations.js';
import cardsIconParser from './parsers/cards-icon.js';
import columnsStatsParser from './parsers/columns-stats.js';
import columnsFeaturesParser from './parsers/columns-features.js';
import cardsStepsParser from './parsers/cards-steps.js';
import columnsMediaParser from './parsers/columns-media.js';
import cardsTestimonialsParser from './parsers/cards-testimonials.js';
import cleanupTransformer from './transformers/consolidated-cleanup.js';
import sectionsTransformer from './transformers/consolidated-sections.js';
import navFooterTransformer from './transformers/consolidated-nav-footer.js';

const PAGE_TEMPLATE = {
  name: 'consolidated-homepage',
  description: 'Neutral-brand multi-location veterinary homepage consolidating westloopvet.com (structural base), wofainc.com, heartofchelsea.com and vovets.com. Source: migration-work/consolidation/source/index.html, served locally on port 4600 for import.',
  urls: [
    'http://localhost:4600/index.html',
  ],
  blocks: [
    { name: 'hero-split', instances: ['section.pp-hero'] },
    { name: 'quick-actions', instances: ['section.pp-quick-actions > ul'] },
    { name: 'cards-locations', instances: ['.pp-location-list'] },
    { name: 'cards-icon', instances: ['.pp-service-list'] },
    { name: 'columns-stats', instances: ['.pp-stats'] },
    { name: 'columns-features', instances: ['.pp-features'] },
    { name: 'cards-steps', instances: ['ol.pp-steps'] },
    { name: 'columns-media', instances: ['section.pp-media'] },
    { name: 'cards-testimonials', instances: ['.pp-review-list'] },
  ],
  sections: [
    { id: 'hero', name: 'Hero', selector: ['section.pp-hero'], style: null, blocks: ['hero-split'], defaultContent: [] },
    { id: 'quick-actions', name: 'Quick actions', selector: ['section.pp-quick-actions'], style: null, blocks: ['quick-actions'], defaultContent: [] },
    { id: 'locations', name: 'Locations', selector: ['section.pp-locations'], style: 'centered', blocks: ['cards-locations'], defaultContent: ['.pp-locations > .pp-eyebrow', '.pp-locations > h2', '.pp-locations > p'] },
    { id: 'services', name: 'Services', selector: ['section.pp-services'], style: 'light, centered', blocks: ['cards-icon'], defaultContent: ['.pp-services > .pp-eyebrow', '.pp-services > h2', '.pp-services > p'] },
    { id: 'why', name: 'Why choose us', selector: ['section.pp-why'], style: 'centered', blocks: ['columns-stats', 'columns-features'], defaultContent: ['.pp-why > .pp-eyebrow', '.pp-why > h2'] },
    { id: 'new-clients', name: 'New-client journey', selector: ['section.pp-new-clients'], style: 'dark, centered', blocks: ['cards-steps'], defaultContent: ['.pp-new-clients > .pp-eyebrow', '.pp-new-clients > h2', '.pp-new-clients > p'] },
    { id: 'team', name: 'Team', selector: ['section.pp-team'], style: null, blocks: ['columns-media'], defaultContent: [] },
    { id: 'reviews', name: 'Reviews', selector: ['section.pp-reviews'], style: 'light, centered', blocks: ['cards-testimonials'], defaultContent: ['.pp-reviews > .pp-eyebrow', '.pp-reviews > h2', '.pp-reviews > p'] },
    { id: 'pharmacy', name: 'Pharmacy', selector: ['section.pp-pharmacy'], style: null, blocks: ['columns-media'], defaultContent: [] },
    { id: 'closing', name: 'Closing CTA', selector: ['section.pp-closing'], style: 'dark, centered', blocks: [], defaultContent: ['.pp-closing > .pp-eyebrow', '.pp-closing > h2', '.pp-closing > p'] },
  ],
};

const parsers = {
  'hero-split': heroSplitParser,
  'quick-actions': quickActionsParser,
  'cards-locations': cardsLocationsParser,
  'cards-icon': cardsIconParser,
  'columns-stats': columnsStatsParser,
  'columns-features': columnsFeaturesParser,
  'cards-steps': cardsStepsParser,
  'columns-media': columnsMediaParser,
  'cards-testimonials': cardsTestimonialsParser,
};

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

    main.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }];
  },
};
