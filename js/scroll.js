/* ============================================================
   Scroll interactions
   - nav solid state
   - reveal on scroll (IntersectionObserver)
   - pinned section progress driving workflow stage + active step
   - counter animations
   ============================================================ */

(function(){

  // --- Nav solid ---
  const nav = document.getElementById('nav');
  const onScrollNav = () => {
    if (window.scrollY > 24) nav.classList.add('solid');
    else nav.classList.remove('solid');
  };
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  // --- Reveal on scroll ---
  const revealIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        e.target.classList.add('in');
        revealIo.unobserve(e.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealIo.observe(el));

  // --- Counters ---
  const counterIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.counter);
      const dec = parseInt(el.dataset.decimals || '0', 10);
      const dur = 1400;
      const start = performance.now();
      const unitHtml = el.querySelector('.u') ? el.querySelector('.u').outerHTML : '';
      const step = (t) => {
        const p = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = (target * eased).toFixed(dec);
        el.innerHTML = Number(v).toLocaleString('ko-KR', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + unitHtml;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterIo.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-counter]').forEach(el => counterIo.observe(el));

  // --- Pinned section progress → workflow stage + step highlight ---
  const pinned = document.querySelector('#personalize');
  const stepsEls = document.querySelectorAll('#stepRail .step');
  if (pinned && stepsEls.length){
    const update = () => {
      const rect = pinned.getBoundingClientRect();
      const total = pinned.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / total));
      // map progress to stage index 0..3 with small hold zones
      const n = stepsEls.length;
      let idx = Math.min(n - 1, Math.floor(progress * n));
      // snap a bit at the end so final stage holds
      if (progress > 0.96) idx = n - 1;

      stepsEls.forEach((el, i) => el.classList.toggle('active', i === idx));
      if (window.__setWorkflowStage) window.__setWorkflowStage(idx);
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // --- Smooth anchor scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length < 2) return;
      const t = document.querySelector(href);
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 24, behavior: 'smooth' });
    });
  });

})();
