/* eslint-disable */
/* global WebImporter */
/**
 * Transformer: consolidated-nav-footer
 * Runs only for the consolidated-nav and consolidated-footer templates.
 *
 * consolidated-nav: rebuilds the page body as the EDS nav document:
 *   section 1 brand (:logo: + name), section 2 menu (nested lists),
 *   section 3 tools (Find a Location + Book Appointment buttons),
 *   section 4 utility bar (VO Vets promo + World of Animals utility links and phone).
 * consolidated-footer: keeps only footer.site-footer (its columns are parsed by columns-footer)
 * and moves the bottom bar (copyright, legal, social) into a second section.
 */
function textP(document, html) {
  const p = document.createElement('p');
  p.innerHTML = html;
  return p;
}

function wrapButton(document, a, tag) {
  const p = document.createElement('p');
  const w = document.createElement(tag);
  w.append(a);
  p.append(w);
  return p;
}

function buildNav(element, document) {
  const header = element.querySelector('header.site-header');
  if (!header) return;
  const out = [];

  // 1. brand
  const brandLink = header.querySelector('.brand a');
  const brand = document.createElement('p');
  const a = document.createElement('a');
  a.href = brandLink ? brandLink.getAttribute('href') : '/';
  a.textContent = `:logo: ${brandLink ? brandLink.textContent.trim() : ''}`;
  brand.append(a);
  out.push([brand]);

  // 2. menu
  const menu = header.querySelector('nav.main-nav > ul');
  out.push(menu ? [menu] : []);

  // 3. tools
  const tools = [];
  const secondary = header.querySelector('.header-ctas .cta-secondary');
  const primary = header.querySelector('.header-ctas .cta-primary');
  if (secondary) tools.push(wrapButton(document, secondary, 'em'));
  if (primary) tools.push(wrapButton(document, primary, 'strong'));
  out.push(tools);

  // 4. utility bar
  const utility = [];
  const promo = header.querySelector('.promo-bar p');
  if (promo) utility.push(promo);
  const links = header.querySelector('.utility-bar ul');
  if (links) {
    links.querySelectorAll('a[href^="tel:"]').forEach((tel) => {
      tel.textContent = `:phone: ${tel.textContent.trim()}`;
    });
    utility.push(links);
  }
  out.push(utility);

  element.innerHTML = '';
  out.forEach((nodes, i) => {
    if (i) element.append(document.createElement('hr'));
    nodes.forEach((n) => element.append(n));
  });
}

function buildFooter(element, document) {
  const footer = element.querySelector('footer.site-footer');
  if (!footer) return;
  // footer columns stay inside footer.site-footer for the columns-footer parser
  const bottom = footer.querySelector('.footer-bottom');
  element.innerHTML = '';
  element.append(footer);
  if (bottom) {
    element.append(document.createElement('hr'));
    [...bottom.children].forEach((child) => element.append(child));
  }
}

export default function transform(hookName, element, payload) {
  const templateName = payload && payload.template && payload.template.name;
  if (templateName !== 'consolidated-nav' && templateName !== 'consolidated-footer') return;
  if (hookName !== 'beforeTransform') return;
  const { document } = payload;
  element.querySelectorAll('script, style, noscript, link').forEach((el) => el.remove());
  if (templateName === 'consolidated-nav') buildNav(element, document);
  else buildFooter(element, document);
}
