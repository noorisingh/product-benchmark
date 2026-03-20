// ─────────────────────────────────────────────
// AMPLITUDE BENCHMARK — CHART FUNCTIONS (D3 v7)
// ─────────────────────────────────────────────

import {
  acquisitionGrowthRate,
  acquisitionGrowthOverYear,
  acquisitionRetentionSankey,
  activationRate,
  activationRetentionSankey,
  engagementGrowthRate,
  engagementGrowthOverYear,
  engagementRetentionSankey,
  retentionRate,
} from './data.js';

// ─────────────────────────────────────────────
// COLORS
// ─────────────────────────────────────────────
const C = {
  blue:       '#0052F2',
  periwinkle: '#6980FF',
  gray30:     '#B9BFC7',
  gray10:     '#F2F4F8',
  gray20:     '#D5D9E0',
  gray50:     '#868D95',
  gray70:     '#50565B',
  gray90:     '#242A2E',
  darkBlue:   '#001A4F',
  pink:       '#FF7D78',
};

// ─────────────────────────────────────────────
// METRIC COLOR HELPER
// Reads --metric-color and --metric-color-mid CSS vars from the
// containing section so charts automatically match their section color.
// ─────────────────────────────────────────────
function getMetricColors(container) {
  const section = container.closest('section') || document.documentElement;
  const cs = getComputedStyle(section);
  const accent = cs.getPropertyValue('--metric-color').trim() || C.blue;
  const mid    = cs.getPropertyValue('--metric-color-mid').trim() || C.periwinkle;
  return { accent, mid };
}

// ─────────────────────────────────────────────
// TOOLTIP HELPER
// ─────────────────────────────────────────────
function createTooltip(container) {
  const el = document.createElement('div');
  el.className = 'chart-tooltip';
  container.style.position = 'relative';
  container.appendChild(el);
  return {
    show(x, y, html) {
      el.innerHTML = html;
      el.classList.add('visible');
      const rect = container.getBoundingClientRect();
      const tw = el.offsetWidth;
      const th = el.offsetHeight;
      let left = x + 12;
      if (left + tw > rect.width) left = x - tw - 12;
      el.style.left = `${Math.max(0, left)}px`;
      el.style.top  = `${Math.max(0, y - th / 2)}px`;
    },
    hide() { el.classList.remove('visible'); },
  };
}

// ─────────────────────────────────────────────
// MARGINS & RESPONSIVE WIDTH
// ─────────────────────────────────────────────
const MARGIN = { top: 20, right: 24, bottom: 40, left: 52 };

function getWidth(el) {
  return Math.max(300, el.clientWidth || el.getBoundingClientRect().width || 600);
}

// ─────────────────────────────────────────────
// GROUPED BAR CHART (Acquisition & Engagement)
// ─────────────────────────────────────────────
export function drawGroupedBarChart(containerId, dataKey, mode = 'all') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const source = dataKey === 'acquisition' ? acquisitionGrowthRate : engagementGrowthRate;
  const modeData = source[mode] || source.all;
  const groups = source.groups;

  const W = getWidth(container) - MARGIN.left - MARGIN.right;
  const H = 280;

  const svg = d3.select(container)
    .append('svg')
    .attr('width',  W + MARGIN.left + MARGIN.right)
    .attr('height', H + MARGIN.top + MARGIN.bottom)
    .attr('aria-hidden', 'true');

  const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

  const tooltip = createTooltip(container);
  const { accent, mid } = getMetricColors(container);

  // Scales
  const x0 = d3.scaleBand().domain(groups).range([0, W]).padding(0.25);
  const x1 = d3.scaleBand().domain(['p50', 'p75', 'p90']).range([0, x0.bandwidth()]).padding(0.08);
  const maxVal = d3.max(['p50','p75','p90'], k => d3.max(modeData[k]));
  const y = d3.scaleLinear().domain([0, maxVal * 1.15]).range([H, 0]);

  // Grid
  g.append('g').attr('class', 'grid')
    .call(d3.axisLeft(y).ticks(5).tickSize(-W).tickFormat(''))
    .call(gg => gg.select('.domain').remove());

  // Axes
  g.append('g').attr('class', 'axis axis--x')
    .attr('transform', `translate(0,${H})`)
    .call(d3.axisBottom(x0).tickSize(0))
    .call(gg => gg.select('.domain').remove())
    .selectAll('text').style('font-size', '13px').style('fill', C.gray70).attr('dy', '1.2em');

  g.append('g').attr('class', 'axis axis--y')
    .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`))
    .call(gg => gg.select('.domain').remove())
    .selectAll('text').style('font-size', '12px').style('fill', C.gray50);

  // Bar colors & labels — p90/p75 use section metric color
  const colors = { p50: C.gray30, p75: mid, p90: accent };
  const labels = { p50: '50th', p75: '75th', p90: '90th' };

  // Bars
  const groupEl = g.selectAll('.bar-group')
    .data(groups)
    .join('g')
    .attr('class', 'bar-group')
    .attr('transform', d => `translate(${x0(d)},0)`);

  ['p50', 'p75', 'p90'].forEach((pct, pi) => {
    groupEl.append('rect')
      .attr('x', x1(pct))
      .attr('width', x1.bandwidth())
      .attr('y', H)
      .attr('height', 0)
      .attr('rx', 4)
      .attr('fill', colors[pct])
      .on('mousemove', function(event, d) {
        const idx = groups.indexOf(d);
        const val = modeData[pct][idx];
        tooltip.show(event.offsetX, event.offsetY,
          `<strong>${labels[pct]} Percentile</strong><br>${d}: ${val}%`);
        d3.select(this).attr('fill-opacity', 0.8);
      })
      .on('mouseleave', function() {
        tooltip.hide();
        d3.select(this).attr('fill-opacity', 1);
      })
      // Animate upward
      .transition()
      .duration(900)
      .delay((_, i) => i * 80 + pi * 60)
      .ease(d3.easeCubicOut)
      .attr('y', (d) => { const idx = groups.indexOf(d); return y(modeData[pct][idx]); })
      .attr('height', (d) => { const idx = groups.indexOf(d); return H - y(modeData[pct][idx]); });
  });

  // Value labels above bars (only p90)
  groupEl.each(function(d, i) {
    const grp = d3.select(this);
    const val = modeData.p90[i];
    grp.append('text')
      .attr('x', x1('p90') + x1.bandwidth() / 2)
      .attr('y', y(val) - 6)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('fill', accent)
      .style('opacity', 0)
      .text(`${val}%`)
      .transition().duration(600).delay(i * 80 + 500).style('opacity', 1);
  });
}

// ─────────────────────────────────────────────
// LINE CHART (Activation & Retention)
// ─────────────────────────────────────────────
export function drawLineChart(containerId, dataKey, mode = 'all') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const source = dataKey === 'activation' ? activationRate : retentionRate;
  const modeData = source[mode] || source.all;
  const xLabels = source.days || source.months;

  const W = getWidth(container) - MARGIN.left - MARGIN.right;
  const H = 280;

  const svg = d3.select(container)
    .append('svg')
    .attr('width',  W + MARGIN.left + MARGIN.right)
    .attr('height', H + MARGIN.top + MARGIN.bottom)
    .attr('aria-hidden', 'true');

  const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);
  const tooltip = createTooltip(container);
  const { accent, mid } = getMetricColors(container);

  const xScale = d3.scalePoint().domain(xLabels).range([0, W]).padding(0.3);
  const maxVal = d3.max(['p50','p75','p90'], k => d3.max(modeData[k]));
  const yScale = d3.scaleLinear().domain([0, maxVal * 1.2]).range([H, 0]);

  // Grid
  g.append('g').attr('class', 'grid')
    .call(d3.axisLeft(yScale).ticks(5).tickSize(-W).tickFormat(''))
    .call(gg => gg.select('.domain').remove());

  // Axes
  g.append('g').attr('class', 'axis')
    .attr('transform', `translate(0,${H})`)
    .call(d3.axisBottom(xScale).tickSize(0))
    .call(gg => gg.select('.domain').remove())
    .selectAll('text').style('font-size', '13px').style('fill', C.gray70).attr('dy', '1.2em');

  g.append('g').attr('class', 'axis')
    .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => `${d}%`))
    .call(gg => gg.select('.domain').remove())
    .selectAll('text').style('font-size', '12px').style('fill', C.gray50);

  const lineColors = { p50: C.gray30, p75: mid, p90: accent };
  const lineWidths = { p50: 2, p75: 2.5, p90: 3 };
  const pcts = ['p50', 'p75', 'p90'];

  const lineGen = d3.line()
    .x((_, i) => xScale(xLabels[i]))
    .y(d => yScale(d))
    .curve(d3.curveCatmullRom.alpha(0.5));

  pcts.forEach((pct, pi) => {
    const vals = modeData[pct];
    const path = g.append('path')
      .datum(vals)
      .attr('fill', 'none')
      .attr('stroke', lineColors[pct])
      .attr('stroke-width', lineWidths[pct])
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('d', lineGen);

    // Draw animation
    const totalLen = path.node().getTotalLength();
    path
      .attr('stroke-dasharray', `${totalLen} ${totalLen}`)
      .attr('stroke-dashoffset', totalLen)
      .transition()
      .duration(1000)
      .delay(pi * 200)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    // Area fill below top line
    if (pct === 'p90') {
      const areaGen = d3.area()
        .x((_, i) => xScale(xLabels[i]))
        .y0(H)
        .y1(d => yScale(d))
        .curve(d3.curveCatmullRom.alpha(0.5));

      g.append('path')
        .datum(vals)
        .attr('fill', accent)
        .attr('fill-opacity', 0)
        .attr('d', areaGen)
        .transition().duration(1000).delay(600)
        .attr('fill-opacity', 0.06);
    }

    // Dots + tooltips
    vals.forEach((v, i) => {
      g.append('circle')
        .attr('cx', xScale(xLabels[i]))
        .attr('cy', yScale(v))
        .attr('r', 0)
        .attr('fill', lineColors[pct])
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mousemove', (event) => {
          tooltip.show(event.offsetX, event.offsetY,
            `<strong>${pct === 'p50' ? '50th' : pct === 'p75' ? '75th' : '90th'} Percentile</strong><br>${xLabels[i]}: <strong>${v}%</strong>`);
        })
        .on('mouseleave', () => tooltip.hide())
        .transition().duration(400).delay(pi * 200 + i * 100 + 800)
        .attr('r', pct === 'p90' ? 5 : 4);
    });
  });
}

// ─────────────────────────────────────────────
// DOT / PARTICLE GROWTH VISUALIZATION
// ─────────────────────────────────────────────
export function drawDotChart(containerId, dataKey) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const source = dataKey === 'acquisition' ? acquisitionGrowthOverYear : engagementGrowthOverYear;
  const months = source.months;
  const { accent, mid } = getMetricColors(container);
  const groups = [
    { key: 'p90', label: '90th Percentile', color: accent, endVal: source.all.p90[11] },
    { key: 'p75', label: '75th Percentile', color: mid,    endVal: source.all.p75[11] },
    { key: 'p50', label: '50th Percentile', color: C.gray30, endVal: source.all.p50[11] },
  ];

  const W = getWidth(container);
  const H = container.clientHeight || 340;

  const svg = d3.select(container)
    .append('svg')
    .attr('width', W)
    .attr('height', H)
    .attr('aria-hidden', 'true');

  // Three columns
  const colW = W / 3;
  const dotR = 5;
  const dotPad = 3;
  const colPad = 20;
  const baseCount = 100;
  const maxDots = Math.round(groups[0].endVal);

  groups.forEach((grp, gi) => {
    const cx = colW * gi + colW / 2;
    const count = Math.round(grp.endVal);
    const cols = Math.floor((colW - colPad * 2) / (dotR * 2 + dotPad));
    const rows = Math.ceil(count / cols);

    // Label at top
    svg.append('text')
      .attr('x', cx)
      .attr('y', 28)
      .attr('text-anchor', 'middle')
      .style('font-family', "'Poppins', Arial, sans-serif")
      .style('font-weight', '700')
      .style('font-size', '22px')
      .style('fill', grp.color)
      .style('opacity', 0)
      .text(count)
      .transition().duration(800).delay(gi * 100 + 600).style('opacity', 1);

    svg.append('text')
      .attr('x', cx)
      .attr('y', 46)
      .attr('text-anchor', 'middle')
      .style('font-family', "'IBM Plex Sans', Arial, sans-serif")
      .style('font-weight', '500')
      .style('font-size', '12px')
      .style('fill', C.gray50)
      .text(grp.label);

    // Subtitle: "users by Dec"
    svg.append('text')
      .attr('x', cx)
      .attr('y', 60)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', C.gray50)
      .text('users by year end');

    // Draw dots
    const startY = 78;
    const dotsPerRow = cols;

    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / dotsPerRow);
      const col = i % dotsPerRow;
      const dx = cx - (dotsPerRow * (dotR * 2 + dotPad)) / 2 + col * (dotR * 2 + dotPad) + dotR;
      const dy = startY + row * (dotR * 2 + dotPad) + dotR;

      if (dy + dotR > H - 12) break; // don't overflow

      const isOriginal = i < baseCount;
      const isNew = !isOriginal;

      svg.append('circle')
        .attr('cx', dx)
        .attr('cy', dy)
        .attr('r', 0)
        .attr('fill', isNew ? grp.color : 'transparent')
        .attr('stroke', grp.color)
        .attr('stroke-width', isOriginal ? 1.5 : 0)
        .attr('fill-opacity', isNew ? 0.8 : 0)
        .transition()
        .duration(300)
        .delay(gi * 120 + (isNew ? 400 + i * 4 : i * 3))
        .ease(d3.easeBackOut.overshoot(1.2))
        .attr('r', dotR - 1);
    }
  });

  // Dividers between columns
  [1, 2].forEach(i => {
    svg.append('line')
      .attr('x1', colW * i).attr('y1', 60)
      .attr('x2', colW * i).attr('y2', H - 12)
      .attr('stroke', C.gray20)
      .attr('stroke-dasharray', '4,4');
  });

  // Bottom label
  svg.append('text')
    .attr('x', W / 2).attr('y', H - 6)
    .attr('text-anchor', 'middle')
    .style('font-size', '11px').style('fill', C.gray50)
    .text('All groups started with 100 users in January. Filled dots = new users gained.');
}

// ─────────────────────────────────────────────
// SANKEY / ALLUVIAL DIAGRAM
// ─────────────────────────────────────────────
export function drawSankey(containerId, sankeyData) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const W = getWidth(container);
  const H = container.clientHeight || 360;
  const pad = { top: 24, right: 120, bottom: 24, left: 120 };

  const svg = d3.select(container)
    .append('svg')
    .attr('width', W)
    .attr('height', H)
    .attr('aria-hidden', 'true');

  const sankeyLayout = d3.sankey()
    .nodeId(d => d.id)
    .nodeWidth(20)
    .nodePadding(16)
    .extent([[pad.left, pad.top], [W - pad.right, H - pad.bottom]]);

  // Build graph
  const graph = sankeyLayout({
    nodes: sankeyData.nodes.map(d => ({ ...d })),
    links: sankeyData.links.map(d => ({ ...d })),
  });

  const tooltip = createTooltip(container);

  // Gradient defs
  const defs = svg.append('defs');
  graph.links.forEach((link, i) => {
    const srcColor = sankeyData.nodes.find(n => n.id === link.source.id)?.color || C.periwinkle;
    const tgtColor = sankeyData.nodes.find(n => n.id === link.target.id)?.color || C.periwinkle;
    const grad = defs.append('linearGradient')
      .attr('id', `sankey-grad-${i}`)
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '0%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', srcColor);
    grad.append('stop').attr('offset', '100%').attr('stop-color', tgtColor);
  });

  // Links
  const linkPaths = svg.append('g').attr('class', 'sankey-links')
    .selectAll('path')
    .data(graph.links)
    .join('path')
    .attr('class', 'sankey-link')
    .attr('d', d3.sankeyLinkHorizontal())
    .attr('stroke', (_, i) => `url(#sankey-grad-${i})`)
    .attr('stroke-width', d => Math.max(1, d.width))
    .attr('stroke-opacity', 0)
    .on('mousemove', function(event, d) {
      const srcId = d.source.id;
      const tgtId = d.target.id;
      linkPaths.classed('highlighted', p => p.source.id === srcId || p.target.id === tgtId);
      linkPaths.classed('dimmed', p => p.source.id !== srcId && p.target.id !== tgtId);
      const srcNode = sankeyData.nodes.find(n => n.id === srcId);
      const tgtNode = sankeyData.nodes.find(n => n.id === tgtId);
      tooltip.show(event.offsetX, event.offsetY,
        `<strong>${srcNode?.label ?? srcId}</strong> → <strong>${tgtNode?.label ?? tgtId}</strong>`);
    })
    .on('mouseleave', function() {
      linkPaths.classed('highlighted', false).classed('dimmed', false);
      tooltip.hide();
    });

  // Animate link opacity in
  linkPaths.transition()
    .duration(800)
    .delay((_, i) => i * 30)
    .ease(d3.easeCubicOut)
    .attr('stroke-opacity', 0.35);

  // Nodes
  const nodeG = svg.append('g').attr('class', 'sankey-nodes')
    .selectAll('g')
    .data(graph.nodes)
    .join('g')
    .attr('class', 'sankey-node')
    .on('mousemove', function(event, d) {
      linkPaths
        .classed('highlighted', p => p.source.id === d.id || p.target.id === d.id)
        .classed('dimmed', p => p.source.id !== d.id && p.target.id !== d.id);
    })
    .on('mouseleave', () => {
      linkPaths.classed('highlighted', false).classed('dimmed', false);
    });

  nodeG.append('rect')
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .attr('rx', 4)
    .attr('fill', d => {
      const nd = sankeyData.nodes.find(n => n.id === d.id);
      return nd?.color || C.periwinkle;
    })
    .attr('fill-opacity', 0.9);

  // Node labels
  nodeG.append('text')
    .attr('x', d => d.side === 'left' ? d.x0 - 8 : d.x1 + 8)
    .attr('y', d => (d.y0 + d.y1) / 2)
    .attr('dy', '0.35em')
    .attr('text-anchor', d => d.side === 'left' ? 'end' : 'start')
    .style('font-size', '12px')
    .style('font-weight', '500')
    .style('fill', C.gray70)
    .text(d => d.label);

  // Column labels
  svg.append('text').attr('x', pad.left).attr('y', 12).attr('text-anchor', 'middle')
    .style('font-size', '11px').style('font-weight', '600')
    .style('fill', C.gray50).style('text-transform', 'uppercase').style('letter-spacing', '0.06em')
    .text(sankeyData.sourceLabel);

  svg.append('text').attr('x', W - pad.right).attr('y', 12).attr('text-anchor', 'middle')
    .style('font-size', '11px').style('font-weight', '600')
    .style('fill', C.gray50).style('text-transform', 'uppercase').style('letter-spacing', '0.06em')
    .text(sankeyData.targetLabel);
}

// ─────────────────────────────────────────────
// MOBILE SANKEY FALLBACK — Stacked % bars
// ─────────────────────────────────────────────
export function drawSankeyMobileFallback(containerId, sankeyData) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const W = getWidth(container);
  const srcNodes = sankeyData.nodes.filter(n => n.side === 'left');
  const tgtNodes = sankeyData.nodes.filter(n => n.side === 'right');

  // For each source node, calculate distribution to targets
  const barH = 28;
  const rowGap = 12;
  const labelW = 80;
  const barW = W - labelW - 48;
  const totalH = srcNodes.length * (barH + rowGap) + 60;

  const svg = d3.select(container)
    .append('svg')
    .attr('width', W)
    .attr('height', totalH)
    .attr('aria-hidden', 'true');

  // Header
  svg.append('text').attr('x', labelW).attr('y', 16)
    .style('font-size', '11px').style('font-weight', '600').style('fill', C.gray50)
    .text('→ Distribution across Retention Quartiles');

  srcNodes.forEach((src, si) => {
    const y = si * (barH + rowGap) + 32;
    const srcLinks = sankeyData.links.filter(l => l.source === src.id);
    const total = d3.sum(srcLinks, l => l.value);

    svg.append('text')
      .attr('x', labelW - 6).attr('y', y + barH / 2 + 4)
      .attr('text-anchor', 'end')
      .style('font-size', '11px').style('font-weight', '500').style('fill', C.gray70)
      .text(src.label);

    let xOff = labelW;
    tgtNodes.forEach(tgt => {
      const link = srcLinks.find(l => l.target === tgt.id);
      const val = link ? link.value : 0;
      const w = (val / total) * barW;
      const color = tgt.color;

      svg.append('rect')
        .attr('x', xOff).attr('y', y)
        .attr('width', 0).attr('height', barH)
        .attr('fill', color).attr('fill-opacity', 0.8)
        .transition().duration(700).delay(si * 80)
        .attr('width', w);

      xOff += w;
    });
  });

  // Legend
  const legY = totalH - 18;
  tgtNodes.forEach((tgt, i) => {
    const lx = labelW + i * (barW / 4);
    svg.append('rect').attr('x', lx).attr('y', legY).attr('width', 10).attr('height', 10)
      .attr('rx', 2).attr('fill', tgt.color).attr('fill-opacity', 0.8);
    svg.append('text').attr('x', lx + 14).attr('y', legY + 9)
      .style('font-size', '10px').style('fill', C.gray60).text(tgt.label);
  });
}

// ─────────────────────────────────────────────
// INDUSTRY BARS (horizontal, CSS-animated)
// ─────────────────────────────────────────────
export function updateIndustryBars(industry) {
  const maxAcq = 12;  // max % for acquisition scale
  const maxRet = 30;  // max % for retention scale

  const acqData = industry.acquisition;
  const retData = industry.retention;

  // Acquisition bars
  animateBar('ind-acq-p50', 'ind-acq-p50-val', acqData.p50, maxAcq);
  animateBar('ind-acq-p75', 'ind-acq-p75-val', acqData.p75, maxAcq);
  animateBar('ind-acq-p90', 'ind-acq-p90-val', acqData.p90, maxAcq);

  // Retention bars
  animateBar('ind-ret-p50', 'ind-ret-p50-val', retData.p50, maxRet);
  animateBar('ind-ret-p75', 'ind-ret-p75-val', retData.p75, maxRet);
  animateBar('ind-ret-p90', 'ind-ret-p90-val', retData.p90, maxRet);
}

function animateBar(barId, valId, value, max) {
  const bar = document.getElementById(barId);
  const valEl = document.getElementById(valId);
  if (!bar || !valEl) return;

  // Handle negative values (media & entertainment acquisition)
  const pct = Math.max(0, (value / max) * 100);
  bar.style.width = `${pct}%`;
  valEl.textContent = value >= 0 ? `${value}%` : `${value}%`;
}

// ─────────────────────────────────────────────
// INIT ALL CHARTS (called from app.js)
// ─────────────────────────────────────────────
export function initAllCharts() {
  // Acquisition
  drawGroupedBarChart('chart-acq-bar', 'acquisition', 'all');
  drawDotChart('chart-acq-dots', 'acquisition');
  drawSankey('chart-acq-sankey', acquisitionRetentionSankey);
  drawSankeyMobileFallback('chart-acq-sankey-mobile', acquisitionRetentionSankey);

  // Activation
  drawLineChart('chart-act-line', 'activation', 'all');
  drawSankey('chart-act-sankey', activationRetentionSankey);
  drawSankeyMobileFallback('chart-act-sankey-mobile', activationRetentionSankey);

  // Engagement
  drawGroupedBarChart('chart-eng-bar', 'engagement', 'all');
  drawDotChart('chart-eng-dots', 'engagement');
  drawSankey('chart-eng-sankey', engagementRetentionSankey);
  drawSankeyMobileFallback('chart-eng-sankey-mobile', engagementRetentionSankey);

  // Retention
  drawLineChart('chart-ret-line', 'retention', 'all');
}

// ─────────────────────────────────────────────
// REDRAW ON RESIZE (debounced)
// ─────────────────────────────────────────────
export function initResizeHandler() {
  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      // Only redraw if width changed significantly
      initAllCharts();
    }, 300);
  });
}
