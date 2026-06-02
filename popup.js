document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('searchBtn');
  const scheduleBtn = document.getElementById('scheduleBtn');
  const scheduledMessagesDiv = document.getElementById('scheduledMessages');
  
  // Load and display scheduled messages
  loadScheduledMessages();
  
  // Check if the extension is properly loaded
  chrome.runtime.getBackgroundPage((backgroundPage) => {
    if (chrome.runtime.lastError) {
      console.error('Error connecting to background:', chrome.runtime.lastError.message);
      return;
    }
  });
  
  searchBtn.addEventListener('click', () => {
    const query = document.getElementById('searchQuery').value;
    if (query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'searchInbox',
            query: query
          }, (response) => {
            if (chrome.runtime.lastError) {
              console.error('Error sending message to tab:', chrome.runtime.lastError.message);
            }
          });
        }
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
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message to background:', chrome.runtime.lastError.message);
        } else {
          // Clear form
          document.getElementById('recipient').value = '';
          document.getElementById('message').value = '';
          document.getElementById('scheduleTime').value = '';
          
          // Reload scheduled messages
          loadScheduledMessages();
        }
      });
    }
  });
  
  function loadScheduledMessages() {
    chrome.storage.local.get('scheduledMessages', (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error accessing storage:', chrome.runtime.lastError.message);
        return;
      }
      
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