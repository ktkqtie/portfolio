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
