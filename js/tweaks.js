/* Tweak panel: scroll intensity */
(function(){
  const panel = document.getElementById('tweakPanel');
  const defaults = (typeof TWEAK_DEFAULTS !== 'undefined') ? TWEAK_DEFAULTS : { scrollIntensity: 'maximal' };
  let state = { ...defaults };

  function applyScrollIntensity(v){
    const pinned = document.querySelector('.pinned-scroll');
    if (!pinned) return;
    // map: subtle 180vh, moderate 260vh, maximal 340vh
    const map = { subtle: '180vh', moderate: '260vh', maximal: '340vh' };
    pinned.style.height = map[v] || '340vh';
    document.documentElement.dataset.scroll = v;
    // toggle reveal aggressiveness via CSS var
    document.documentElement.style.setProperty('--reveal-scale', v === 'subtle' ? '0.4' : v === 'moderate' ? '0.7' : '1');
  }

  function applyAll(){
    applyScrollIntensity(state.scrollIntensity);
    // mark active buttons
    panel.querySelectorAll('#scrollOptions button').forEach(b => {
      b.classList.toggle('on', b.dataset.v === state.scrollIntensity);
    });
  }
  applyAll();

  // Wire option buttons
  panel.querySelectorAll('#scrollOptions button').forEach(b => {
    b.addEventListener('click', () => {
      state.scrollIntensity = b.dataset.v;
      applyAll();
      try {
        window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { scrollIntensity: state.scrollIntensity } }, '*');
      } catch(_) {}
    });
  });

  // Listen for host activate/deactivate
  window.addEventListener('message', (e) => {
    const d = e.data || {};
    if (d.type === '__activate_edit_mode'){
      panel.classList.add('on');
      panel.setAttribute('aria-hidden', 'false');
    }
    if (d.type === '__deactivate_edit_mode'){
      panel.classList.remove('on');
      panel.setAttribute('aria-hidden', 'true');
    }
  });

  // Announce availability AFTER listener is live
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch(_){}
})();
