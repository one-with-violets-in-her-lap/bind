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
>(
    messageType: TMessage['messageType'],
    handler: (message: TMessage) => void,
    options: { signal?: AbortSignal } = {},
) {
    function listener(message: ContentScriptMessage) {
        if (message.messageType === messageType) {
            handler(message as TMessage)
        }
    }

    chrome.runtime.onMessage.addListener(listener)

    options.signal?.addEventListener('abort', () =>
        chrome.runtime.onMessage.removeListener(listener),
    )

    return {
        remove() {
            chrome.runtime.onMessage.removeListener(listener)
        },
    }
}
