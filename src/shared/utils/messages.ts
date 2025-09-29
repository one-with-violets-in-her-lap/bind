import type { Shortcut } from '@/shared/models/shortcut'

interface BaseExtensionMessage {
    messageType: string
    data?: any
}

interface ShortcutCreationStartMessage extends BaseExtensionMessage {
    messageType: 'shortcut-creation-start'
}

export type MessageToContentScript = ShortcutCreationStartMessage

export function sendToContentScript(tabId: number, message: MessageToContentScript) {
    return chrome.tabs.sendMessage(tabId, message)
}

export function addContentScriptMessageListener<
    TMessage extends MessageToContentScript,
>(
    messageType: TMessage['messageType'],
    handler: (message: TMessage) => void,
    options: { signal?: AbortSignal } = {},
) {
    function listener(message: MessageToContentScript) {
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

interface NewShortcutMessage extends BaseExtensionMessage {
    messageType: 'new-shortcut'
    data: Shortcut
}

export type MessageToPopup = NewShortcutMessage

export function sendToPopup(message: MessageToPopup) {
    return chrome.runtime.sendMessage(message)
}

export function addMessageToPopupListener<TMessage extends MessageToPopup>(
    messageType: TMessage['messageType'],
    handler: (message: TMessage) => void,
    options: { signal?: AbortSignal } = {},
) {
    function listener(message: MessageToPopup) {
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
