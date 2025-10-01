import type { Shortcut } from '@/shared/models/shortcut'

interface ExtensionStorage {
    shortcuts?: Shortcut[]
}

export const extensionStorage = {
    /**
     * Sets multiple items.
     * @param items An object which gives each key/value pair to update storage with. Any other key/value pairs in storage will not be affected.
     * Primitive values such as numbers will serialize as expected. Values with a typeof "object" and "function" will typically serialize to {}, with the exception of Array (serializes as expected), Date, and Regex (serialize using their String representation).
     */
    set(items: Partial<ExtensionStorage>) {
        return chrome.storage.local.set(items)
    },

    get<TKey extends keyof ExtensionStorage>(
        key: TKey,
    ): Promise<ExtensionStorage[TKey]> {
        return new Promise(resolve => {
            chrome.storage.local.get(key, result => resolve(result[key]))
        })
    },
}
