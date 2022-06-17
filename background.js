chrome.tabs.onUpdated.addListener((_, changeInfo, tab) => {
  closeTab(changeInfo, tab);
});

async function closeTab(changeInfo, tab) {
  const blockedUrls = await getBlockList();
  if (changeInfo.status !== "loading" || !match(tab.url, blockedUrls)) return;
  const tabs = await chrome.tabs.query({});
  if (tabs.length === 1) await chrome.tabs.create({});
  chrome.tabs.remove(tab.id);
}

function match(url, urls) {
  for (var item of urls) {
    if (url.includes(item)) return true;
  }
  return false;
}

async function getBlockList() {
  const result = await chrome.storage.local.get(["blockList"]);
  var blockList = result.blockList;
  if (
    !blockList ||
    blockList == undefined ||
    blockList.length == 0 ||
    !Array.isArray(blockList)
  ) {
    blockList = [];
  }
  return blockList.sort();
}
