chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'searchInbox') {
        // This would need to be implemented with actual Fiverr API interaction
        // For now, we'll simulate searching the page
        const messages = document.querySelectorAll('.message-item');
        const results = [];
        
        messages.forEach(message => {
            if (message.textContent.toLowerCase().includes(request.query.toLowerCase())) {
                results.push(message.textContent);
            }
        });
        
        sendResponse({results: results});
    } else if (request.action === 'sendMessage') {
        // This would need to be implemented to actually send messages on Fiverr
        console.log('Sending message:', request.message);
        // In a real implementation, you'd interact with Fiverr's message interface
        sendResponse({success: true});
    }
    return true;
});

// Function to simulate inbox search (would be replaced with actual API calls)
function searchFiverrInbox(query) {
    chrome.runtime.sendMessage({
        action: 'searchInbox',
        query: query
    }, (response) => {
        if (response && response.results) {
            console.log('Search results:', response.results);
        }
    });
}