document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');
    
    toggleButton.addEventListener('click', async () => {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab || !tab.id) {
                console.error('No active tab found');
                return;
            }

            if (tab.url?.startsWith('chrome://')) {
                alert('Cannot run on Chrome pages');
                return;
            }

            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    const event = new CustomEvent('toggleCopilotSidebar');
                    document.dispatchEvent(event);
                }
            });
        } catch (error) {
            console.error('Error:', error);
        }
    });
});