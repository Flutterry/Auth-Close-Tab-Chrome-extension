
async function loadLastTenHostNamesFromHistory() {
  const hostNames = new Set();
  const items = await chrome.history.search({ text: "", maxResults: 10 });
  for (var i = 0; i < items.length; i++) {
    hostNames.add(new URL(items[i].url).hostname);
  }
  return Array.from(hostNames);
}

async function addToBlockList(name) {
  var blockList = await getBlockList();
  const list = new Set(blockList);
  list.add(name);

  await chrome.storage.local.set({ blockList: Array.from(list) });
}

async function removeFromBlockList(name) {
  var blockList = await getBlockList();
  var index = blockList.indexOf(name);
  if (index !== -1) {
    blockList.splice(index, 1);
    await chrome.storage.local.set({ blockList: blockList });
  }
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

(async () => {
  const body = document.getElementsByTagName("body")[0];
  var hostNames = await loadLastTenHostNamesFromHistory();
  const blockList = await getBlockList();
  hostNames = hostNames.filter(i => !blockList.includes(i))
  for (var name of hostNames) {
    let stg = document.createElement("strong");
    stg.innerText = name;

    let line = document.createElement("br");

    let btn = document.createElement("button");
    btn.innerText = "Block";
    btn.onclick = ((n) => {
      return () => {
        addToBlockList(n);
      };
    })(name);

    let div = document.createElement("div");
    div.appendChild(stg);
    div.appendChild(line);
    div.appendChild(btn);

    body.appendChild(div);
  }

  body.appendChild(document.createElement("hr"));

  for (var name of blockList) {
    let stg = document.createElement("strong");
    stg.innerText = name;

    let line = document.createElement("br");

    let btn = document.createElement("button");
    btn.innerText = "Remove";
    btn.onclick = ((n) => {
      return () => {
        removeFromBlockList(n);
      };
    })(name);

    let div = document.createElement("div");
    div.appendChild(stg);
    div.appendChild(line);
    div.appendChild(btn);

    body.appendChild(div);
  }
})();
