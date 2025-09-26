interface BaseExtensionMessage {
    messageType: string
    data?: any
}

interface AddShortcutMessage extends BaseExtensionMessage {
    messageType: 'add-shortcut'
}

export type ContentScriptMessage = AddShortcutMessage

export function sendToContentScript(tabId: number, message: ContentScriptMessage) {
    return chrome.tabs.sendMessage(tabId, message)
}

export function addContentScriptMessageListener<
    TMessage extends ContentScriptMessage,
>(messageType: TMessage['messageType'], handler: (message: TMessage) => void) {
    chrome.runtime.onMessage.addListener((message: ContentScriptMessage) => {
        if (message.messageType === messageType) {
            handler(message as TMessage)
        }
    })
}
