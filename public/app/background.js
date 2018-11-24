/*global chrome*/
chrome.tabs.onActivated.addListener(tab => {});

chrome.tabs.onRemoved.addListener(tab => {});

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.type == "ClickedItem") {
    chrome.tabs.update({
      url: "https://search.naver.com/search.naver?query=" + msg.item
    });
  }
});
