chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.action === 'EXPORT_IMAGES') {
    const imgs = Array.from(document.querySelectorAll('img'))
      .filter((img) => (img.naturalWidth || img.width) >= 120)
      .map((img, i) => [i + 1, `"${(img.alt || '').replace(/"/g, '""')}"`, `${img.naturalWidth || img.width}x${img.naturalHeight || img.height}`, `"${img.src}"`]);

    const csv = ['Index,AltText,Dimensions,URL', ...imgs.map((r) => r.join(','))].join('\n');
    downloadCSV(csv, 'page-images-export.csv');
    sendResponse({ message: `✓ Exported ${imgs.length} images to CSV!` });
  } else if (req.action === 'EXPORT_TABLES') {
    const tables = Array.from(document.querySelectorAll('table'));
    const rows = [];
    tables.forEach((t, ti) => {
      t.querySelectorAll('tr').forEach((tr) => {
        const cols = Array.from(tr.querySelectorAll('th,td')).map((c) => `"${c.innerText.trim().replace(/"/g, '""')}"`);
        if (cols.length) rows.push([`Table_${ti + 1}`, ...cols].join(','));
      });
    });
    downloadCSV(rows.join('\n') || 'No tables found', 'page-tables-specs.csv');
    sendResponse({ message: `✓ Exported ${rows.length} table rows to CSV!` });
  } else if (req.action === 'TOGGLE_SAFEZONE') {
    const existing = document.getElementById('quickgrab-safezone-overlay');
    if (existing) {
      existing.remove();
      sendResponse({ message: 'Removed 9:16 Safe-Zone Overlay.' });
      return;
    }
    const overlay = document.createElement('div');
    overlay.id = 'quickgrab-safezone-overlay';
    overlay.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:340px;height:604px;border:3px solid #10b981;z-index:2147483647;pointer-events:none;box-shadow:0 0 0 9999px rgba(0,0,0,0.45);';
    overlay.innerHTML = `
      <div style="position:absolute;top:0;left:0;right:0;height:12%;background:rgba(244,63,94,0.42);color:#fff;font:bold 11px sans-serif;padding:6px;">⚠️ TOP UI BAR DANGER ZONE</div>
      <div style="position:absolute;bottom:22%;right:0;width:22%;height:42%;background:rgba(244,63,94,0.42);color:#fff;font:bold 10px sans-serif;padding:6px;">⚠️ ICONS</div>
      <div style="position:absolute;bottom:0;left:0;right:0;height:22%;background:rgba(244,63,94,0.42);color:#fff;font:bold 11px sans-serif;padding:8px;">⚠️ BOTTOM CAPTIONS & AUDIO BAR</div>
    `;
    document.body.appendChild(overlay);
    sendResponse({ message: '✓ Injected 9:16 Safe-Zone Overlay!' });
  } else if (req.action === 'AUDIT_SEO') {
    const title = document.title;
    const desc = document.querySelector('meta[name="description"]')?.content || 'No meta description';
    const headings = Array.from(document.querySelectorAll('h1,h2,h3')).map((h) => `${h.tagName}: ${h.innerText.trim()}`).join('\n');
    const summary = `URL: ${location.href}\nTitle (${title.length} chars): ${title}\nDescription (${desc.length} chars): ${desc}\n\nHeadings:\n${headings}`;
    navigator.clipboard.writeText(summary);
    sendResponse({ message: '✓ Copied SEO Audit to Clipboard!' });
  }
  return true;
});

function downloadCSV(content, filename) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
