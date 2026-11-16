// ============================================================================
// CreatorCalc & UtilityHub (2026) — 100% Client-Side Engine
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initTabNavigation();
  initRobloxCalculator();
  initYouTubeCalculatorAndPreviewer();
  initThermalLabelCropper();
  initCutListAndQuoteGenerator();
});

// ----------------------------------------------------------------------------
// TAB NAVIGATION & DYNAMIC SEO HEADER
// ----------------------------------------------------------------------------
function initTabNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');
  const panels = document.querySelectorAll('.tool-panel');
  const heroTitle = document.getElementById('dynamic-hero-title');
  const heroDesc = document.getElementById('dynamic-hero-desc');

  const metaMap = {
    'panel-roblox': {
      title: 'Roblox DevEx, Marketplace Tax & Gamepass Profit Calculator (2026)',
      desc: 'Calculate exact USD payouts with the 2026 baseline ($0.0038/R$) and US 18+ Verified Boost ($0.0054/R$), simulate 30% Marketplace fees, and reverse-calculate target USD goals.'
    },
    'panel-youtube': {
      title: 'YouTube Shorts vs. Long-Form RPM Estimator & Mobile Thumbnail Safe-Zone Tester',
      desc: 'Forecast monthly AdSense revenue across niches and test your 16:9 Thumbnail or 9:16 Short against real mobile UI overlays and title cutoffs.'
    },
    'panel-thermal': {
      title: '8.5x11" to 4x6" Thermal Shipping Label Cropper (100% Local Privacy)',
      desc: 'Crop standard USPS, UPS, Poshmark, Etsy, and eBay 8.5x11" sheets into crisp 4x6" thermal labels in 1 click without uploading customer data.'
    },
    'panel-cutlist': {
      title: '4x8 Plywood Cut-List Visual Nesting & Instant Client Quote PDF Generator',
      desc: 'Optimize 96"×48" sheet layouts with blade kerf compensation and print a clean Client Estimate PDF or multi-page Poster Tile Grid in 1 click.'
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const panel = document.getElementById(targetId);
      if (panel) panel.classList.add('active');

      if (metaMap[targetId]) {
        heroTitle.textContent = metaMap[targetId].title;
        heroDesc.textContent = metaMap[targetId].desc;
      }
    });
  });
}

// ----------------------------------------------------------------------------
// TOOL 1: ROBLOX DEVEX 2026 & MARKETPLACE TAX CALCULATOR
// ----------------------------------------------------------------------------
function initRobloxCalculator() {
  const amountEl = document.getElementById('rbx-amount');
  const sourceEl = document.getElementById('rbx-source-type');
  const boostEl = document.getElementById('rbx-boost-share');
  const adSpendEl = document.getElementById('rbx-ad-spend');
  const targetUsdEl = document.getElementById('rbx-target-usd');

  const BASE_RATE_2026 = 0.0038;   // $38 per 10,000 R$
  const BOOST_RATE_2026 = 0.0054;  // $54 per 10,000 R$ (+42% US 18-34 verified spend)
  const LEGACY_RATE = 0.0035;      // $35 per 10,000 R$

  function formatNum(n) {
    return Math.round(n).toLocaleString('en-US');
  }
  function formatUsd(n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function calculateRoblox() {
    const grossRobux = Math.max(0, parseFloat(amountEl.value) || 0);
    const sourceType = sourceEl.value;
    const boostPct = Math.min(100, Math.max(0, parseFloat(boostEl.value) || 0)) / 100;
    const adSpend = Math.max(0, parseFloat(adSpendEl.value) || 0);
    const targetUsd = Math.max(1, parseFloat(targetUsdEl.value) || 1000);

    let keepRatio = 1.0;
    let feeRateLabel = '0%';
    if (sourceType === 'gamepass' || sourceType === 'ugc-in-game') {
      keepRatio = 0.70;
      feeRateLabel = '30%';
    } else if (sourceType === 'ugc-catalog') {
      keepRatio = 0.30;
      feeRateLabel = '70%';
    }

    const marketplaceFee = Math.round(grossRobux * (1 - keepRatio));
    const netRobuxBeforeAds = grossRobux - marketplaceFee;
    const netRobux = Math.max(0, netRobuxBeforeAds - adSpend);

    const basePortionRobux = netRobux * (1 - boostPct);
    const boostPortionRobux = netRobux * boostPct;

    const baseUsd = basePortionRobux * BASE_RATE_2026;
    const boostUsd = boostPortionRobux * BOOST_RATE_2026;
    const totalUsd = baseUsd + boostUsd;

    const blendedRate = (1 - boostPct) * BASE_RATE_2026 + boostPct * BOOST_RATE_2026;
    const legacyUsd = netRobux * LEGACY_RATE;
    const diffLegacy = totalUsd - legacyUsd;

    // Reverse Gamepass price to receive `grossRobux` after 30% tax
    const reverseGamepassPrice = Math.ceil(grossRobux / 0.70);

    // Required gross Robux for Target USD
    const requiredNetRobuxForGoal = targetUsd / blendedRate;
    const requiredGrossRobuxForGoal = Math.ceil((requiredNetRobuxForGoal + adSpend) / keepRatio);

    // Update UI
    document.getElementById('rbx-amount-formatted').textContent = `${formatNum(grossRobux)} R$`;
    document.getElementById('rbx-boost-label').textContent = `${Math.round(boostPct * 100)}% Boosted ($${blendedRate.toFixed(5)}/R$)`;

    document.getElementById('rbx-out-usd').textContent = formatUsd(totalUsd);
    document.getElementById('rbx-out-effective-rate').textContent = `Blended Rate: $${blendedRate.toFixed(5)} / R$`;
    document.getElementById('rbx-out-net-robux').textContent = `${formatNum(netRobux)} R$`;
    document.getElementById('rbx-out-tax-deducted').textContent = `-${formatNum(marketplaceFee)} R$ Marketplace Fee (${feeRateLabel})`;
    document.getElementById('rbx-out-diff-legacy').textContent = (diffLegacy >= 0 ? '+' : '') + formatUsd(diffLegacy);
    document.getElementById('rbx-out-legacy-val').textContent = `Old $0.0035 Rate: ${formatUsd(legacyUsd)}`;
    document.getElementById('rbx-out-reverse-price').textContent = `${formatNum(reverseGamepassPrice)} R$`;

    document.getElementById('tbl-rbx-gross').textContent = `${formatNum(grossRobux)} R$`;
    document.getElementById('tbl-rbx-fee').textContent = `-${formatNum(marketplaceFee)} R$ (${feeRateLabel})`;
    document.getElementById('tbl-rbx-ads').textContent = `-${formatNum(adSpend)} R$`;
    document.getElementById('tbl-rbx-base-usd').textContent = formatUsd(baseUsd);
    document.getElementById('tbl-rbx-boost-usd').textContent = '+' + formatUsd(boostUsd);
    document.getElementById('tbl-rbx-goal-robux').textContent = `${formatNum(requiredGrossRobuxForGoal)} R$ (for ${formatUsd(targetUsd)})`;
  }

  [amountEl, sourceEl, boostEl, adSpendEl, targetUsdEl].forEach((el) => {
    el.addEventListener('input', calculateRoblox);
    el.addEventListener('change', calculateRoblox);
  });

  document.querySelectorAll('.rbx-preset').forEach((btn) => {
    btn.addEventListener('click', () => {
      amountEl.value = btn.getAttribute('data-val');
      calculateRoblox();
    });
  });

  document.getElementById('btn-copy-rbx').addEventListener('click', () => {
    const summary = `Roblox 2026 DevEx Summary:\nGross: ${ document.getElementById('tbl-rbx-gross').textContent }\nNet Robux: ${ document.getElementById('rbx-out-net-robux').textContent }\nNet USD Payout: ${ document.getElementById('rbx-out-usd').textContent } (${ document.getElementById('rbx-out-effective-rate').textContent })`;
    navigator.clipboard.writeText(summary);
    const btn = document.getElementById('btn-copy-rbx');
    const orig = btn.textContent;
    btn.textContent = '✓ Copied to Clipboard!';
    setTimeout(() => { btn.textContent = orig; }, 1800);
  });

  document.getElementById('btn-csv-rbx').addEventListener('click', () => {
    const rows = [
      ['Metric', 'Value'],
      ['Gross Robux', document.getElementById('tbl-rbx-gross').textContent],
      ['Marketplace Fee', document.getElementById('tbl-rbx-fee').textContent],
      ['Ad / UGC Advance', document.getElementById('tbl-rbx-ads').textContent],
      ['Net Earned Robux', document.getElementById('rbx-out-net-robux').textContent],
      ['Net USD Payout (2026)', document.getElementById('rbx-out-usd').textContent],
      ['Gain vs Old Rate', document.getElementById('rbx-out-diff-legacy').textContent]
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'roblox-devex-2026-report.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  });

  calculateRoblox();
}

// ----------------------------------------------------------------------------
// TOOL 2: YOUTUBE SHORTS VS LONG-FORM RPM + LIVE THUMBNAIL & SAFE-ZONE TESTER
// ----------------------------------------------------------------------------
function initYouTubeCalculatorAndPreviewer() {
  const nicheEl = document.getElementById('yt-niche');
  const shortViewsEl = document.getElementById('yt-short-views');
  const shortRpmEl = document.getElementById('yt-short-rpm');
  const longViewsEl = document.getElementById('yt-long-views');
  const longRpmEl = document.getElementById('yt-long-rpm');

  const previewModeEl = document.getElementById('yt-preview-mode');
  const titleInputEl = document.getElementById('yt-title-input');
  const charBadgeEl = document.getElementById('yt-char-badge');
  const canvas = document.getElementById('yt-preview-canvas');
  const ctx = canvas.getContext('2d');

  let uploadedImg = null;

  function updateYouTubeMath() {
    const shortViews = Math.max(0, parseFloat(shortViewsEl.value) || 0);
    const shortRpm = Math.max(0, parseFloat(shortRpmEl.value) || 0);
    const longViews = Math.max(0, parseFloat(longViewsEl.value) || 0);
    const longRpm = Math.max(0, parseFloat(longRpmEl.value) || 0);

    document.getElementById('yt-short-views-lbl').textContent = `${Math.round(shortViews).toLocaleString('en-US')} views`;
    document.getElementById('yt-long-views-lbl').textContent = `${Math.round(longViews).toLocaleString('en-US')} views`;

    const shortRev = (shortViews / 1000) * shortRpm;
    const longRev = (longViews / 1000) * longRpm;
    const totalMonthly = shortRev + longRev;
    const totalYearly = totalMonthly * 12;

    const eqViews = shortRpm > 0 ? Math.round(longRpm / shortRpm) : 0;

    document.getElementById('yt-out-monthly').textContent = '$' + totalMonthly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('yt-out-yearly').textContent = '$' + totalYearly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' / year';
    document.getElementById('yt-out-split').textContent = `$${Math.round(longRev).toLocaleString()} Long / $${Math.round(shortRev).toLocaleString()} Shorts`;
    document.getElementById('yt-out-ratio').textContent = `1 Long-Form view = ${eqViews} Shorts views`;
  }

  nicheEl.addEventListener('change', () => {
    const opt = nicheEl.options[nicheEl.selectedIndex];
    longRpmEl.value = opt.getAttribute('data-long');
    shortRpmEl.value = opt.getAttribute('data-short');
    updateYouTubeMath();
  });

  [shortViewsEl, shortRpmEl, longViewsEl, longRpmEl].forEach((el) => {
    el.addEventListener('input', updateYouTubeMath);
  });

  function renderThumbnailCanvas() {
    const mode = previewModeEl.value;
    const rawTitle = titleInputEl.value || 'Untitled Video';
    const len = rawTitle.length;

    if (len <= 55) {
      charBadgeEl.textContent = `${len} / 55 chars (Mobile Safe)`;
      charBadgeEl.style.color = '#34d399';
    } else {
      charBadgeEl.textContent = `${len} / 55 chars (Truncates on Mobile!)`;
      charBadgeEl.style.color = '#fb7185';
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (mode === 'shorts-safezone') {
      // Draw 9:16 phone frame centered (248 x 420)
      ctx.fillStyle = '#070a12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const fw = 236;
      const fh = 416;
      const fx = Math.round((canvas.width - fw) / 2);
      const fy = 12;

      // Frame background or user image
      if (uploadedImg) {
        ctx.drawImage(uploadedImg, fx, fy, fw, fh);
      } else {
        const grad = ctx.createLinearGradient(fx, fy, fx + fw, fy + fh);
        grad.addColorStop(0, '#1e3a8a');
        grad.addColorStop(1, '#581c87');
        ctx.fillStyle = grad;
        ctx.fillRect(fx, fy, fw, fh);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SAFE ZONE CENTER', fx + fw / 2, fy + fh / 2 - 10);
        ctx.font = '12px Inter, sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText('Keep captions & faces inside green box', fx + fw / 2, fy + fh / 2 + 14);
      }

      // Danger Zone Overlays (Top Search Bar, Right Buttons, Bottom Caption)
      ctx.fillStyle = 'rgba(244, 63, 94, 0.48)';
      // Top UI bar (top 12%)
      ctx.fillRect(fx, fy, fw, 52);
      // Right Action Icons (right 22%, middle-bottom)
      ctx.fillRect(fx + fw - 54, fy + 150, 54, 190);
      // Bottom Title/Audio/Caption Bar (bottom 22%)
      ctx.fillRect(fx, fy + fh - 92, fw, 92);

      // Safe Zone Green Border
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(fx + 12, fy + 56, fw - 70, fh - 152);
      ctx.setLineDash([]);

      // Labels
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('⚠️ TOP UI BAR (DANGER)', fx + 10, fy + 30);
      ctx.fillText('⚠️ BOTTOM CAPTIONS & AUDIO (DANGER)', fx + 10, fy + fh - 45);
      ctx.save();
      ctx.translate(fx + fw - 22, fy + 260);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('⚠️ LIKE/SHARE', 0, 0);
      ctx.restore();
    } else {
      // YouTube Mobile Home Feed Card (Dark or Light)
      const isDark = mode === 'yt-mobile-dark';
      ctx.fillStyle = isDark ? '#0f0f0f' : '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const thumbX = 40;
      const thumbY = 20;
      const thumbW = 560;
      const thumbH = 315;

      if (uploadedImg) {
        ctx.drawImage(uploadedImg, thumbX, thumbY, thumbW, thumbH);
      } else {
        const grad = ctx.createLinearGradient(thumbX, thumbY, thumbX + thumbW, thumbY + thumbH);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.5, '#1d4ed8');
        grad.addColorStop(1, '#7c3aed');
        ctx.fillStyle = grad;
        ctx.fillRect(thumbX, thumbY, thumbW, thumbH);

        ctx.fillStyle = '#facc15';
        ctx.font = '900 34px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('DROP YOUR 16:9 THUMBNAIL', thumbX + thumbW / 2, thumbY + thumbH / 2);
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 16px Inter, sans-serif';
        ctx.fillText('Check readability & bottom-right timestamp collision', thumbX + thumbW / 2, thumbY + thumbH / 2 + 34);
      }

      // Timestamp Badge (Bottom Right Danger Zone)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(thumbX + thumbW - 68, thumbY + thumbH - 34, 58, 24);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('12:48', thumbX + thumbW - 39, thumbY + thumbH - 17);

      // Channel Avatar Circle
      ctx.beginPath();
      ctx.arc(thumbX + 22, thumbY + thumbH + 36, 20, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();

      // Truncated Mobile Title
      const displayTitle = rawTitle.length > 55 ? rawTitle.slice(0, 55) + '...' : rawTitle;
      ctx.fillStyle = isDark ? '#f1f1f1' : '#0f0f0f';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(displayTitle, thumbX + 54, thumbY + thumbH + 30);

      // Subtitle metadata
      ctx.fillStyle = isDark ? '#aaaaaa' : '#606060';
      ctx.font = '13px Inter, sans-serif';
      ctx.fillText('Creator Studio • 148K views • 3 hours ago', thumbX + 54, thumbY + thumbH + 52);
    }
  }

  const dropzone = document.getElementById('yt-dropzone');
  const fileInput = document.getElementById('yt-file-input');

  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('dragover', (e) => { e.preventDefault(); });
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadYtImage(e.dataTransfer.files[0]);
    }
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files[0]) {
      loadYtImage(fileInput.files[0]);
    }
  });

  function loadYtImage(file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        uploadedImg = img;
        renderThumbnailCanvas();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  previewModeEl.addEventListener('change', renderThumbnailCanvas);
  titleInputEl.addEventListener('input', renderThumbnailCanvas);

  document.getElementById('btn-download-yt-preview').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'youtube-mobile-safezone-preview.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });

  updateYouTubeMath();
  renderThumbnailCanvas();
}

// ----------------------------------------------------------------------------
// TOOL 3: 8.5x11 TO 4x6" THERMAL SHIPPING LABEL CROPPER (ANTI-IA #1)
// ----------------------------------------------------------------------------
function initThermalLabelCropper() {
  const presetEl = document.getElementById('lbl-preset');
  const cropXEl = document.getElementById('lbl-crop-x');
  const cropYEl = document.getElementById('lbl-crop-y');
  const cropWEl = document.getElementById('lbl-crop-w');
  const cropHEl = document.getElementById('lbl-crop-h');
  const rotateEl = document.getElementById('lbl-rotate');
  const canvas = document.getElementById('lbl-canvas');
  const ctx = canvas.getContext('2d');

  // Create synthetic sample 8.5x11 shipping sheet so user sees immediate live functionality
  const sampleSheet = document.createElement('canvas');
  sampleSheet.width = 850;
  sampleSheet.height = 1100;
  const sctx = sampleSheet.getContext('2d');
  drawSampleShippingSheet(sctx, 850, 1100);

  let sourceImg = sampleSheet;

  function drawSampleShippingSheet(c, w, h) {
    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, w, h);
    // Top half 4x6 shipping label box
    c.strokeStyle = '#000000';
    c.lineWidth = 4;
    c.strokeRect(45, 45, w - 90, 460);

    c.fillStyle = '#000000';
    c.font = 'bold 48px Arial, sans-serif';
    c.fillText('P', 75, 115);
    c.font = 'bold 26px Arial, sans-serif';
    c.fillText('USPS PRIORITY MAIL 2-DAY', 140, 95);
    c.font = '18px Arial, sans-serif';
    c.fillText('SHIP TO: JOHN CARTER — 742 EVERGREEN TERRACE, AUSTIN TX 78701', 75, 185);

    // Simulated Barcode Bars
    for (let x = 90; x < w - 110; x += 12) {
      const barW = (x % 24 === 0) ? 7 : 4;
      c.fillRect(x, 250, barW, 130);
    }
    c.font = 'bold 20px monospace';
    c.fillText('9405 5036 9930 0192 8374 11', 230, 415);

    // Bottom half wasted tear-off instructions
    c.strokeStyle = '#94a3b8';
    c.setLineDash([10, 8]);
    c.beginPath();
    c.moveTo(20, 540);
    c.lineTo(w - 20, 540);
    c.stroke();
    c.setLineDash([]);
    c.fillStyle = '#64748b';
    c.font = '22px Arial, sans-serif';
    c.fillText('✂️ DO NOT INCLUDE IN THERMAL PRINT (8.5x11 Paper Instructions)', 95, 620);
  }

  presetEl.addEventListener('change', () => {
    const val = presetEl.value;
    if (val === 'top-half') {
      cropXEl.value = 4; cropYEl.value = 4; cropWEl.value = 92; cropHEl.value = 46;
      rotateEl.value = 'auto-portrait';
    } else if (val === 'left-half') {
      cropXEl.value = 3; cropYEl.value = 4; cropWEl.value = 46; cropHEl.value = 90;
      rotateEl.value = 'auto-portrait';
    } else if (val === 'poshmark') {
      cropXEl.value = 10; cropYEl.value = 6; cropWEl.value = 80; cropHEl.value = 48;
      rotateEl.value = 'auto-portrait';
    }
    renderLabelPreview();
  });

  function getThermalOutputCanvas() {
    const out = document.createElement('canvas');
    out.width = 800;   // 4x6 ratio (2:3)
    out.height = 1200;
    const octx = out.getContext('2d');
    octx.fillStyle = '#ffffff';
    octx.fillRect(0, 0, out.width, out.height);

    const sx = (parseFloat(cropXEl.value) / 100) * sourceImg.width;
    const sy = (parseFloat(cropYEl.value) / 100) * sourceImg.height;
    const sw = (parseFloat(cropWEl.value) / 100) * sourceImg.width;
    const sh = (parseFloat(cropHEl.value) / 100) * sourceImg.height;

    if (rotateEl.value === 'rotate-90') {
      octx.save();
      octx.translate(out.width / 2, out.height / 2);
      octx.rotate(Math.PI / 2);
      octx.drawImage(sourceImg, sx, sy, sw, sh, -out.height / 2 + 20, -out.width / 2 + 20, out.height - 40, out.width - 40);
      octx.restore();
    } else {
      octx.drawImage(sourceImg, sx, sy, sw, sh, 20, 20, out.width - 40, out.height - 40);
    }
    return out;
  }

  function renderLabelPreview() {
    document.getElementById('lbl-crop-x-val').textContent = cropXEl.value + '%';
    document.getElementById('lbl-crop-y-val').textContent = cropYEl.value + '%';
    document.getElementById('lbl-crop-w-val').textContent = cropWEl.value + '%';
    document.getElementById('lbl-crop-h-val').textContent = cropHEl.value + '%';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#070a12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Left: 8.5x11 sheet preview
    const sheetW = 260;
    const sheetH = 340;
    const sheetX = 24;
    const sheetY = 50;
    ctx.drawImage(sourceImg, sheetX, sheetY, sheetW, sheetH);

    // Highlight crop box
    const cx = sheetX + (parseFloat(cropXEl.value) / 100) * sheetW;
    const cy = sheetY + (parseFloat(cropYEl.value) / 100) * sheetH;
    const cw = (parseFloat(cropWEl.value) / 100) * sheetW;
    const ch = (parseFloat(cropHEl.value) / 100) * sheetH;

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.strokeRect(cx, cy, cw, ch);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
    ctx.fillRect(cx, cy, cw, ch);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText('1. Source 8.5x11" Sheet', sheetX, 34);

    // Right: Final 4x6 Thermal Label Output
    const outCanvas = getThermalOutputCanvas();
    const thermW = 236;
    const thermH = 354;
    const thermX = 346;
    const thermY = 44;

    ctx.drawImage(outCanvas, thermX, thermY, thermW, thermH);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(thermX, thermY, thermW, thermH);

    ctx.fillStyle = '#34d399';
    ctx.fillText('2. Ready 4x6" Thermal Output', thermX, 32);
  }

  [cropXEl, cropYEl, cropWEl, cropHEl, rotateEl].forEach((el) => {
    el.addEventListener('input', renderLabelPreview);
    el.addEventListener('change', renderLabelPreview);
  });

  const dropzone = document.getElementById('lbl-dropzone');
  const fileInput = document.getElementById('lbl-file-input');
  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('dragover', (e) => e.preventDefault());
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) loadLabelImg(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files[0]) loadLabelImg(fileInput.files[0]);
  });

  function loadLabelImg(file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        sourceImg = img;
        renderLabelPreview();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  document.getElementById('btn-download-thermal').addEventListener('click', () => {
    const out = getThermalOutputCanvas();
    const link = document.createElement('a');
    link.download = 'thermal-label-4x6-300dpi.png';
    link.href = out.toDataURL('image/png');
    link.click();
  });

  document.getElementById('btn-print-thermal').addEventListener('click', () => {
    const out = getThermalOutputCanvas();
    const printArea = document.getElementById('printable-area');
    printArea.innerHTML = `<div style="width:4in;height:6in;margin:0;padding:0;"><img src="${out.toDataURL('image/png')}" style="width:100%;height:100%;object-fit:contain;" /></div>`;
    window.print();
  });

  renderLabelPreview();
}

// ----------------------------------------------------------------------------
// TOOL 4: 4x8 PLYWOOD CUT-LIST + CLIENT QUOTE PDF & POSTER TILE SPLITTER
// ----------------------------------------------------------------------------
function initCutListAndQuoteGenerator() {
  const clientNameEl = document.getElementById('cut-client-name');
  const sheetPriceEl = document.getElementById('cut-sheet-price');
  const laborFeeEl = document.getElementById('cut-labor-fee');
  const kerfEl = document.getElementById('cut-kerf');
  const piecesInputEl = document.getElementById('cut-pieces-input');
  const canvas = document.getElementById('cut-canvas');
  const ctx = canvas.getContext('2d');

  let posterMode = false;

  function parseParts() {
    const lines = piecesInputEl.value.split('\n').map(l => l.trim()).filter(Boolean);
    const parts = [];
    lines.forEach((line) => {
      // Match e.g. `36 x 16 x 3 [Upper Shelf]`
      const match = line.match(/([\d.]+)\s*[xX*]\s*([\d.]+)(?:\s*[xX*]\s*(\d+))?(?:\s*\[(.*?)\])?/);
      if (match) {
        const len = Math.min(96, Math.max(1, parseFloat(match[1]) || 12));
        const wid = Math.min(48, Math.max(1, parseFloat(match[2]) || 12));
        const qty = Math.min(50, Math.max(1, parseInt(match[3] || '1', 10)));
        const label = match[4] || `${len}"×${wid}"`;
        for (let i = 0; i < qty; i++) {
          parts.push({ w: len, h: wid, label });
        }
      }
    });
    return parts;
  }

  function calculateAndRenderCutList() {
    const parts = parseParts();
    const kerf = Math.max(0, parseFloat(kerfEl.value) || 0.125);
    const sheetPrice = Math.max(0, parseFloat(sheetPriceEl.value) || 68);
    const laborFee = Math.max(0, parseFloat(laborFeeEl.value) || 0);

    // Simple shelf packing on 96 x 48 sheets
    const SHEET_W = 96;
    const SHEET_H = 48;
    const sorted = [...parts].sort((a, b) => b.h - a.h);

    const sheets = [[]];
    let curSheet = 0;
    let curX = 0;
    let curY = 0;
    let shelfH = 0;
    let usedArea = 0;

    sorted.forEach((p) => {
      usedArea += p.w * p.h;
      if (curX + p.w > SHEET_W) {
        curX = 0;
        curY += shelfH + kerf;
        shelfH = 0;
      }
      if (curY + p.h > SHEET_H) {
        curSheet++;
        sheets.push([]);
        curX = 0;
        curY = 0;
        shelfH = 0;
      }
      sheets[curSheet].push({ x: curX, y: curY, w: p.w, h: p.h, label: p.label });
      curX += p.w + kerf;
      if (p.h > shelfH) shelfH = p.h;
    });

    const totalSheets = Math.max(1, sheets.length);
    const totalSheetArea = totalSheets * SHEET_W * SHEET_H;
    const efficiency = Math.min(99.5, (usedArea / totalSheetArea) * 100);
    const materialCost = totalSheets * sheetPrice;
    const totalQuote = materialCost + laborFee;

    document.getElementById('cut-out-total-quote').textContent = `$${totalQuote.toFixed(2)}`;
    document.getElementById('cut-out-sheets-needed').textContent = `${totalSheets} Sheet(s) ($${materialCost.toFixed(0)} Mat + $${laborFee.toFixed(0)} Labor)`;
    document.getElementById('cut-out-efficiency').textContent = `${efficiency.toFixed(1)}%`;
    document.getElementById('cut-out-waste').textContent = `Waste Area: ${(100 - efficiency).toFixed(1)}%`;

    // Render Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#070a12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (posterMode) {
      document.getElementById('cut-canvas-title').textContent = '🧩 Poster & Stencil Multi-Page Tile Grid (Letter 8.5x11" / A4)';
      document.getElementById('cut-canvas-subtitle').textContent = 'Shows overlap glue margins (0.5") to print large 36"×24" stencils on a home printer.';
      drawPosterTileGrid(ctx, canvas.width, canvas.height);
      return;
    }

    document.getElementById('cut-canvas-title').textContent = `📐 Visual 4x8 Sheet Nesting Diagram (Sheet 1 of ${totalSheets})`;
    document.getElementById('cut-canvas-subtitle').textContent = 'Color-coded cut layout showing exact part dimensions on 96" × 48" plywood.';

    const padX = 34;
    const padY = 55;
    const scale = 5.7; // 96 * 5.7 = 547px, 48 * 5.7 = 273px
    const boardW = SHEET_W * scale;
    const boardH = SHEET_H * scale;

    // Wood sheet background
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(padX, padY, boardW, boardH);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.strokeRect(padX, padY, boardW, boardH);

    const palette = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];
    sheets[0].forEach((rect, idx) => {
      const rx = padX + rect.x * scale;
      const ry = padY + rect.y * scale;
      const rw = rect.w * scale;
      const rh = rect.h * scale;

      ctx.fillStyle = palette[idx % palette.length];
      ctx.fillRect(rx, ry, rw, rh);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(rx, ry, rw, rh);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(`${rect.w}"×${rect.h}"`, rx + 6, ry + 16);
      if (rh > 32) {
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(rect.label.slice(0, 14), rx + 6, ry + 30);
      }
    });

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText('96 inches (8 ft) →', padX + boardW / 2 - 50, padY - 12);
  }

  function drawPosterTileGrid(c, w, h) {
    const startX = 60;
    const startY = 45;
    const cols = 4;
    const rows = 3;
    const tileW = 120;
    const tileH = 105;

    for (let r = 0; r < rows; r++) {
      for (let col = 0; col < cols; col++) {
        const x = startX + col * tileW;
        const y = startY + r * tileH;
        c.fillStyle = 'rgba(59, 130, 246, 0.16)';
        c.fillRect(x, y, tileW - 6, tileH - 6);
        c.strokeStyle = '#60a5fa';
        c.setLineDash([5, 3]);
        c.strokeRect(x, y, tileW - 6, tileH - 6);
        c.setLineDash([]);

        c.fillStyle = '#ffffff';
        c.font = 'bold 12px Inter, sans-serif';
        c.fillText(`Page R${r + 1}-C${col + 1}`, x + 16, y + 48);
        c.fillStyle = '#34d399';
        c.font = '10px Inter, sans-serif';
        c.fillText('8.5" × 11" Tile', x + 16, y + 66);
      }
    }
  }

  [clientNameEl, sheetPriceEl, laborFeeEl, kerfEl, piecesInputEl].forEach((el) => {
    el.addEventListener('input', calculateAndRenderCutList);
  });

  document.getElementById('btn-poster-mode').addEventListener('click', (e) => {
    posterMode = !posterMode;
    e.target.textContent = posterMode
      ? '🪚 Switch Back to 4x8 Plywood Cut-List'
      : '🧩 Switch to Poster Tile Splitter (A4/Letter)';
    calculateAndRenderCutList();
  });

  document.getElementById('btn-print-quote').addEventListener('click', () => {
    const printArea = document.getElementById('printable-area');
    const project = clientNameEl.value || 'Custom Project Estimate';
    const totalQuote = document.getElementById('cut-out-total-quote').textContent;
    const breakdown = document.getElementById('cut-out-sheets-needed').textContent;
    const efficiency = document.getElementById('cut-out-efficiency').textContent;
    const diagramUrl = canvas.toDataURL('image/png');

    printArea.innerHTML = `
      <div style="font-family:Arial,sans-serif;padding:32px;max-width:760px;margin:0 auto;color:#111;">
        <h1 style="margin-bottom:4px;">Project Material & Cut-List Estimate</h1>
        <p style="color:#555;margin-bottom:20px;">Project: <strong>${project}</strong> • Date: ${new Date().toLocaleDateString('en-US')}</p>
        <hr style="margin-bottom:20px;" />
        <h2>Total Estimated Quote: ${totalQuote}</h2>
        <p style="margin:8px 0 16px;">Breakdown: ${breakdown} • Material Yield: ${efficiency}</p>
        <h3>Cut-List Layout Diagram:</h3>
        <img src="${diagramUrl}" style="width:100%;max-width:620px;border:1px solid #ccc;margin-top:10px;" />
        <h3 style="margin-top:20px;">Parts Specification:</h3>
        <pre style="background:#f8fafc;padding:12px;border:1px solid #cbd5e1;">${piecesInputEl.value}</pre>
      </div>
    `;
    window.print();
  });

  calculateAndRenderCutList();
}
