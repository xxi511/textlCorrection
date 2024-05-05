// Called when the user clicks on the page action.
chrome.action.onClicked.addListener(function(tab) {
    chrome.scripting.executeScript({
        target: {tabId: tab.id, allFrames: true},
        files: ["execute.js"],
    });
});

// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(removeOldRule);

function removeOldRule() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, setNewRule);
}

function setNewRule() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
        {
            // That fires when a page's URL contains a 'g' ...
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        hostEquals: "woodo.club",
                        urlContains: "action",
                    },
                }),
            ],
            // And shows the extension's page action.
            actions: [new chrome.declarativeContent.ShowPageAction()],
        },
    ]);
}


