const statusMsg = document.getElementById('status-msg');

async function sendToActiveTab(action) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) {
    statusMsg.textContent = 'No active tab detected.';
    return;
  }
  chrome.tabs.sendMessage(tab.id, { action }, (response) => {
    if (chrome.runtime.lastError) {
      statusMsg.textContent = 'Refresh the tab once to activate DOM helper.';
      return;
    }
    if (response && response.message) {
      statusMsg.textContent = response.message;
    }
  });
}

document.getElementById('btn-export-images').addEventListener('click', () => sendToActiveTab('EXPORT_IMAGES'));
document.getElementById('btn-export-tables').addEventListener('click', () => sendToActiveTab('EXPORT_TABLES'));
document.getElementById('btn-toggle-safezone').addEventListener('click', () => sendToActiveTab('TOGGLE_SAFEZONE'));
document.getElementById('btn-audit-headings').addEventListener('click', () => sendToActiveTab('AUDIT_SEO'));
