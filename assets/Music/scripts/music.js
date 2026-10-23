import { parseMusicData, createMusicPages } from './music-data.mjs';

const dataUrl = new URL('../datas/MusicData.json', import.meta.url);
const container = document.querySelector('#music-pages');
const status = document.querySelector('#load-status');
const retry = document.querySelector('#retry');

function createCard(item) {
  const card = document.createElement('a');
  card.className = 'music-card';
  card.href = item.url;
  const artwork = document.createElement('div');
  artwork.className = 'artwork';
  const fallback = document.createElement('span');
  fallback.className = 'artwork-fallback';
  fallback.textContent = '♫';
  fallback.setAttribute('aria-hidden', 'true');
  artwork.append(fallback);
  if (item.icon) {
    const image = document.createElement('img');
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.addEventListener('error', () => { image.hidden = true; });
    image.src = item.icon;
    artwork.append(image);
  }
  const caption = document.createElement('div');
  caption.className = 'card-caption';
  const name = document.createElement('h3');
  name.textContent = item.name;
  const arrow = document.createElement('span');
  arrow.className = 'card-arrow';
  arrow.textContent = '↗';
  arrow.setAttribute('aria-hidden', 'true');
  caption.append(name, arrow);
  card.append(artwork, caption);
  return card;
}

async function loadMusic() {
  retry.hidden = true;
  status.hidden = false;
  status.textContent = '正在加载音乐…';
  container.replaceChildren();
  try {
    const response = await fetch(dataUrl);
    if (!response.ok) throw new Error(`Music data: ${response.status}`);
    const items = parseMusicData(await response.json(), dataUrl);
    const pages = createMusicPages(items);
    if (!pages.length) {
      status.textContent = '还没有音乐，稍后再来看看吧。';
      return;
    }
    const fragment = document.createDocumentFragment();
    pages.forEach((page, index) => {
      const section = document.createElement('section');
      section.className = 'grid-page';
      section.id = `page-${index + 1}`;
      section.setAttribute('aria-labelledby', `heading-${index + 1}`);
      const heading = document.createElement('div');
      heading.className = 'page-heading';
      const title = document.createElement('h2');
      title.id = `heading-${index + 1}`;
      title.textContent = pages.length === 1 ? '音乐精选' : `音乐精选 · ${String(index + 1).padStart(2, '0')}`;
      const count = document.createElement('span');
      count.textContent = `${index + 1} / ${pages.length}`;
      heading.append(title, count);
      const grid = document.createElement('div');
      grid.className = 'music-grid';
      grid.append(...page.items.map(createCard));
      section.append(heading, grid);
      if (index < pages.length - 1) {
        const next = document.createElement('a');
        next.className = 'next-page';
        next.href = `#page-${index + 2}`;
        next.textContent = '向下发现更多 ↓';
        section.append(next);
      }
      fragment.append(section);
    });
    container.append(fragment);
    status.hidden = true;
  } catch {
    status.textContent = '音乐列表加载失败，请稍后重试。';
    retry.hidden = false;
  }
}

retry.addEventListener('click', loadMusic);
loadMusic();
