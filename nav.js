// Little green dot that marks the current tab and glides between tabs.
// Each page marks its own tab with aria-current="page". When you move to another page,
// the dot starts on the tab you came from and glides over to the new one.
(() => {
  const links = [...document.querySelectorAll('.links a')];
  const dot = document.querySelector('.tab-dot');
  if (!dot || !links.length) return;

  const current = () => links.find(l => l.getAttribute('aria-current') === 'page') || links[0];

  function place(link, animate = true) {
    if (!animate) dot.style.transition = 'none';
    dot.style.transform = `translateX(${link.offsetLeft - 12}px)`;
    dot.style.opacity = 1;
    if (!animate) {
      dot.getBoundingClientRect();          // apply the jump before re-enabling the glide
      dot.style.transition = '';
    }
  }

  function setActive(link) {
    links.forEach(l => l.removeAttribute('aria-current'));
    link.setAttribute('aria-current', 'page');
    place(link);
  }

  links.forEach(link => link.addEventListener('click', e => {
    if (link.target === '_blank') return;                       // opens in a new tab (resume): keep the dot where it is
    const href = link.getAttribute('href');
    if (href === '#') e.preventDefault();                       // page not built yet
    else if (!href.startsWith('#')) {
      // Going to another page: remember the tab we're leaving so it can glide from there
      try { sessionStorage.setItem('navDotFrom', String(links.indexOf(current()))); } catch (err) {}
    }
    setActive(link);
  }));

  // Clicking the name/duck logo goes home, so glide from here too
  const brand = document.querySelector('.brand');
  if (brand) brand.addEventListener('click', () => {
    try { sessionStorage.setItem('navDotFrom', String(links.indexOf(current()))); } catch (err) {}
  });

  function start() {
    let from = -1;
    try {
      from = Number(sessionStorage.getItem('navDotFrom') ?? -1);
      sessionStorage.removeItem('navDotFrom');
    } catch (e) {}
    const target = current();
    if (from >= 0 && links[from] && links[from] !== target) {
      place(links[from], false);
      requestAnimationFrame(() => requestAnimationFrame(() => place(target)));
    } else {
      place(target, false);
    }
  }

  // Wait for the font so the tab widths are final before measuring
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(start);
  addEventListener('resize', () => place(current(), false));
})();

// Custom cursor: a small circle that follows the mouse and grows over anything clickable.
// Mouse and trackpad only; touch screens keep their normal behaviour.
(() => {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  ring.setAttribute('aria-hidden', 'true');
  document.body.appendChild(ring);
  document.documentElement.classList.add('has-cursor');

  const CLICKABLE = 'a, button, [role="button"], label, summary, select, input[type="range"], .zoomable, .chip';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let x = -100, y = -100, rx = x, ry = y, shown = false;

  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX; y = e.clientY;
    if (!shown) { rx = x; ry = y; shown = true; ring.classList.add('on'); }
    // Keep the ring above an open image viewer (dialogs sit on their own top layer)
    const host = e.target.closest && e.target.closest('dialog[open]') || document.body;
    if (ring.parentNode !== host) host.appendChild(ring);
    ring.classList.toggle('hover', !!(e.target.closest && e.target.closest(CLICKABLE)));
  }, { passive: true });
  addEventListener('pointerdown', () => ring.classList.add('down'));
  addEventListener('pointerup', () => ring.classList.remove('down'));
  document.addEventListener('mouseleave', () => { ring.classList.remove('on'); shown = false; });

  (function follow() {
    const k = reduce ? 1 : 0.35;                       // light easing so it trails the pointer just a touch
    rx += (x - rx) * k; ry += (y - ry) * k;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(follow);
  })();
})();
