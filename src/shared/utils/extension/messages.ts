import type { Shortcut } from '@/shared/models/shortcut'
import { Logger } from '@/shared/utils/logging'

const logger = new Logger('utils/extension/messages.ts')

interface BaseExtensionMessage {
    messageType: string
}

interface ShortcutCreationStartMessage extends BaseExtensionMessage {
    messageType: 'shortcut-creation-start'
}

export type MessageToContentScript = ShortcutCreationStartMessage

export function sendToContentScript(tabId: number, message: MessageToContentScript) {
    return chrome.tabs.sendMessage(tabId, message)
}

/**
 * Sends a message from background/popup to a content script in the current tab
 * */
export function sendToCurrentTab(message: MessageToContentScript) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs[0]?.id === undefined) {
            logger.warn('No current tab was detected:', tabs)
            return
        }

        sendToContentScript(tabs[0].id, message)
    })
}

export function onMessageToContentScript<TMessage extends MessageToContentScript>(
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

export type MessageToBackgroundScript = NewShortcutMessage

export function sendToBackground(message: MessageToBackgroundScript) {
    return chrome.runtime.sendMessage(message)
}

export function onMessageToBackground<TMessage extends MessageToBackgroundScript>(
    messageType: TMessage['messageType'],
    handler: (message: TMessage) => void,
    options: { signal?: AbortSignal } = {},
) {
    function listener(message: MessageToBackgroundScript) {
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
