(() => {
  const spreads = [...document.querySelectorAll('#store .spread')];
  const L = document.getElementById('L'), R = document.getElementById('R');
  const book = document.getElementById('book'), tabsEl = document.getElementById('tabs');
  const ids = spreads.map(s => s.id);
  const html = (i, side) => spreads[i].querySelector('.' + side).innerHTML;
  const noFlip = () => matchMedia('(max-width:860px)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches;
  let cur = -1, busy = false;

  spreads.forEach((s, i) => {
    const b = document.createElement('button');
    b.className = 'tab'; b.type = 'button'; b.textContent = s.dataset.tab;
    b.style.setProperty('--c', s.dataset.color);
    b.addEventListener('click', () => go(i));
    tabsEl.appendChild(b);
  });

  function mark(i) {
    [...tabsEl.children].forEach((t, k) => k === i ? t.setAttribute('aria-current', 'true') : t.removeAttribute('aria-current'));
    document.title = (i ? spreads[i].dataset.tab + ' | ' : '') + 'Aleksandra Demenkova | Portfolio';
    history.replaceState(null, '', '#' + ids[i]);
  }
  function show(i) {
    L.innerHTML = html(i, 'left'); R.innerHTML = html(i, 'right');
    L.scrollTop = R.scrollTop = 0; cur = i; mark(i);
  }
  function face(cls, content) {
    const f = document.createElement('div');
    f.className = 'face page ' + cls; f.innerHTML = content; return f;
  }
  function go(i) {
    if (busy || i === cur || i < 0 || i >= spreads.length) return;
    if (cur < 0 || noFlip()) {
      show(i);
      if (!matchMedia('(prefers-reduced-motion:reduce)').matches) { book.classList.remove('fade'); void book.offsetWidth; book.classList.add('fade'); }
      return;
    }
    busy = true;
    const fwd = i > cur, oldL = L.innerHTML, oldR = R.innerHTML, newL = html(i, 'left'), newR = html(i, 'right');
    const fl = document.createElement('div');
    fl.className = 'flipper ' + (fwd ? 'fwd' : 'back');
    if (fwd) { R.innerHTML = newR; fl.append(face('a right', oldR), face('b left', newL)); }
    else { L.innerHTML = newL; fl.append(face('a left', oldL), face('b right', newR)); }
    book.appendChild(fl);
    void fl.offsetWidth; fl.classList.add('go');
    cur = i; mark(i);
    let done = false;
    const end = () => {
      if (done) return; done = true;
      if (fwd) L.innerHTML = newL; else R.innerHTML = newR;
      L.scrollTop = R.scrollTop = 0; fl.remove(); busy = false;
    };
    fl.addEventListener('transitionend', end);
    setTimeout(end, 1100);
  }

  book.addEventListener('click', e => {
    const t = e.target.closest('[data-go]');
    if (t) go(ids.indexOf(t.dataset.go));
  });
  document.addEventListener('keydown', e => {
    if (e.target.closest('input,textarea')) return;
    if (e.key === 'ArrowRight') go(cur + 1);
    if (e.key === 'ArrowLeft') go(cur - 1);
  });
  window.addEventListener('hashchange', () => { const k = ids.indexOf(location.hash.slice(1)); if (k >= 0) go(k); });

  const start = ids.indexOf(location.hash.slice(1));
  show(start >= 0 ? start : 0);
})();
