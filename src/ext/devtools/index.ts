import logger from "../../shared/lib/logger"
import Message from "../../shared/messages/types"
import { MessageActions } from "../../types"

const cmd = `inspect(window.latestTarget);debugger;`

chrome.runtime.onMessage.addListener((message: MessageActions, sender, sendResponse) => {
    const { tabId } = chrome.devtools.inspectedWindow;
    logger.debug(tabId, message)

    if (message.type === Message.INSPECT_ELEMENT && message.tabId === tabId) {
        chrome.devtools.inspectedWindow.eval(cmd, {
            useContentScriptContext: true,
            // @ts-ignore
        }, (result, exc) => {
            logger.debug(result, exc)
        })
    }
    sendResponse(null)
})
