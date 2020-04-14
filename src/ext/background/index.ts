import 'chrome-extension-async';
import '../../shared/lib/logger';
import logger from '../../shared/lib/logger';
import { inspectElement } from '../../shared/messages/actions';

async function main() {

  chrome.contextMenus.create({
    contexts: ['all'],
    title: 'Pause + inspect',
    onclick: async (info, tab) => {
      chrome.runtime.sendMessage(inspectElement(tab.id))
    },
  })

  chrome.commands.onCommand.addListener(async (command) => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })

    if (tabs.length > 0) {
      chrome.runtime.sendMessage(inspectElement(tabs[0].id))
    }
  })
}
main()
