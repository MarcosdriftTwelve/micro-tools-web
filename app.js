// ============================================================================
// CreatorCalc & UtilityHub (2026) — 100% Client-Side Engine
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initTabNavigation();
  initRobloxCalculator();
  initYouTubeCalculatorAndPreviewer();
  initThermalLabelCropper();
  initCutListAndQuoteGenerator();
  initNextGenChecker();
  initVicePackStudio();
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
    },
    'panel-nextgen': {
      title: 'GTA 6 / Vice City Next-Gen Hardware, PS5 SSD & 120Hz TV Checker (2026)',
      desc: 'Check your PS5, Xbox Series, or PC readiness score (0–100%), detect SSD/VRAM/HDMI 2.1 bottlenecks, and get matched upgrade picks.'
    },
    'panel-vicepack': {
      title: 'Vice Miami Pack Studio — Premiere, CapCut, DaVinci, AE & Photoshop Generator',
      desc: 'Generate instant 1080p Alpha PNG overlays, 3s animated WebM loops, and Vice Neon .CUBE LUTs compatible with Premiere, CapCut, DaVinci, AE, Final Cut, Vegas & Photoshop.'
    }
  };

  const hashAliasMap = {
    '#panel-gta6': 'panel-nextgen',
    '#panel-gta6-pt': 'panel-nextgen',
    '#gta6': 'panel-nextgen',
    '#panel-nextgen': 'panel-nextgen',
    '#panel-roblox': 'panel-roblox',
    '#panel-youtube': 'panel-youtube',
    '#panel-thermal': 'panel-thermal',
    '#panel-cutlist': 'panel-cutlist',
    '#panel-vicepack': 'panel-vicepack'
  };

  function activateTabByTargetId(targetId, updateHash = false) {
    const matchingTab = Array.from(tabs).find((t) => t.getAttribute('data-target') === targetId);
    const panel = document.getElementById(targetId);
    if (!matchingTab || !panel) return;

    tabs.forEach((t) => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    panels.forEach((p) => p.classList.remove('active'));

    matchingTab.classList.add('active');
    matchingTab.setAttribute('aria-selected', 'true');
    panel.classList.add('active');

    if (metaMap[targetId]) {
      heroTitle.textContent = metaMap[targetId].title;
      heroDesc.textContent = metaMap[targetId].desc;
    }

    if (updateHash && history.replaceState) {
      const publicHash = targetId === 'panel-nextgen' ? '#panel-gta6' : `#${targetId}`;
      history.replaceState(null, '', publicHash);
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');
      activateTabByTargetId(targetId, true);
    });
  });

  function checkUrlHash() {
    const rawHash = (window.location.hash || '').toLowerCase().trim();
    if (rawHash && hashAliasMap[rawHash]) {
      activateTabByTargetId(hashAliasMap[rawHash], false);
    }
  }

  window.addEventListener('hashchange', checkUrlHash);
  checkUrlHash();
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

// ----------------------------------------------------------------------------
// TOOL 5: GTA 6 / NEXT-GEN HARDWARE, PS5 SSD & 120HZ TV CHECKER (EN / PT-BR)
// ----------------------------------------------------------------------------
function initNextGenChecker() {
  const platformEl = document.getElementById('ng-platform');
  const pcFieldsEl = document.getElementById('ng-pc-fields');
  const vramEl = document.getElementById('ng-pc-vram');
  const ramEl = document.getElementById('ng-pc-ram');
  const pcSsdEl = document.getElementById('ng-pc-ssd');
  const displayEl = document.getElementById('ng-display');
  const storageEl = document.getElementById('ng-storage');
  const langBtns = document.querySelectorAll('.lang-btn');

  let lang = (window.location.hash.includes('-pt') || (navigator.language && navigator.language.toLowerCase().startsWith('pt')))
    ? 'pt'
    : 'en';
  langBtns.forEach((b) => {
    b.classList.toggle('active', b.getAttribute('data-lang') === lang);
  });

  const i18n = {
    en: {
      titleLeft: '🌴 GTA 6 / Vice City Next-Gen Hardware Checker',
      subLeft: 'Independent 2026 readiness estimator for open-world next-gen titles (+150 GB NVMe, Ray Tracing & HDMI 2.1 120Hz VRR).',
      lblPlatform: 'Your Current Gaming Platform',
      lblVram: 'GPU VRAM',
      lblRam: 'System RAM',
      lblPcSsd: 'Storage Drive Type',
      lblDisplay: 'Display / TV Type',
      lblStorage: 'Free SSD Storage Space (GB)',
      storageHint: 'Recommended: 200+ GB free on Gen4 NVMe (>= 5,500 MB/s) for base install + Day-1 patches.',
      lblScore: 'Readiness Score',
      lblTarget: 'Estimated Target Mode',
      titleRight: '🔍 Bottleneck Diagnosis & Recommended Upgrades',
      subRight: 'Exact hardware gaps detected for your setup and highest-ROI upgrade picks.',
      upgradeHeading: '🛒 Best-Value Verified Upgrades for Your Setup',
      viceTag: '🌴 New Release — $29 USD',
      viceTitle: 'ViceHeist_CreatorPack_V1 — "6 Stars Wanted" HUD, Wasted/Busted Freeze & Satellite Switch',
      viceDesc: 'Made for Gaming YouTubers, Streamers & Clippers covering Vice Miami & Leonida news. 1-click .drfx (DaVinci Resolve) + .jsx (After Effects) + OBS Overlays.',
      viceCta: '⚡ Get ViceHeist Pack ($29) →',
      freeSuffix: 'GB Free',
      bfBadge: '🔥 Black Friday Upgrade Deal',
      amzBtn: 'Amazon Deal →',
      mlBtn: 'Mercado Livre →',
      verdictGreat: 'Next-Gen Ready (Zero Major Bottlenecks)',
      verdictGood: 'Playable, Minor Upgrade Recommended',
      verdictWarn: 'Critical Bottleneck Detected',
      msgStorageCrit: '🚨 Storage Bottleneck: Only {gb} GB free. Open-world next-gen installs + Day-1 patches require 160–200 GB.',
      msgStorageOk: '✅ Storage OK: {gb} GB free handles base install and updates.',
      msgTv60: '⚠️ Display Bottleneck: 60Hz TV without HDMI 2.1 locks out 40fps Balanced VRR and 120Hz low-latency modes.',
      msgTvOk: '✅ Display OK: HDMI 2.1 / High-Refresh VRR unlocks 40fps Fidelity & smooth frame pacing.',
      msgSeriesS: '⚠️ Console Limit: Xbox Series S targets 1080p–1440p upscaled (30fps) with tighter texture streaming & limited 512GB space.',
      msgPs5Pro: '✅ PS5 Pro Advantage: PSSR AI upscaling + 2TB internal SSD ready for 60fps RT modes.',
      msgPcVramCrit: '🚨 GPU VRAM Bottleneck ({vram}GB): Ray-traced dense cities require 12GB+ VRAM to avoid stutters at 1440p/4K.',
      msgPcRamCrit: '⚠️ RAM Bottleneck (8GB): Upgrade to 16GB–32GB DDR4/DDR5 to prevent open-world pop-in.',
      msgPcHddCrit: '🚨 Drive Speed Bottleneck: Mechanical HDD / SATA cannot stream dense next-gen textures (DirectStorage requires NVMe Gen4).'
    },
    pt: {
      titleLeft: '🌴 Calculadora "Roda GTA 6?" — Hardware, SSD PS5 & TV 120Hz',
      subLeft: 'Estimador independente 2026 para mundos abertos Next-Gen (+150 GB em NVMe Gen4, Ray Tracing e TV HDMI 2.1 120Hz VRR).',
      lblPlatform: 'Sua Plataforma Atual',
      lblVram: 'VRAM da Placa de Vídeo',
      lblRam: 'Memória RAM',
      lblPcSsd: 'Tipo de Armazenamento',
      lblDisplay: 'Tipo de TV / Monitor',
      lblStorage: 'Espaço Livre no SSD (GB)',
      storageHint: 'Recomendado: 200+ GB livres em NVMe Gen4 (>= 5.500 MB/s) para jogo base + patches Day-1.',
      lblScore: 'Score de Prontidão',
      lblTarget: 'Modo Estimado',
      titleRight: '🔍 Diagnóstico de Gargalos & Upgrades Recomendados',
      subRight: 'Gargalos exatos detectados no seu setup atual e peças com melhor custo-benefício.',
      upgradeHeading: '🛒 Upgrades Recomendados (Links Oficiais Verificados)',
      viceTag: '🌴 Novo Pack — US$ 29',
      viceTitle: 'ViceHeist_CreatorPack_V1 — HUD "6 Estrelas", Efeito Wasted/Busted & Transição Satélite',
      viceDesc: 'Feito para YouTubers, Streamers e Cortes cobrindo Vice Miami e Leonida. 1 clique no DaVinci (.drfx), After Effects (.jsx) e OBS.',
      viceCta: '⚡ Baixar ViceHeist Pack ($29) →',
      freeSuffix: 'GB Livres',
      bfBadge: '🔥 Black Friday Upgrade Deal',
      amzBtn: 'Ver na Amazon →',
      mlBtn: 'Mercado Livre →',
      verdictGreat: 'Pronto pra Next-Gen (Sem Gargalos Graves)',
      verdictGood: 'Roda Bem, Upgrade Pontual Recomendado',
      verdictWarn: 'Gargalo Crítico Detectado',
      msgStorageCrit: '🚨 Gargalo de Espaço: Apenas {gb} GB livres. O mapa + patches Day-1 exigem 160–200 GB livres em SSD rápido.',
      msgStorageOk: '✅ Espaço OK: {gb} GB livres comportam o jogo e atualizações.',
      msgTv60: '⚠️ Gargalo de Tela: TV 60Hz sem HDMI 2.1 bloqueia o modo 40fps VRR equilibrado e 120Hz de baixa latência.',
      msgTvOk: '✅ Tela OK: HDMI 2.1 / Alta Taxa libera VRR e fluidez máxima.',
      msgSeriesS: '⚠️ Limite do Console: Xbox Series S foca em 1080p–1440p upscaled (30fps) e sofre com espaço interno reduzido.',
      msgPs5Pro: '✅ Vantagem PS5 Pro: Upscaling PSSR + 2TB internos prontos para Ray Tracing fluido.',
      msgPcVramCrit: '🚨 Gargalo de VRAM ({vram}GB): Cidades densas com Ray Tracing pedem 12GB+ de VRAM para evitar engasgos em 1440p/4K.',
      msgPcRamCrit: '⚠️ Gargalo de RAM (8GB): Subir para 16GB–32GB evita travamentos ao dirigir em alta velocidade.',
      msgPcHddCrit: '🚨 Gargalo de Disco: HDD / SATA comum não acompanha o streaming de texturas (DirectStorage pede NVMe Gen4).'
    }
  };

  function getAffiliateCards(needsSsd, needsTv, needsGpu, isPs5, isXbox) {
    const isPt = lang === 'pt';
    const amzDomain = isPt ? 'https://www.amazon.com.br/s' : 'https://www.amazon.com/s';
    const cards = [];

    if (isXbox) {
      cards.push({
        priority: true,
        bfDeal: true,
        title: isPt ? 'Cartão de Expansão SSD Xbox Series X|S 1TB/2TB' : 'Xbox Series X|S Storage Expansion Card 1TB/2TB',
        desc: isPt
          ? 'Único armazenamento externo que roda jogos Next-Gen nativamente no Xbox.'
          : 'Official Velocity Architecture expansion required to run Series X|S native titles.',
        amz: `${amzDomain}?k=Seagate+Storage+Expansion+Card+Xbox+Series&tag=centraldea084-20`,
        ml: `https://lista.mercadolivre.com.br/cartao-expansao-xbox-series-1tb?matt_tool=mvinicius9355`
      });
    } else {
      cards.push({
        priority: true,
        bfDeal: true,
        title: isPt
          ? (isPs5 ? 'SSD NVMe Gen4 2TB c/ Dissipador (PS5 7.300MB/s)' : 'SSD NVMe M.2 Gen4 2TB Alta Velocidade')
          : (isPs5 ? '2TB Gen4 NVMe SSD w/ Heatsink (PS5 7,300MB/s)' : '2TB Gen4 NVMe M.2 SSD (DirectStorage)'),
        desc: isPt
          ? 'Resolve a falta de espaço dos +150 GB e elimina telas de carregamento.'
          : 'Eliminates 150GB+ storage bottlenecks and ultra-fast texture streaming.',
        amz: `${amzDomain}?k=SSD+NVMe+2TB+Gen4+PS5+heatsink&tag=centraldea084-20`,
        ml: `https://lista.mercadolivre.com.br/ssd-nvme-2tb-gen4-ps5-dissipador?matt_tool=mvinicius9355`
      });
    }

    cards.push({
      priority: needsTv,
      bfDeal: true,
      title: isPt ? 'TV 4K 120Hz VRR HDMI 2.1 / Monitor Gamer 144Hz' : '4K 120Hz VRR HDMI 2.1 Gaming TV / 144Hz Monitor',
      desc: isPt
        ? 'Desbloqueia modo 40fps VRR e zero ghosting com HDMI 2.1 real.'
        : 'Unlocks 40fps Balanced VRR, ALLM low-latency & crisp motion clarity.',
      amz: `${amzDomain}?k=TV+4K+120Hz+HDMI+2.1+VRR+Gaming&tag=centraldea084-20`,
      ml: `https://lista.mercadolivre.com.br/tv-4k-120hz-hdmi-2-1-vrr?matt_tool=mvinicius9355`
    });

    cards.push({
      priority: needsGpu,
      bfDeal: true,
      title: isPt ? 'Placa de Vídeo RTX 4070 / 12GB+ VRAM (DLSS 3/4)' : 'RTX 4070 / 12GB+ VRAM GPU (DLSS Frame Gen)',
      desc: isPt
        ? 'Evita quedas de FPS em Ray Tracing com Frame Generation e 12GB+ VRAM.'
        : 'Prevents Ray Tracing VRAM stutters and enables DLSS Frame Generation.',
      amz: `${amzDomain}?k=RTX+4070+12GB+Graphics+Card&tag=centraldea084-20`,
      ml: `https://lista.mercadolivre.com.br/placa-de-video-rtx-4070-12gb?matt_tool=mvinicius9355`
    });

    cards.push({
      priority: false,
      bfDeal: true,
      title: isPt ? 'Controle DualSense / Headset 3D Pulse & PS5 Pro' : 'DualSense Controller / 3D Gaming Headset & PS5 Pro',
      desc: isPt
        ? 'Feedback háptico adaptativo + áudio espacial 3D para máxima imersão.'
        : 'Adaptive triggers + 3D spatial audio for immersive open-world sessions.',
      amz: `${amzDomain}?k=PlayStation+5+DualSense+Controller+PS5+Pro&tag=centraldea084-20`,
      ml: `https://lista.mercadolivre.com.br/controle-dualsense-ps5-pro?matt_tool=mvinicius9355`
    });

    return cards.sort((a, b) => Number(b.priority) - Number(a.priority)).slice(0, 4);
  }

  function renderNextGen() {
    const t = i18n[lang];
    const plat = platformEl.value;
    const disp = displayEl.value;
    const freeGb = parseInt(storageEl.value, 10) || 0;
    const isPc = plat === 'pc-custom';
    pcFieldsEl.style.display = isPc ? 'block' : 'none';

    // Static text translation
    document.getElementById('ng-title-left').textContent = t.titleLeft;
    document.getElementById('ng-sub-left').textContent = t.subLeft;
    document.getElementById('ng-lbl-platform').textContent = t.lblPlatform;
    document.getElementById('ng-lbl-vram').textContent = t.lblVram;
    document.getElementById('ng-lbl-ram').textContent = t.lblRam;
    document.getElementById('ng-lbl-pc-ssd').textContent = t.lblPcSsd;
    document.getElementById('ng-lbl-display').textContent = t.lblDisplay;
    document.getElementById('ng-lbl-storage').textContent = t.lblStorage;
    document.getElementById('ng-storage-hint').textContent = t.storageHint;
    document.getElementById('ng-lbl-score').textContent = t.lblScore;
    document.getElementById('ng-lbl-target').textContent = t.lblTarget;
    document.getElementById('ng-title-right').textContent = t.titleRight;
    document.getElementById('ng-sub-right').textContent = t.subRight;
    document.getElementById('ng-upgrade-heading').textContent = t.upgradeHeading;
    document.getElementById('ng-vice-tag').textContent = t.viceTag;
    document.getElementById('ng-vice-title').textContent = t.viceTitle;
    document.getElementById('ng-vice-desc').textContent = t.viceDesc;
    document.getElementById('ng-vice-cta').textContent = t.viceCta;
    document.getElementById('ng-storage-val').textContent = `${freeGb} ${t.freeSuffix}`;

    let score = 95;
    let targetFps = '1440p–4K / 60fps';
    let targetTier = 'Performance / VRR';
    const findings = [];

    let needsSsd = false;
    let needsTv = false;
    let needsGpu = false;

    if (plat === 'ps5-pro') {
      score = 100;
      targetFps = '4K PSSR / 60fps RT';
      targetTier = 'Flagship Console';
      findings.push({ type: 'ok', text: t.msgPs5Pro });
    } else if (plat === 'ps5-base' || plat === 'xbox-x') {
      score = 88;
      targetFps = '1440p–4K / 30–60fps';
      targetTier = 'Next-Gen Standard';
    } else if (plat === 'xbox-s') {
      score = 62;
      targetFps = '1080p / 30fps';
      targetTier = 'Entry Next-Gen';
      findings.push({ type: 'warn', text: t.msgSeriesS });
    } else if (isPc) {
      const vram = parseInt(vramEl.value, 10);
      const ram = parseInt(ramEl.value, 10);
      const pcSsd = pcSsdEl.value;
      score = 92;
      targetFps = '1440p / 60–90fps';
      targetTier = 'DLSS / FSR Ready';

      if (vram < 12) {
        score -= vram <= 6 ? 32 : 16;
        needsGpu = true;
        targetFps = vram <= 6 ? '1080p Low / 30fps' : '1080p–1440p / 45–60fps';
        findings.push({ type: 'crit', text: t.msgPcVramCrit.replace('{vram}', vram) });
      }
      if (ram < 16) {
        score -= 14;
        findings.push({ type: 'warn', text: t.msgPcRamCrit });
      }
      if (pcSsd === 'hdd') {
        score -= 22;
        needsSsd = true;
        findings.push({ type: 'crit', text: t.msgPcHddCrit });
      } else if (pcSsd === 'gen3') {
        score -= 5;
      }
    }

    if (freeGb < 180) {
      score -= freeGb < 100 ? 24 : 14;
      needsSsd = true;
      findings.push({ type: 'crit', text: t.msgStorageCrit.replace('{gb}', freeGb) });
    } else {
      findings.push({ type: 'ok', text: t.msgStorageOk.replace('{gb}', freeGb) });
    }

    if (disp === 'tv-60') {
      score -= 12;
      needsTv = true;
      findings.push({ type: 'warn', text: t.msgTv60 });
    } else {
      findings.push({ type: 'ok', text: t.msgTvOk });
    }

    score = Math.max(15, Math.min(100, score));

    const scoreEl = document.getElementById('ng-out-score');
    const verdictEl = document.getElementById('ng-out-verdict');
    const barEl = document.getElementById('ng-score-bar');

    scoreEl.textContent = `${score}%`;
    document.getElementById('ng-out-fps').textContent = targetFps;
    document.getElementById('ng-out-tier').textContent = targetTier;
    barEl.style.width = `${score}%`;

    if (score >= 82) {
      verdictEl.textContent = t.verdictGreat;
      barEl.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
    } else if (score >= 58) {
      verdictEl.textContent = t.verdictGood;
      barEl.style.background = 'linear-gradient(90deg, #f59e0b, #10b981)';
    } else {
      verdictEl.textContent = t.verdictWarn;
      barEl.style.background = 'linear-gradient(90deg, #f43f5e, #f59e0b)';
    }

    const listEl = document.getElementById('ng-bottleneck-list');
    listEl.innerHTML = findings
      .map((f) => `<li class="bottleneck-item ${f.type === 'ok' ? 'ok' : f.type === 'warn' ? 'warn' : ''}">${f.text}</li>`)
      .join('');

    const cards = getAffiliateCards(
      needsSsd,
      needsTv,
      needsGpu,
      plat === 'ps5-base' || plat === 'ps5-pro',
      plat === 'xbox-s' || plat === 'xbox-x'
    );

    const gridEl = document.getElementById('ng-affiliate-grid');
    gridEl.innerHTML = cards
      .map(
        (c) => `
      <div class="affiliate-card ${c.priority ? 'priority' : ''}">
        <div>
          ${c.bfDeal ? `<span class="bf-deal-badge">${t.bfBadge}</span>` : ''}
          <h4>${c.title}</h4>
          <p>${c.desc}</p>
        </div>
        <div class="affiliate-actions">
          <a href="${c.amz}" target="_blank" rel="noopener sponsored" class="btn-amz">${t.amzBtn}</a>
          <a href="${c.ml}" target="_blank" rel="noopener sponsored" class="btn-ml">${t.mlBtn}</a>
        </div>
      </div>
    `
      )
      .join('');
  }

  langBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      langBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      lang = btn.getAttribute('data-lang') || 'en';
      renderNextGen();
    });
  });

  [platformEl, vramEl, ramEl, pcSsdEl, displayEl, storageEl].forEach((el) => {
    el.addEventListener('input', renderNextGen);
    el.addEventListener('change', renderNextGen);
  });

  renderNextGen();
}

// ----------------------------------------------------------------------------
// TOOL 6: VICE MIAMI PACK STUDIO (PREMIERE / CAPCUT / DAVINCI / PHOTOSHOP)
// ----------------------------------------------------------------------------
function initVicePackStudio() {
  const presetEl = document.getElementById('vp-preset');
  const mainTextEl = document.getElementById('vp-main-text');
  const subTextEl = document.getElementById('vp-sub-text');
  const starsEl = document.getElementById('vp-stars');
  const starsValEl = document.getElementById('vp-stars-val');
  const cashEl = document.getElementById('vp-cash');
  const bgModeEl = document.getElementById('vp-bg-mode');
  const canvas = document.getElementById('vp-canvas');
  const ctx = canvas.getContext('2d');
  const statusEl = document.getElementById('vp-export-status');

  let userBgImg = null;

  const presetDefaults = {
    wasted: { main: 'WASTED', sub: 'PERDEU TUDO NA FUGA DE LEONIDA' },
    'wanted-hud': { main: 'LEONIDA HEIST', sub: 'ESCAPE THE 6-STAR CHASE' },
    'lower-third': { main: 'LEONIDA BREAKING NEWS', sub: 'VICE MIAMI POLICE CHASE LIVE ON I-95' },
    'thumb-neon': { main: 'VICE MIAMI', sub: '6 STARS IN 60 SECONDS' }
  };

  // Vector Star Path Helper (crisp HUD stars with thick outline)
  function drawStar(c, cx, cy, outerR, innerR, fill, stroke, glowColor) {
    c.save();
    c.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (Math.PI / 5) * i - Math.PI / 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) c.moveTo(x, y);
      else c.lineTo(x, y);
    }
    c.closePath();
    if (glowColor) {
      c.shadowColor = glowColor;
      c.shadowBlur = outerR * 0.65;
    }
    c.fillStyle = fill;
    c.fill();
    c.shadowBlur = 0;
    c.lineWidth = Math.max(2, outerR * 0.16);
    c.strokeStyle = stroke;
    c.stroke();
    c.restore();
  }

  // Vector Palm Silhouette Helper for Synthwave Scene
  function drawPalmTree(c, baseX, baseY, scale, flip) {
    c.save();
    c.translate(baseX, baseY);
    c.scale(flip ? -scale : scale, scale);
    c.fillStyle = '#070312';

    // Curved trunk
    c.beginPath();
    c.moveTo(-12, 0);
    c.quadraticCurveTo(15, -140, 48, -260);
    c.lineTo(62, -258);
    c.quadraticCurveTo(32, -140, 12, 0);
    c.closePath();
    c.fill();

    // Fronds
    const fronds = [
      { ang: -2.6, len: 130, curve: 38 },
      { ang: -2.0, len: 145, curve: 32 },
      { ang: -1.2, len: 135, curve: 26 },
      { ang: -0.4, len: 145, curve: 34 },
      { ang: 0.25, len: 125, curve: 42 },
      { ang: 0.85, len: 105, curve: 36 }
    ];
    fronds.forEach((f) => {
      c.save();
      c.translate(54, -256);
      c.rotate(f.ang);
      c.beginPath();
      c.moveTo(0, 0);
      c.quadraticCurveTo(f.len * 0.5, -f.curve, f.len, 16);
      c.quadraticCurveTo(f.len * 0.5, -f.curve * 0.25, 0, 10);
      c.closePath();
      c.fill();
      c.restore();
    });
    c.restore();
  }

  // Outrun Sliced Sun + Palms + Perspective Grid Background
  function drawViceMiamiScene(c, w, h) {
    const sky = c.createLinearGradient(0, 0, 0, h * 0.68);
    sky.addColorStop(0, '#090218');
    sky.addColorStop(0.45, '#3b0764');
    sky.addColorStop(0.82, '#be185d');
    sky.addColorStop(1, '#fb923c');
    c.fillStyle = sky;
    c.fillRect(0, 0, w, h);

    // Outrun Sun with horizontal slice cutouts
    const sunX = w * 0.5;
    const sunY = h * 0.42;
    const sunR = h * 0.27;
    const sunGrad = c.createLinearGradient(0, sunY - sunR, 0, sunY + sunR);
    sunGrad.addColorStop(0, '#fef08a');
    sunGrad.addColorStop(0.5, '#fb923c');
    sunGrad.addColorStop(1, '#ec4899');

    c.save();
    c.beginPath();
    c.arc(sunX, sunY, sunR, 0, Math.PI * 2);
    c.clip();
    c.fillStyle = sunGrad;
    c.fillRect(sunX - sunR, sunY - sunR, sunR * 2, sunR * 2);
    // Retro scanline slices in lower half of sun
    c.fillStyle = '#3b0764';
    for (let i = 0; i < 6; i++) {
      const sliceY = sunY + sunR * (0.1 + i * 0.14);
      const sliceH = 3 + i * 2.5;
      c.fillRect(sunX - sunR, sliceY, sunR * 2, sliceH);
    }
    c.restore();

    // Horizon Glow + Neon Grid Floor
    const horizon = h * 0.64;
    c.fillStyle = '#060312';
    c.fillRect(0, horizon, w, h - horizon);

    c.save();
    c.strokeStyle = 'rgba(34, 211, 238, 0.55)';
    c.lineWidth = Math.max(1.5, w * 0.0018);
    c.shadowColor = '#22d3ee';
    c.shadowBlur = 10;
    for (let i = -14; i <= 14; i++) {
      c.beginPath();
      c.moveTo(w / 2 + i * (w * 0.032), horizon);
      c.lineTo(w / 2 + i * (w * 0.15), h);
      c.stroke();
    }
    for (let step = 0; step < 9; step++) {
      const t = step / 8;
      const y = horizon + Math.pow(t, 1.9) * (h - horizon);
      c.beginPath();
      c.moveTo(0, y);
      c.lineTo(w, y);
      c.stroke();
    }
    c.restore();

    // Distant City Skyline Silhouette
    c.fillStyle = '#090418';
    const bWidths = [42, 28, 55, 34, 68, 30, 48, 60, 38, 52, 44, 64, 32, 50];
    let bx = 0;
    let bi = 0;
    while (bx < w) {
      const bw = (bWidths[bi % bWidths.length] / 960) * w;
      const bh = ((35 + ((bi * 37) % 85)) / 540) * h;
      c.fillRect(bx, horizon - bh, bw - 2, bh);
      bx += bw;
      bi++;
    }

    // Framing Palm Trees
    drawPalmTree(c, w * 0.08, h * 0.92, h / 460, false);
    drawPalmTree(c, w * 0.92, h * 0.94, h / 440, true);
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
  }

  presetEl.addEventListener('change', () => {
    const def = presetDefaults[presetEl.value];
    if (def) {
      mainTextEl.value = def.main;
      subTextEl.value = def.sub;
    }
    if (presetEl.value === 'thumb-neon' && bgModeEl.value === 'alpha') {
      bgModeEl.value = 'scene';
    }
    drawViceFrame(ctx, canvas.width, canvas.height, 1.0);
  });

  // progress: 0..1 during 3s animation, or 1.0 for static high-res frame
  function drawViceFrame(c, w, h, progress) {
    const preset = presetEl.value;
    const bgMode = bgModeEl.value;
    const isAlpha = bgMode === 'alpha';
    const mainTxt = (mainTextEl.value || 'WASTED').toUpperCase();
    const subTxt = (subTextEl.value || '').toUpperCase();
    const stars = parseInt(starsEl.value, 10) || 6;
    const cashTxt = cashEl.value || '$999,999';

    starsValEl.textContent = `${stars} ★`;
    c.clearRect(0, 0, w, h);

    // 1. Background Layer
    if (bgMode === 'greenscreen') {
      c.fillStyle = '#00FF00';
      c.fillRect(0, 0, w, h);
    } else if (bgMode === 'scene') {
      if (userBgImg) {
        c.save();
        if (preset === 'wasted') {
          c.filter = 'grayscale(85%) contrast(1.28) brightness(0.68)';
        }
        c.drawImage(userBgImg, 0, 0, w, h);
        c.restore();
      } else {
        drawViceMiamiScene(c, w, h);
      }
    }

    const pulse = 0.5 + 0.5 * Math.sin(progress * Math.PI * 6);
    const enterT = easeOutCubic(Math.min(1, progress * 3.5)); // First ~0.85s entrance

    // 2. Preset Renderers
    if (preset === 'wasted') {
      // Camera punch zoom + micro-shake during entrance
      const shakeX = progress < 0.35 ? (Math.sin(progress * 90) * (w * 0.008) * (1 - progress * 2.8)) : 0;
      const shakeY = progress < 0.35 ? (Math.cos(progress * 110) * (h * 0.008) * (1 - progress * 2.8)) : 0;
      const zoom = 1.18 - 0.18 * enterT;

      c.save();
      c.translate(w / 2 + shakeX, h / 2 + shakeY);
      c.scale(zoom, zoom);
      c.translate(-w / 2, -h / 2);

      // Red/Blue Siren Vignette (only on scene mode so Chroma Key stays clean)
      if (bgMode === 'scene') {
        const redGlow = c.createRadialGradient(w * 0.18, h * 0.5, 10, w * 0.18, h * 0.5, w * 0.6);
        redGlow.addColorStop(0, `rgba(244, 63, 94, ${0.28 + pulse * 0.2})`);
        redGlow.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = redGlow;
        c.fillRect(0, 0, w, h);

        const blueGlow = c.createRadialGradient(w * 0.82, h * 0.5, 10, w * 0.82, h * 0.5, w * 0.6);
        blueGlow.addColorStop(0, `rgba(34, 211, 238, ${0.24 + (1 - pulse) * 0.2})`);
        blueGlow.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = blueGlow;
        c.fillRect(0, 0, w, h);
      }

      // Letterbox Center Band with Neon Accent Borders
      const bandH = h * 0.32;
      const bandY = (h - bandH) / 2;
      const bandGrad = c.createLinearGradient(0, bandY, 0, bandY + bandH);
      bandGrad.addColorStop(0, 'rgba(8, 10, 18, 0.94)');
      bandGrad.addColorStop(0.5, 'rgba(15, 18, 30, 0.96)');
      bandGrad.addColorStop(1, 'rgba(8, 10, 18, 0.94)');
      c.fillStyle = bandGrad;
      c.fillRect(0, bandY, w, bandH);

      c.fillStyle = '#f43f5e';
      c.fillRect(0, bandY, w, Math.max(3, h * 0.006));
      c.fillStyle = '#22d3ee';
      c.fillRect(0, bandY + bandH - Math.max(3, h * 0.006), w, Math.max(3, h * 0.006));

      // Chromatic Aberration (RGB Split) + Thick Black Outline on Headline
      const fontPx = Math.round(h * 0.175);
      c.font = `900 ${fontPx}px "Anton", Impact, "Arial Black", sans-serif`;
      c.textAlign = 'center';
      c.textBaseline = 'middle';

      const rgbOffset = Math.max(3, w * 0.0045);
      c.fillStyle = 'rgba(34, 211, 238, 0.78)';
      c.fillText(mainTxt, w / 2 - rgbOffset, h / 2 - h * 0.032);
      c.fillStyle = 'rgba(244, 63, 94, 0.82)';
      c.fillText(mainTxt, w / 2 + rgbOffset, h / 2 - h * 0.028);

      c.lineWidth = Math.max(6, fontPx * 0.09);
      c.strokeStyle = '#000000';
      c.strokeText(mainTxt, w / 2, h / 2 - h * 0.03);

      const txtGrad = c.createLinearGradient(0, h * 0.38, 0, h * 0.54);
      txtGrad.addColorStop(0, '#ffffff');
      txtGrad.addColorStop(0.55, '#fda4af');
      txtGrad.addColorStop(1, '#f43f5e');
      c.fillStyle = txtGrad;
      c.fillText(mainTxt, w / 2, h / 2 - h * 0.03);

      // Subtitle
      const subPx = Math.round(h * 0.044);
      c.font = `800 ${subPx}px "Bebas Neue", Inter, Arial, sans-serif`;
      c.lineWidth = Math.max(3, subPx * 0.14);
      c.strokeStyle = '#000000';
      c.strokeText(subTxt, w / 2, h / 2 + h * 0.088);
      c.fillStyle = '#f8fafc';
      c.fillText(subTxt, w / 2, h / 2 + h * 0.088);
      c.restore();
    } else if (preset === 'wanted-hud') {
      const pad = w * 0.045;
      // Animated Cash Counter & Sequential Stars during WebM
      const activeStars = progress < 0.9 ? Math.max(1, Math.ceil(stars * Math.min(1, progress * 1.6))) : stars;

      c.save();
      // Top-Right Cash HUD (JetBrains Mono + Thick Stroke)
      c.textAlign = 'right';
      const cashPx = Math.round(h * 0.085);
      c.font = `800 ${cashPx}px "JetBrains Mono", "Courier New", monospace`;
      c.lineWidth = Math.max(5, cashPx * 0.14);
      c.strokeStyle = '#020617';
      c.strokeText(cashTxt, w - pad, pad + cashPx * 0.85);
      c.fillStyle = '#4ade80';
      c.fillText(cashTxt, w - pad, pad + cashPx * 0.85);

      // 6 Vector Stars with Outer Black Outline & Gold Gradient
      const starR = h * 0.033;
      const starGap = starR * 2.35;
      const starY = pad + cashPx * 1.48;
      for (let i = 0; i < 6; i++) {
        const sx = w - pad - starR - (5 - i) * starGap;
        const isLit = i < activeStars;
        const isBlink = isLit && (i === activeStars - 1 ? pulse > 0.35 : true);
        drawStar(
          c,
          sx,
          starY,
          starR,
          starR * 0.44,
          isBlink ? '#facc15' : 'rgba(15, 23, 42, 0.72)',
          '#000000',
          isBlink ? '#f59e0b' : null
        );
      }

      // Top-Left Mission / District Badge (Slide in from left)
      const slideX = -w * 0.4 * (1 - enterT);
      const boxW = w * 0.36;
      const boxH = h * 0.115;
      c.translate(slideX, 0);
      c.fillStyle = 'rgba(10, 14, 26, 0.92)';
      c.fillRect(pad, pad, boxW, boxH);
      c.fillStyle = '#ec4899';
      c.fillRect(pad, pad, Math.max(6, w * 0.008), boxH);
      c.strokeStyle = 'rgba(255,255,255,0.18)';
      c.lineWidth = 2;
      c.strokeRect(pad, pad, boxW, boxH);

      c.textAlign = 'left';
      c.fillStyle = '#22d3ee';
      c.font = `900 ${Math.round(h * 0.04)}px "Bebas Neue", Inter, sans-serif`;
      c.fillText(mainTxt, pad + w * 0.02, pad + h * 0.052);
      c.fillStyle = '#f1f5f9';
      c.font = `700 ${Math.round(h * 0.025)}px Inter, sans-serif`;
      c.fillText(subTxt.slice(0, 34), pad + w * 0.02, pad + h * 0.09);
      c.restore();
    } else if (preset === 'lower-third') {
      const boxW = w * 0.88;
      const boxH = h * 0.19;
      const boxX = w * 0.06 - (w * 0.95) * (1 - enterT);
      const boxY = h * 0.74;

      c.save();
      // Skewed Broadcast Card
      c.fillStyle = 'rgba(9, 13, 24, 0.94)';
      c.fillRect(boxX, boxY, boxW, boxH);

      // Neon Vice Gradient Top & Left Bar
      const neonGrad = c.createLinearGradient(boxX, boxY, boxX + boxW, boxY);
      neonGrad.addColorStop(0, '#ec4899');
      neonGrad.addColorStop(0.5, '#a855f7');
      neonGrad.addColorStop(1, '#22d3ee');
      c.fillStyle = neonGrad;
      c.fillRect(boxX, boxY, Math.max(8, w * 0.01), boxH);
      c.fillRect(boxX, boxY + boxH - Math.max(4, h * 0.008), boxW, Math.max(4, h * 0.008));

      // Pulsing BREAKING / LIVE Pill
      const pillW = w * 0.11;
      const pillH = h * 0.048;
      c.fillStyle = pulse > 0.45 ? '#f43f5e' : '#be123c';
      c.fillRect(boxX + w * 0.025, boxY + h * 0.026, pillW, pillH);
      c.fillStyle = '#ffffff';
      c.font = `800 ${Math.round(h * 0.026)}px "JetBrains Mono", monospace`;
      c.textAlign = 'center';
      c.fillText('● LIVE', boxX + w * 0.025 + pillW / 2, boxY + h * 0.059);

      // Headline & Subheadline
      c.textAlign = 'left';
      c.fillStyle = '#22d3ee';
      c.font = `900 ${Math.round(h * 0.056)}px "Bebas Neue", Inter, sans-serif`;
      c.fillText(mainTxt, boxX + w * 0.15, boxY + h * 0.068);

      c.fillStyle = '#f8fafc';
      c.font = `700 ${Math.round(h * 0.042)}px Inter, Arial, sans-serif`;
      c.fillText(subTxt, boxX + w * 0.025, boxY + boxH - h * 0.04);
      c.restore();
    } else if (preset === 'thumb-neon') {
      // Authentic Vice Miami Dual-Font Thumbnail Lockup (Anton + Yellowtail Script)
      c.save();
      c.textAlign = 'center';

      // Main Condensed Title with Thick Black Outline & Sunset Gradient
      const mainPx = Math.round(h * 0.21);
      c.font = `900 ${mainPx}px "Anton", Impact, "Arial Black", sans-serif`;
      c.lineWidth = Math.max(8, mainPx * 0.11);
      c.strokeStyle = '#090218';
      c.shadowColor = 'rgba(0, 0, 0, 0.9)';
      c.shadowBlur = 20;
      c.strokeText(mainTxt, w / 2, h * 0.44);

      const titleGrad = c.createLinearGradient(0, h * 0.28, 0, h * 0.48);
      titleGrad.addColorStop(0, '#ffffff');
      titleGrad.addColorStop(0.55, '#fde047');
      titleGrad.addColorStop(1, '#fb923c');
      c.shadowColor = '#ec4899';
      c.shadowBlur = 24;
      c.fillStyle = titleGrad;
      c.fillText(mainTxt, w / 2, h * 0.44);

      // Cursive Neon Script Subtitle (Yellowtail)
      const subPx = Math.round(h * 0.095);
      c.font = `400 ${subPx}px "Yellowtail", cursive, sans-serif`;
      c.lineWidth = Math.max(5, subPx * 0.12);
      c.strokeStyle = '#090218';
      c.shadowColor = '#ec4899';
      c.shadowBlur = 26;
      c.strokeText(subTxt, w / 2, h * 0.61);
      c.fillStyle = '#f472b6';
      c.fillText(subTxt, w / 2, h * 0.61);
      c.restore();
    }
  }

  function redrawStatic() {
    drawViceFrame(ctx, canvas.width, canvas.height, 1.0);
  }

  [presetEl, mainTextEl, subTextEl, starsEl, cashEl, bgModeEl].forEach((el) => {
    el.addEventListener('input', redrawStatic);
    el.addEventListener('change', redrawStatic);
  });

  const dropzone = document.getElementById('vp-dropzone');
  const fileInput = document.getElementById('vp-file-input');
  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('dragover', (e) => e.preventDefault());
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) loadVpImage(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files[0]) loadVpImage(fileInput.files[0]);
  });

  function loadVpImage(file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        userBgImg = img;
        bgModeEl.value = 'scene';
        redrawStatic();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Export High-Res 1920x1080 PNG
  document.getElementById('btn-vp-download-png').addEventListener('click', () => {
    const hiCanvas = document.createElement('canvas');
    hiCanvas.width = 1920;
    hiCanvas.height = 1080;
    const hctx = hiCanvas.getContext('2d');
    drawViceFrame(hctx, 1920, 1080, 1.0);

    const link = document.createElement('a');
    link.download = `vice-miami-${presetEl.value}-1080p.png`;
    link.href = hiCanvas.toDataURL('image/png');
    link.click();
    statusEl.textContent = '✓ Exported 1920×1080 PNG! Ready for Premiere, CapCut, DaVinci, Photoshop & OBS.';
  });

  // Export 3-Second Animated WebM Loop (with Zoom, Shake, Slide-In & Chroma Key support)
  document.getElementById('btn-vp-export-webm').addEventListener('click', () => {
    if (typeof canvas.captureStream !== 'function' || typeof MediaRecorder === 'undefined') {
      statusEl.textContent = '⚠️ WebM recording not supported in this browser. Use PNG or SVG export.';
      return;
    }
    const stream = canvas.captureStream(30);
    const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
    const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 6000000 });
    const chunks = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vice-miami-${presetEl.value}-${bgModeEl.value}-3s.webm`;
      a.click();
      statusEl.textContent = bgModeEl.value === 'greenscreen'
        ? '✓ Exported Green Screen WebM! In CapCut/Premiere apply Chroma Key (#00FF00).'
        : '✓ Exported 3s Animated WebM! Import into Premiere, CapCut or DaVinci Resolve.';
    };

    statusEl.textContent = '⏳ Rendering 3-second 30fps animation (Zoom + Slide-In + Glow)...';
    recorder.start();
    const start = performance.now();
    const duration = 3000;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      drawViceFrame(ctx, canvas.width, canvas.height, progress);
      if (elapsed < duration) {
        requestAnimationFrame(tick);
      } else {
        recorder.stop();
        redrawStatic();
      }
    }
    requestAnimationFrame(tick);
  });

  // Export Editable Vector SVG (Illustrator / Photoshop / Canva / Figma)
  document.getElementById('btn-vp-download-svg').addEventListener('click', () => {
    const mainTxt = (mainTextEl.value || 'WASTED').replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const subTxt = (subTextEl.value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const cashTxt = (cashEl.value || '$999,999').replace(/&/g, '&amp;');
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="viceSunset" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="55%" stop-color="#fde047"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
    <linearGradient id="neonBar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ec4899"/>
      <stop offset="50%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#22d3ee"/>
    </linearGradient>
  </defs>
  <g id="Layer_Background_Band">
    <rect x="0" y="360" width="1920" height="340" fill="#0b0f19" fill-opacity="0.92"/>
    <rect x="0" y="360" width="1920" height="8" fill="url(#neonBar)"/>
    <rect x="0" y="692" width="1920" height="8" fill="url(#neonBar)"/>
  </g>
  <g id="Layer_HUD_Cash">
    <text x="1840" y="130" text-anchor="end" font-family="monospace" font-weight="900" font-size="78" fill="#4ade80" stroke="#000" stroke-width="10" paint-order="stroke">${cashTxt}</text>
  </g>
  <g id="Layer_Main_Text">
    <text x="960" y="545" text-anchor="middle" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="180" fill="url(#viceSunset)" stroke="#000" stroke-width="18" paint-order="stroke">${mainTxt}</text>
    <text x="960" y="635" text-anchor="middle" font-family="Arial, sans-serif" font-weight="800" font-size="48" fill="#f8fafc" stroke="#000" stroke-width="8" paint-order="stroke">${subTxt}</text>
  </g>
</svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vice-miami-${presetEl.value}-editable.svg`;
    a.click();
    statusEl.textContent = '✓ Exported Editable Vector .SVG! Open directly in Illustrator, Photoshop, Figma or Canva.';
  });

  // Export Universal 3D LUT (.CUBE)
  document.getElementById('btn-vp-download-lut').addEventListener('click', () => {
    const size = 17;
    const lines = [
      'TITLE "Vice_Miami_Neon_Sunset_2026"',
      `LUT_3D_SIZE ${size}`,
      'DOMAIN_MIN 0.0 0.0 0.0',
      'DOMAIN_MAX 1.0 1.0 1.0'
    ];
    for (let b = 0; b < size; b++) {
      for (let g = 0; g < size; g++) {
        for (let r = 0; r < size; r++) {
          const rn = r / (size - 1);
          const gn = g / (size - 1);
          const bn = b / (size - 1);
          const lum = 0.2126 * rn + 0.7152 * gn + 0.0722 * bn;
          const rOut = Math.min(1, Math.max(0, rn * 1.12 + (lum > 0.5 ? 0.07 : -0.04)));
          const gOut = Math.min(1, Math.max(0, gn * 0.94 + (lum < 0.4 ? 0.04 : 0.0)));
          const bOut = Math.min(1, Math.max(0, bn * 1.09 + (lum < 0.45 ? 0.09 : 0.02)));
          lines.push(`${rOut.toFixed(6)} ${gOut.toFixed(6)} ${bOut.toFixed(6)}`);
        }
      }
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Vice_Miami_Neon_Sunset_2026.cube';
    a.click();
    statusEl.textContent = '✓ Downloaded .CUBE LUT! Works in Premiere, CapCut, DaVinci, Final Cut, Vegas & Lightroom.';
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(redrawStatic);
  }
  redrawStatic();
}
