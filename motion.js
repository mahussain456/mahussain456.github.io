// Scroll and pointer motion for the page itself (the 3D globe lives in globe.js):
// project screens that open like laptop lids, heading reveals, the tilting portrait card,
// and the nav's section highlight and progress line.
(() => {
  'use strict';
  const root = document.documentElement;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

  // Nav: mark the section in view. This is state, not decoration, so it stays on with reduced motion.
  const links = new Map([...document.querySelectorAll('.bar nav a')].map(a => [a.getAttribute('href').slice(1), a]));
  if (hasIO && links.size) {
    const seen = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach((a, id) => id === e.target.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
    }), { rootMargin: '-45% 0px -50% 0px' });
    const hero = document.querySelector('.hero');
    if (hero) seen.observe(hero);   // back at the top: nothing is current
    links.forEach((a, id) => { const s = document.getElementById(id); if (s) seen.observe(s); });
  }

  if (calm) return;
  root.classList.add('motion');

  // Headings arrive word by word the first time they scroll into view.
  if (hasIO) {
    const split = h => {
      h.setAttribute('aria-label', h.textContent.trim());
      let i = 0;
      const walk = node => [...node.childNodes].forEach(c => {
        if (c.nodeType === 1) return walk(c);
        if (c.nodeType !== 3) return;
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.append(' ');
          const w = document.createElement('span');
          w.className = 'w'; w.textContent = part; w.style.setProperty('--i', i++); w.setAttribute('aria-hidden', 'true');
          frag.append(w);
        });
        c.replaceWith(frag);
      });
      walk(h);
    };
    const reveal = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); }
    }), { threshold: .35 });
    document.querySelectorAll('.sh, .contact > div').forEach(box => {
      const h = box.querySelector('h2');
      if (!h) return;
      split(h); box.classList.add('rv'); reveal.observe(box);
    });
  }

  // Project screens open like laptop lids as they scroll in, and the nav line tracks page progress.
  // offsetTop ignores transforms, so the lid's own tilt never feeds back into the measurement.
  const pageTop = el => { let y = 0; for (let n = el; n; n = n.offsetParent) y += n.offsetTop; return y; };
  const lids = [...document.querySelectorAll('.shot')].map(el => ({ el, cur: -1 }));
  const bar = document.querySelector('.bar');
  if (bar) bar.insertAdjacentHTML('beforeend', '<i class="prog" aria-hidden="true"></i>');
  let queued = false;
  const update = () => {
    queued = false;
    const vh = innerHeight, y = scrollY;
    let moving = false;
    for (const lid of lids) {
      const raw = Math.min(1, Math.max(0, (vh * .98 - (pageTop(lid.el) - y)) / (vh * .62)));
      const want = 1 - Math.pow(1 - raw, 3);
      lid.cur = lid.cur < 0 ? want : lid.cur + (want - lid.cur) * .2;
      if (Math.abs(want - lid.cur) < .002) lid.cur = want; else moving = true;
      lid.el.style.setProperty('--p', lid.cur.toFixed(4));
    }
    if (bar) bar.style.setProperty('--sp', Math.min(1, y / Math.max(1, root.scrollHeight - vh)).toFixed(4));
    if (moving) request();
  };
  const request = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  addEventListener('load', request);
  request();

  // Portrait card leans toward the pointer; the photo and name plate shift at different depths.
  const card = document.querySelector('.portrait');
  if (card && matchMedia('(pointer:fine)').matches) {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      card.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
      card.style.setProperty('--rx', (-y * 8).toFixed(2) + 'deg');
      card.style.setProperty('--px', (x * -14).toFixed(1) + 'px');
      card.style.setProperty('--py', (y * -10).toFixed(1) + 'px');
    });
    card.addEventListener('pointerleave', () => ['--rx', '--ry', '--px', '--py'].forEach(v => card.style.removeProperty(v)));
  }
})();
