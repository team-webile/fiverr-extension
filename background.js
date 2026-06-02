chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('checkInbox', { periodInMinutes: 60 });
  
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkInbox') {
      checkFiverrInbox();
    }
  });
});

async function checkFiverrInbox() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url.includes('fiverr.com')) return;
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      // Check for new messages and trigger scheduled messages
      console.log('Fiverr Automation: Checking inbox...');
      // This will be enhanced with actual Fiverr API interaction
    }
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scheduleMessage') {
    scheduleMessage(request.message, request.recipient, request.time);
    sendResponse({ success: true });
  }
  return true;
});

async function scheduleMessage(message, recipient, time) {
  // Store scheduled message
  const scheduledMessages = await chrome.storage.local.get('scheduledMessages') || {};
  const messageId = Date.now();
  scheduledMessages[messageId] = { message, recipient, time, sent: false };
  await chrome.storage.local.set({ scheduledMessages });
  
  // Set alarm for scheduled time
  const alarmTime = new Date(time).getTime();
  chrome.alarms.create(`message_${messageId}`, { when: alarmTime });
  
  console.log('Message scheduled:', { message, recipient, time });
}