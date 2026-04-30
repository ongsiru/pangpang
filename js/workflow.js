/* Workflow diagram — morphs across 4 scroll-driven stages */
(function(){
  const stage = document.getElementById('workflow');
  const nodesEl = document.getElementById('wfNodes');
  const svgEl = document.getElementById('wfSvg');
  const stageLabelEl = document.getElementById('wfStageLabel');
  if (!stage || !nodesEl || !svgEl) return;

  // Node states per stage. Coordinates in % of canvas.
  // stage 0: Simple linear sequence (A라인 3단계)
  // stage 1: Adds quality rule checkpoints
  // stage 2: Shifts + split by operator
  // stage 3: Multi-factory view
  const STAGES = [
    {
      label: '기본 작업 순서',
      nodes: [
        { id:'a1', x:10, y:45, label:'자재 투입', sub:'A-LINE · 01', active:true },
        { id:'a2', x:40, y:45, label:'프레스',   sub:'A-LINE · 02', active:true },
        { id:'a3', x:70, y:45, label:'출하 준비', sub:'A-LINE · 03', active:true },
      ],
      edges: [['a1','a2'],['a2','a3']],
      active: ['a1','a2','a3'],
    },
    {
      label: '품질 기준 추가',
      nodes: [
        { id:'a1', x:8,  y:45, label:'자재 투입', sub:'A · 01', active:true },
        { id:'a2', x:30, y:45, label:'프레스',   sub:'A · 02', active:true },
        { id:'q1', x:52, y:18, label:'두께 검사', sub:'≥ 3mm · 자동', card:true, active:true },
        { id:'q2', x:52, y:72, label:'색상 A-급', sub:'육안 · 작업자', card:true, active:true },
        { id:'a3', x:76, y:45, label:'출하 준비', sub:'A · 03', active:true },
      ],
      edges: [['a1','a2'],['a2','q1'],['a2','q2'],['q1','a3'],['q2','a3']],
      active: ['a1','a2','q1','q2','a3'],
    },
    {
      label: '교대·인원별 재구성',
      nodes: [
        { id:'s1', x:6,  y:15, label:'주간 교대', sub:'08:00 - 17:00 · 12명', card:true, active:true },
        { id:'s2', x:6,  y:70, label:'야간 교대', sub:'20:00 - 05:00 · 6명',  card:true, active:true },
        { id:'a1', x:35, y:15, label:'A라인 풀가동', sub:'3라인 동시', active:true },
        { id:'a2', x:35, y:70, label:'B라인 축소',   sub:'1라인 운영', active:true },
        { id:'q1', x:62, y:42, label:'공통 품질 룰', sub:'모든 교대 적용', card:true, active:true },
        { id:'a3', x:86, y:42, label:'출하',        sub:'DAILY 24,000 EA', active:true },
      ],
      edges: [['s1','a1'],['s2','a2'],['a1','q1'],['a2','q1'],['q1','a3']],
      active: ['s1','s2','a1','a2','q1','a3'],
    },
    {
      label: '공장별 분기',
      nodes: [
        { id:'hq', x:8,  y:45, label:'본사 · 기준 정의', sub:'표준 룰 · 통합 지표', card:true, active:true },
        { id:'f1', x:45, y:12, label:'성동 제1공장', sub:'A·B·C 3라인 · 108명', active:true },
        { id:'f2', x:45, y:45, label:'안산 제2공장', sub:'D·E 2라인 · 62명',    active:true },
        { id:'f3', x:45, y:78, label:'호찌민 법인', sub:'F 1라인 · 44명',       active:true },
        { id:'d1', x:82, y:12, label:'현장 룰 A',  sub:'두께 3mm', card:true, active:true },
        { id:'d2', x:82, y:45, label:'현장 룰 B',  sub:'색상 A-급', card:true, active:true },
        { id:'d3', x:82, y:78, label:'현장 룰 C',  sub:'습도 ≤ 60%', card:true, active:true },
      ],
      edges: [['hq','f1'],['hq','f2'],['hq','f3'],['f1','d1'],['f2','d2'],['f3','d3']],
      active: ['hq','f1','f2','f3','d1','d2','d3'],
    },
  ];

  // Gather union of nodes across all stages
  const allNodes = {};
  STAGES.forEach(st => st.nodes.forEach(n => {
    // Key by id — later stages may redefine positions; we keep per-stage override via dataset
    if (!allNodes[n.id]) allNodes[n.id] = n;
  }));

  // Initial render: render all node ids once, we'll move them on stage change
  Object.values(allNodes).forEach(n => {
    const el = document.createElement('div');
    el.className = 'wf-node' + (n.card ? ' card' : '');
    el.dataset.id = n.id;
    if (n.card){
      el.innerHTML = `<span class="t">${n.label}</span><span class="s">${n.sub}</span>`;
    } else {
      el.innerHTML = `<span class="dot"></span><span>${n.label}</span><span class="mono">${n.sub}</span>`;
    }
    el.style.opacity = '0';
    el.style.transform = 'translate(-50%, -50%) scale(.9)';
    nodesEl.appendChild(el);
  });

  function renderStage(idx){
    const st = STAGES[Math.max(0, Math.min(STAGES.length-1, idx))];
    if (!st) return;
    stageLabelEl.textContent = st.label.toUpperCase();

    // Move/show/hide nodes
    const activeIds = new Set(st.nodes.map(n => n.id));
    [...nodesEl.children].forEach(el => {
      const id = el.dataset.id;
      const def = st.nodes.find(n => n.id === id);
      if (def){
        el.style.left = def.x + '%';
        el.style.top  = def.y + '%';
        el.style.opacity = '1';
        el.style.transform = 'translate(-50%, -50%) scale(1)';
        el.classList.toggle('on', !!def.active);
      } else {
        el.style.opacity = '0';
        el.style.transform = 'translate(-50%, -50%) scale(.9)';
      }
    });

    // Edges
    svgEl.innerHTML = '';
    st.edges.forEach(([from, to]) => {
      const a = st.nodes.find(n => n.id === from);
      const b = st.nodes.find(n => n.id === to);
      if (!a || !b) return;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const x1 = a.x, y1 = a.y, x2 = b.x, y2 = b.y;
      const mx = (x1+x2)/2;
      const d = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
      path.setAttribute('d', d);
      path.classList.add('on');
      svgEl.appendChild(path);
    });
  }

  // Expose for scroll driver
  window.__setWorkflowStage = renderStage;

  // Initial
  renderStage(0);
})();
