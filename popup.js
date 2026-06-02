document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('searchBtn');
  const scheduleBtn = document.getElementById('scheduleBtn');
  const scheduledMessagesDiv = document.getElementById('scheduledMessages');
  
  // Load and display scheduled messages
  loadScheduledMessages();
  
  searchBtn.addEventListener('click', () => {
    const query = document.getElementById('searchQuery').value;
    if (query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'searchInbox',
          query: query
        });
      });
    }
  });
  
  scheduleBtn.addEventListener('click', () => {
    const recipient = document.getElementById('recipient').value;
    const message = document.getElementById('message').value;
    const time = document.getElementById('scheduleTime').value;
    
    if (recipient && message && time) {
      chrome.runtime.sendMessage({
        action: 'scheduleMessage',
        message: message,
        recipient: recipient,
        time: time
      });
      
      // Clear form
      document.getElementById('recipient').value = '';
      document.getElementById('message').value = '';
      document.getElementById('scheduleTime').value = '';
      
      // Reload scheduled messages
      loadScheduledMessages();
    }
  });
  
  function loadScheduledMessages() {
    chrome.storage.local.get('scheduledMessages', (result) => {
      const messages = result.scheduledMessages || {};
      scheduledMessagesDiv.innerHTML = '';
      
      Object.entries(messages).forEach(([id, msg]) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message-item';
        msgDiv.innerHTML = `
          <strong>To: ${msg.recipient}</strong><br>
          <em>Scheduled: ${new Date(msg.time).toLocaleString()}</em><br>
          ${msg.message}
        `;
        scheduledMessagesDiv.appendChild(msgDiv);
      });
    });
  }
});