/* ============================================================
   PangPang — Dashboard mockup generator
   Builds hero dashboard + 4 alt dashboards for the showcase
   ============================================================ */

(function(){

  // ---- mini SVG helpers ----
  function areaPath(points, w, h){
    // points: array of normalized 0..1 y values
    const n = points.length;
    const step = w / (n - 1);
    let d = `M0 ${h - points[0]*h}`;
    for (let i = 1; i < n; i++){
      const x = i*step, y = h - points[i]*h;
      const px = (i-1)*step, py = h - points[i-1]*h;
      const cx1 = px + step*0.45, cy1 = py;
      const cx2 = x  - step*0.45, cy2 = y;
      d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x} ${y}`;
    }
    return {
      stroke: d,
      fill: d + ` L ${w} ${h} L 0 ${h} Z`
    };
  }

  function sparkSvg(values, color){
    const w = 56, h = 24;
    const p = areaPath(values, w, h);
    return `
      <svg class="spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">
        <path d="${p.fill}" fill="${color}" opacity=".12"/>
        <path d="${p.stroke}" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
      </svg>`;
  }

  function areaChart(series, color, labels){
    const w = 640, h = 180;
    const p = areaPath(series, w, h);
    const step = w / (labels.length - 1);
    const ticks = labels.map((l, i) => `
      <text x="${i*step}" y="${h - 2}" font-family="JetBrains Mono" font-size="9" fill="#8b93a3" text-anchor="${i===0?'start':i===labels.length-1?'end':'middle'}">${l}</text>
    `).join('');
    // grid lines
    const grid = [0.25, 0.5, 0.75].map(g => `
      <line x1="0" y1="${g*h}" x2="${w}" y2="${g*h}" stroke="#eef2f7" stroke-dasharray="3 4"/>
    `).join('');
    return `
      <svg class="area-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="areaFill-${color.replace(/[^a-z0-9]/gi,'')}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="${color}" stop-opacity="0.28"/>
            <stop offset="1" stop-color="${color}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        ${grid}
        <path d="${p.fill}" fill="url(#areaFill-${color.replace(/[^a-z0-9]/gi,'')})"/>
        <path d="${p.stroke}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        ${ticks}
      </svg>`;
  }

  function heatmapCells(n){
    let html = '';
    for (let i = 0; i < n; i++){
      const v = Math.random();
      const a = v > 0.85 ? 0.95 : v > 0.6 ? 0.6 : v > 0.35 ? 0.32 : 0.14;
      html += `<i style="background: color-mix(in oklch, oklch(0.58 0.22 255) ${Math.round(a*100)}%, #eef2f7)"></i>`;
    }
    return html;
  }

  function donut(pct, color, label){
    const r = 54, c = 2*Math.PI*r;
    const off = c - (pct/100)*c;
    return `
      <div class="donut">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="${r}" stroke="#eef2f7" stroke-width="14" fill="none"/>
          <circle cx="70" cy="70" r="${r}" stroke="${color}" stroke-width="14" fill="none"
                  stroke-dasharray="${c}" stroke-dashoffset="${off}" stroke-linecap="round"/>
        </svg>
        <div class="donut-center">
          <div class="pct">${pct}%</div>
          <div class="lb">${label}</div>
        </div>
      </div>`;
  }

  // ---- Sidebar ----
  const SIDE = (activeKey) => {
    const items = [
      {k:'overview', label:'개요', grp:'MAIN'},
      {k:'production', label:'생산 현황', grp:'MAIN'},
      {k:'quality', label:'품질 관제', grp:'MAIN'},
      {k:'inventory', label:'재고·물류', grp:'MAIN'},
      {k:'equipment', label:'설비 상태', grp:'OPS'},
      {k:'shifts', label:'교대·인원', grp:'OPS'},
      {k:'reports', label:'리포트', grp:'ANALYTICS'},
      {k:'executive', label:'임원 요약', grp:'ANALYTICS'},
    ];
    const groups = {};
    items.forEach(it => { (groups[it.grp] ||= []).push(it); });
    return `
      <aside class="dash-side">
        <div class="brand-mini"><span class="d" aria-hidden="true"></span>PangPang</div>
        ${Object.entries(groups).map(([g, arr]) => `
          <div class="dash-nav-group">
            <div class="dash-nav-label">${g}</div>
            ${arr.map(it => `
              <div class="dash-nav-item ${it.k===activeKey?'active':''}">
                <span class="ico" aria-hidden="true"></span>${it.label}
              </div>
            `).join('')}
          </div>
        `).join('')}
      </aside>`;
  };

  // ---- Panel: KPIs ----
  const KPI = (d) => `
    <div class="kpi">
      <div class="k">${d.k}</div>
      <div class="v">${d.v}<span class="u">${d.u||''}</span></div>
      <div class="delta ${d.up?'up':'down'}">${d.up?'▲':'▼'} ${d.delta}</div>
      ${sparkSvg(d.spark, d.up ? 'oklch(0.72 0.18 155)' : 'oklch(0.68 0.22 25)')}
    </div>`;

  // ---- Production (hero + alt 01) ----
  function productionDash(){
    const kpis = [
      {k:'오늘 생산량', v:'24,812', u:'EA', up:true, delta:'+4.2% vs 어제', spark:[0.3,0.45,0.4,0.55,0.6,0.7,0.65,0.82,0.9]},
      {k:'가동률(OEE)', v:'87.6', u:'%', up:true, delta:'+1.1pt', spark:[0.5,0.55,0.52,0.6,0.65,0.68,0.72,0.78,0.82]},
      {k:'불량률', v:'0.82', u:'%', up:false, delta:'-0.12pt', spark:[0.8,0.7,0.75,0.6,0.55,0.5,0.42,0.38,0.32]},
      {k:'완료 오더', v:'142', u:'건', up:true, delta:'+8건', spark:[0.3,0.4,0.35,0.5,0.55,0.7,0.8,0.85,0.92]},
    ];
    const series = [0.3, 0.45, 0.38, 0.55, 0.5, 0.62, 0.55, 0.72, 0.68, 0.8, 0.75, 0.88];
    const lines = [
      {lbl:'A라인 · 프레스', w:92, v:'92%'},
      {lbl:'B라인 · 용접', w:78, v:'78%'},
      {lbl:'C라인 · 도장', w:65, v:'65%'},
      {lbl:'D라인 · 조립', w:88, v:'88%'},
      {lbl:'E라인 · 검사', w:54, v:'54%'},
    ];
    return `
      <div class="dash dash--production">
        ${SIDE('production')}
        <div class="dash-main">
          <div class="dash-topbar">
            <div class="dash-title">생산 현황 <span class="sub">2026-04-22 · 08:00 ~ 17:42</span></div>
            <div class="dash-chips">
              <span class="chip live">LIVE</span>
              <span class="chip">오늘</span>
              <span class="chip active">이번 주</span>
              <span class="chip">이번 달</span>
            </div>
          </div>
          <div class="kpis">
            ${kpis.map(KPI).join('')}
          </div>
          <div class="dash-grid">
            <div class="panel">
              <h4>시간대별 생산량 <span class="r">UNITS / HOUR</span></h4>
              ${areaChart(series, 'oklch(0.58 0.22 255)', ['08','09','10','11','12','13','14','15','16','17','18','19'])}
            </div>
            <div class="panel">
              <h4>라인별 가동률 <span class="r">OEE</span></h4>
              <div class="line-list">
                ${lines.map(l => `
                  <div class="line-row">
                    <div class="lbl">${l.lbl}</div>
                    <div class="bar"><span style="--w:${l.w}%"></span></div>
                    <div class="val">${l.v}</div>
                  </div>`).join('')}
              </div>
            </div>
          </div>
          <div class="dash-bottom">
            <div class="panel">
              <h4>주간 히트맵 <span class="r">7D · HOURLY</span></h4>
              <div class="heat">${heatmapCells(14*6)}</div>
            </div>
            <div class="panel">
              <h4>실시간 알림 <span class="r">LIVE</span></h4>
              <div class="alerts">
                <div class="alert-row"><span class="alert-dot err"></span><span class="msg">C라인 설비 온도 임계치 초과</span><span class="t">17:38</span></div>
                <div class="alert-row"><span class="alert-dot warn"></span><span class="msg">B라인 자재 부족 예상 (32분)</span><span class="t">17:31</span></div>
                <div class="alert-row"><span class="alert-dot ok"></span><span class="msg">주간 검사 오더 완료 · 142/142</span><span class="t">17:12</span></div>
                <div class="alert-row"><span class="alert-dot warn"></span><span class="msg">야간 교대 인원 1명 미배정</span><span class="t">16:58</span></div>
              </div>
            </div>
            <div class="panel">
              <h4>작업 지시 <span class="r">WORK ORDERS</span></h4>
              <div class="alerts">
                <div class="alert-row"><span class="alert-dot ok"></span><span class="msg">WO-20260422-118 완료</span><span class="t">A-2</span></div>
                <div class="alert-row"><span class="alert-dot ok"></span><span class="msg">WO-20260422-121 진행 중 · 62%</span><span class="t">B-1</span></div>
                <div class="alert-row"><span class="alert-dot warn"></span><span class="msg">WO-20260422-124 대기 · 자재</span><span class="t">C-1</span></div>
                <div class="alert-row"><span class="alert-dot ok"></span><span class="msg">WO-20260422-126 배정 완료</span><span class="t">D-3</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  // ---- Quality ----
  function qualityDash(){
    const kpis = [
      {k:'합격률', v:'99.18', u:'%', up:true, delta:'+0.24pt', spark:[0.4,0.5,0.55,0.6,0.65,0.72,0.78,0.85,0.9]},
      {k:'검출 불량', v:'204', u:'건', up:false, delta:'-31건', spark:[0.8,0.7,0.65,0.6,0.5,0.42,0.38,0.3,0.22]},
      {k:'재작업 시간', v:'14.2', u:'h', up:false, delta:'-2.1h', spark:[0.75,0.7,0.6,0.55,0.5,0.42,0.35,0.28,0.22]},
      {k:'Cp·Cpk', v:'1.42 / 1.28', u:'', up:true, delta:'SIGMA 4.1', spark:[0.4,0.45,0.5,0.55,0.6,0.65,0.7,0.75,0.82]},
    ];
    return `
      <div class="dash dash--quality">
        ${SIDE('quality')}
        <div class="dash-main">
          <div class="dash-topbar">
            <div class="dash-title">품질 관제 <span class="sub">QUALITY CONTROL · LIVE</span></div>
            <div class="dash-chips">
              <span class="chip live">LIVE</span>
              <span class="chip active">라인별</span>
              <span class="chip">제품별</span>
            </div>
          </div>
          <div class="kpis">${kpis.map(KPI).join('')}</div>
          <div class="dash-grid" style="grid-template-columns: 1fr 1.4fr;">
            <div class="panel" style="display:grid; place-items:center;">
              <h4 style="width:100%">공정 능력 <span class="r">OVERALL</span></h4>
              ${donut(96, 'oklch(0.58 0.22 255)', 'PASS RATE')}
              <div style="display:flex; gap:24px; margin-top: 16px; font-size:12px; color: var(--ink-3);">
                <div><span style="font-family:var(--font-mono); color:var(--good);">●</span> 합격 24,408</div>
                <div><span style="font-family:var(--font-mono); color:var(--alert);">●</span> 불량 204</div>
              </div>
            </div>
            <div class="panel">
              <h4>최근 검사 결과 <span class="r">LAST 8</span></h4>
              <table class="qtable">
                <thead><tr><th>LOT</th><th>제품</th><th>검사 항목</th><th>결과</th><th>시각</th></tr></thead>
                <tbody>
                  <tr><td>L-4820A</td><td>제어보드</td><td>두께/도통</td><td><span class="pill ok">PASS</span></td><td>17:42</td></tr>
                  <tr><td>L-4819C</td><td>하우징</td><td>치수</td><td><span class="pill ok">PASS</span></td><td>17:36</td></tr>
                  <tr><td>L-4818B</td><td>센서모듈</td><td>전압</td><td><span class="pill warn">REVIEW</span></td><td>17:28</td></tr>
                  <tr><td>L-4817A</td><td>케이블</td><td>인장</td><td><span class="pill ok">PASS</span></td><td>17:14</td></tr>
                  <tr><td>L-4816D</td><td>커넥터</td><td>접촉저항</td><td><span class="pill err">FAIL</span></td><td>17:02</td></tr>
                  <tr><td>L-4815A</td><td>제어보드</td><td>두께/도통</td><td><span class="pill ok">PASS</span></td><td>16:48</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="dash-bottom">
            <div class="panel">
              <h4>불량 유형 TOP 5 <span class="r">WEEK</span></h4>
              <div class="line-list">
                <div class="line-row"><div class="lbl">솔더링</div><div class="bar"><span style="--w:82%"></span></div><div class="val">82</div></div>
                <div class="line-row"><div class="lbl">치수 불일치</div><div class="bar"><span style="--w:54%"></span></div><div class="val">54</div></div>
                <div class="line-row"><div class="lbl">도장 불균일</div><div class="bar"><span style="--w:32%"></span></div><div class="val">32</div></div>
                <div class="line-row"><div class="lbl">이물질</div><div class="bar"><span style="--w:22%"></span></div><div class="val">22</div></div>
                <div class="line-row"><div class="lbl">기타</div><div class="bar"><span style="--w:14%"></span></div><div class="val">14</div></div>
              </div>
            </div>
            <div class="panel">
              <h4>라인별 합격률 <span class="r">%</span></h4>
              ${areaChart([0.72,0.75,0.78,0.8,0.82,0.85,0.88,0.9,0.92,0.93,0.95,0.96], 'oklch(0.58 0.22 255)', ['월','화','수','목','금','토','일','월','화','수','목','금'])}
            </div>
            <div class="panel">
              <h4>관리도 <span class="r">X-BAR</span></h4>
              ${areaChart([0.5,0.55,0.52,0.58,0.54,0.6,0.56,0.62,0.58,0.64,0.6,0.66], 'oklch(0.68 0.22 25)', ['1','2','3','4','5','6','7','8','9','10','11','12'])}
            </div>
          </div>
        </div>
      </div>`;
  }

  // ---- Inventory ----
  function inventoryDash(){
    const kpis = [
      {k:'총 재고 가치', v:'₩ 4.82', u:'B', up:true, delta:'+2.1%', spark:[0.3,0.35,0.42,0.5,0.55,0.62,0.7,0.78,0.84]},
      {k:'오늘 입고', v:'3,204', u:'EA', up:true, delta:'+580', spark:[0.2,0.3,0.45,0.5,0.55,0.7,0.8,0.85,0.9]},
      {k:'오늘 출고', v:'2,882', u:'EA', up:true, delta:'+122', spark:[0.3,0.4,0.35,0.5,0.55,0.6,0.7,0.8,0.85]},
      {k:'재고 정확도', v:'99.62', u:'%', up:true, delta:'+0.8pt', spark:[0.4,0.5,0.55,0.62,0.7,0.75,0.8,0.85,0.9]},
    ];
    return `
      <div class="dash dash--inventory">
        ${SIDE('inventory')}
        <div class="dash-main">
          <div class="dash-topbar">
            <div class="dash-title">재고·물류 <span class="sub">INVENTORY · REAL-TIME</span></div>
            <div class="dash-chips">
              <span class="chip live">LIVE</span>
              <span class="chip active">창고별</span>
              <span class="chip">품목별</span>
              <span class="chip">회전율</span>
            </div>
          </div>
          <div class="kpis">${kpis.map(KPI).join('')}</div>
          <div class="dash-grid">
            <div class="panel">
              <h4>창고 적재율 <span class="r">CAPACITY</span></h4>
              <div class="line-list">
                <div class="line-row"><div class="lbl">자재창고 A</div><div class="bar"><span style="--w:72%"></span></div><div class="val">72%</div></div>
                <div class="line-row"><div class="lbl">자재창고 B</div><div class="bar"><span style="--w:88%"></span></div><div class="val">88%</div></div>
                <div class="line-row"><div class="lbl">반제품</div><div class="bar"><span style="--w:54%"></span></div><div class="val">54%</div></div>
                <div class="line-row"><div class="lbl">완제품</div><div class="bar"><span style="--w:62%"></span></div><div class="val">62%</div></div>
                <div class="line-row"><div class="lbl">출하대기</div><div class="bar"><span style="--w:38%"></span></div><div class="val">38%</div></div>
              </div>
            </div>
            <div class="panel">
              <h4>입출고 추이 <span class="r">14D</span></h4>
              ${areaChart([0.4,0.45,0.5,0.55,0.48,0.62,0.7,0.65,0.72,0.78,0.75,0.82], 'oklch(0.58 0.22 255)', ['04/09','10','11','12','13','14','15','16','17','18','19','04/22'])}
            </div>
          </div>
          <div class="dash-bottom">
            <div class="panel" style="grid-column: span 2">
              <h4>최근 스캔 로그 <span class="r">MOBILE · LIVE</span></h4>
              <table class="qtable">
                <thead><tr><th>시각</th><th>작업자</th><th>품목</th><th>위치</th><th>수량</th><th>구분</th></tr></thead>
                <tbody>
                  <tr><td>17:42:08</td><td>김성민</td><td>PCB-A4820</td><td>B-3-02</td><td>+240</td><td><span class="pill ok">IN</span></td></tr>
                  <tr><td>17:41:22</td><td>박지훈</td><td>HOUSING-221</td><td>A-1-08</td><td>-180</td><td><span class="pill warn">OUT</span></td></tr>
                  <tr><td>17:40:11</td><td>이수빈</td><td>CABLE-17A</td><td>B-4-11</td><td>+500</td><td><span class="pill ok">IN</span></td></tr>
                  <tr><td>17:38:54</td><td>정민재</td><td>SENSOR-M2</td><td>C-2-03</td><td>-24</td><td><span class="pill warn">OUT</span></td></tr>
                  <tr><td>17:37:19</td><td>김성민</td><td>FRAME-9</td><td>A-2-14</td><td>+60</td><td><span class="pill ok">IN</span></td></tr>
                </tbody>
              </table>
            </div>
            <div class="panel">
              <h4>부족 예상 품목 <span class="r">LOW STOCK</span></h4>
              <div class="alerts">
                <div class="alert-row"><span class="alert-dot err"></span><span class="msg">CONN-224 · 3일 이내 소진</span><span class="t">28 EA</span></div>
                <div class="alert-row"><span class="alert-dot warn"></span><span class="msg">GASKET-8B · 5일 이내</span><span class="t">142 EA</span></div>
                <div class="alert-row"><span class="alert-dot warn"></span><span class="msg">BOLT-M6 · 7일 이내</span><span class="t">882 EA</span></div>
                <div class="alert-row"><span class="alert-dot ok"></span><span class="msg">LABEL-A · 발주 완료</span><span class="t">ETA 04/25</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  // ---- Executive ----
  function executiveDash(){
    const kpis = [
      {k:'월 누적 생산', v:'482,104', u:'EA', up:true, delta:'+6.8%', spark:[0.3,0.4,0.5,0.55,0.62,0.7,0.75,0.82,0.9]},
      {k:'영업 목표 달성', v:'108.2', u:'%', up:true, delta:'+8.2pt', spark:[0.5,0.55,0.6,0.68,0.72,0.78,0.82,0.88,0.95]},
      {k:'재고 회전율', v:'8.4', u:'회/월', up:true, delta:'+0.6', spark:[0.4,0.45,0.5,0.55,0.6,0.68,0.72,0.78,0.84]},
      {k:'단위 생산 원가', v:'₩ 1,284', u:'', up:false, delta:'-3.2%', spark:[0.8,0.75,0.7,0.65,0.6,0.55,0.48,0.42,0.35]},
    ];
    return `
      <div class="dash dash--executive">
        ${SIDE('executive')}
        <div class="dash-main">
          <div class="dash-topbar">
            <div class="dash-title">임원 요약 <span class="sub">EXECUTIVE · MONTHLY</span></div>
            <div class="dash-chips">
              <span class="chip">주간</span>
              <span class="chip active">월간</span>
              <span class="chip">분기</span>
              <span class="chip">연간</span>
            </div>
          </div>
          <div class="kpis">${kpis.map(KPI).join('')}</div>
          <div class="dash-grid" style="grid-template-columns: 1.4fr 1fr">
            <div class="panel">
              <h4>월별 생산량 vs 목표 <span class="r">YTD</span></h4>
              ${areaChart([0.4,0.5,0.55,0.62,0.68,0.72,0.78,0.82,0.88,0.92,0.95,0.98], 'oklch(0.58 0.22 255)', ['1월','2','3','4','5','6','7','8','9','10','11','12'])}
            </div>
            <div class="panel">
              <h4>공장별 기여도 <span class="r">SITES · 6</span></h4>
              <div class="line-list">
                <div class="line-row"><div class="lbl">성동 본사</div><div class="bar"><span style="--w:88%"></span></div><div class="val">32%</div></div>
                <div class="line-row"><div class="lbl">안산 제1공장</div><div class="bar"><span style="--w:72%"></span></div><div class="val">26%</div></div>
                <div class="line-row"><div class="lbl">평택 제2공장</div><div class="bar"><span style="--w:54%"></span></div><div class="val">18%</div></div>
                <div class="line-row"><div class="lbl">김해 제3공장</div><div class="bar"><span style="--w:42%"></span></div><div class="val">14%</div></div>
                <div class="line-row"><div class="lbl">호찌민 법인</div><div class="bar"><span style="--w:24%"></span></div><div class="val">10%</div></div>
              </div>
            </div>
          </div>
          <div class="dash-bottom">
            <div class="panel">
              <h4>KPI 스냅샷 <span class="r">M-O-M</span></h4>
              <div class="alerts">
                <div class="alert-row"><span class="alert-dot ok"></span><span class="msg">OEE 87.6% · 목표 달성</span><span class="t">+1.1pt</span></div>
                <div class="alert-row"><span class="alert-dot ok"></span><span class="msg">재고 정확도 99.6%</span><span class="t">+0.8pt</span></div>
                <div class="alert-row"><span class="alert-dot warn"></span><span class="msg">납기 준수 96.2%</span><span class="t">-0.4pt</span></div>
                <div class="alert-row"><span class="alert-dot ok"></span><span class="msg">불량률 0.82%</span><span class="t">-0.12pt</span></div>
              </div>
            </div>
            <div class="panel">
              <h4>주요 이슈 <span class="r">TOP 3</span></h4>
              <div class="alerts">
                <div class="alert-row"><span class="alert-dot err"></span><span class="msg">CONN-224 단종 · 대체 자재 검토</span><span class="t">HIGH</span></div>
                <div class="alert-row"><span class="alert-dot warn"></span><span class="msg">평택 C라인 설비 노후화</span><span class="t">MID</span></div>
                <div class="alert-row"><span class="alert-dot warn"></span><span class="msg">5월 주문 급증 · 인원 확보 필요</span><span class="t">MID</span></div>
              </div>
            </div>
            <div class="panel">
              <h4>원가 추이 <span class="r">12M</span></h4>
              ${areaChart([0.7,0.68,0.65,0.62,0.58,0.55,0.52,0.5,0.48,0.45,0.42,0.38], 'oklch(0.72 0.18 155)', ['5','6','7','8','9','10','11','12','1','2','3','4'])}
            </div>
          </div>
        </div>
      </div>`;
  }

  // ---- Mount ----
  const heroEl = document.getElementById('heroDash');
  if (heroEl) heroEl.innerHTML = productionDash();

  const stack = document.getElementById('dashStack');
  if (stack){
    const dashes = [
      { key: 'production', label: '01 · 생산 현황', html: productionDash },
      { key: 'quality',    label: '02 · 품질 관제', html: qualityDash },
      { key: 'inventory',  label: '03 · 재고·물류', html: inventoryDash },
      { key: 'executive',  label: '04 · 임원 요약', html: executiveDash },
    ];
    dashes.forEach((d) => {
      const card = document.createElement('div');
      card.className = 'dash-card';
      card.dataset.key = d.key;
      card.innerHTML = `<div class="tag mono">${d.label}</div>${d.html()}`;
      stack.appendChild(card);
    });

    const setActive = (key) => {
      const cards = [...stack.children];
      cards.forEach((c) => {
        const idx = dashes.findIndex(d => d.key === c.dataset.key);
        const activeIdx = dashes.findIndex(d => d.key === key);
        const rel = idx - activeIdx;
        if (rel === 0){
          c.style.transform = 'translateY(0) scale(1)';
          c.style.opacity = '1';
          c.style.zIndex = '10';
          c.style.filter = 'none';
        } else if (rel > 0){
          c.style.transform = `translateY(${24*rel}px) scale(${1 - 0.03*rel})`;
          c.style.opacity = rel > 2 ? '0' : `${1 - 0.25*rel}`;
          c.style.zIndex = `${10 - rel}`;
          c.style.filter = 'blur(0px)';
        } else {
          c.style.transform = `translateY(-80px) scale(.96)`;
          c.style.opacity = '0';
          c.style.zIndex = `${rel}`;
        }
      });
    };

    setActive('production');

    document.querySelectorAll('#dashSwitcher button').forEach((b) => {
      b.addEventListener('click', () => {
        document.querySelectorAll('#dashSwitcher button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        setActive(b.dataset.dash);
      });
    });

    // Auto-cycle when section is visible
    let autoIdx = 0;
    let cycleTimer;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting){
          cycleTimer = setInterval(() => {
            autoIdx = (autoIdx + 1) % dashes.length;
            const btn = document.querySelector(`#dashSwitcher button[data-dash="${dashes[autoIdx].key}"]`);
            btn && btn.click();
          }, 4200);
        } else {
          clearInterval(cycleTimer);
        }
      });
    }, { threshold: 0.4 });
    io.observe(stack.parentElement);
  }

})();
