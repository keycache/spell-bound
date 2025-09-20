/**
 * Client-side HTML component injector (Phase 10)
 * Usage: Add <div data-include="/components/header.html"></div>
 * and <div data-include="/components/footer.html"></div> to pages.
 */
async function loadComponent(el) {
  const url = el.getAttribute('data-include');
  if (!url) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed ' + url);
    const html = await res.text();
    el.innerHTML = html;
  } catch (e) {
    console.warn('Component load failed:', url, e);
  }
}

async function initIncludes() {
  const nodes = document.querySelectorAll('[data-include]');
  await Promise.all(Array.from(nodes).map(loadComponent));
  highlightActiveNav();
}

function highlightActiveNav() {
  const path = window.location.pathname.split('/').pop();
  const page = path.replace('.html','');
  document.querySelectorAll('nav a[data-active]').forEach(a => {
    if (a.dataset.active === page) {
      a.classList.add('font-semibold','underline');
    } else {
      a.classList.remove('font-semibold','underline');
    }
  });
}

document.addEventListener('DOMContentLoaded', initIncludes);
