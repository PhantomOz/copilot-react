chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'generateContent') {
        chrome.runtime.sendNativeMessage(
            'com.google.chrome.generative_content',
            { prompt: message.prompt },
            (response) => {
                sendResponse(response);
            }
        );
        return true; // Required for async response
    }
});

chrome.action.onClicked.addListener((tab) => {
    chrome.sidePanel.open({ windowId: tab.windowId });
}); 