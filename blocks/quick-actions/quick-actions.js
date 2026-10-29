import { decorateIcons } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Finds or builds the icon for a row: an existing icon span, or an icon name
 * typed into the first cell (e.g. "calendar" -> /icons/calendar.svg).
 * @param {Element} row the block row
 * @returns {Element|null} icon span
 */
function getIcon(row) {
  const existing = row.querySelector('.icon');
  if (existing) return existing;
  const [first] = row.children;
  if (!first || row.children.length < 2 || first.querySelector('a')) return null;
  const name = first.textContent.trim().replace(/^:|:$/g, '').toLowerCase();
  if (!/^[a-z][a-z0-9-]*$/.test(name)) return null;
  const span = document.createElement('span');
  span.className = `icon icon-${name}`;
  return span;
}

/**
 * Quick actions bar: each row is one action (icon name | link + optional short text).
 * The whole tile is clickable through the action's link.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    const link = row.querySelector('a');
    const icon = getIcon(row);
    // with an icon-name cell, text comes only from the other cell(s)
    const iconCell = !icon || icon.isConnected ? null : row.firstElementChild;
    const texts = [...row.querySelectorAll('p')]
      .filter((p) => !iconCell?.contains(p))
      .filter((p) => !p.contains(link) && !p.querySelector('.icon') && p.textContent.trim());

    const tile = document.createElement(link ? 'a' : 'div');
    tile.className = 'quick-actions-tile';
    if (link) {
      tile.href = link.href;
      if (link.target) tile.target = link.target;
    }
    if (icon) {
      const iconWrap = document.createElement('span');
      iconWrap.className = 'quick-actions-icon';
      iconWrap.append(icon);
      tile.append(iconWrap);
    }
    const label = document.createElement('span');
    label.className = 'quick-actions-label';
    label.textContent = link ? link.textContent : row.textContent.trim();
    tile.append(label);
    texts.forEach((p) => {
      const desc = document.createElement('span');
      desc.className = 'quick-actions-text';
      desc.textContent = p.textContent.trim();
      tile.append(desc);
    });
    li.append(tile);
    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
  decorateIcons(block);
}
