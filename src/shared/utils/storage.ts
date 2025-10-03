import type { Shortcut } from '@/shared/models/shortcut'

interface ExtensionStorage {
    shortcuts?: Shortcut[]
}

type ExtensionStorageUpdate = Partial<
    Record<
        keyof ExtensionStorage,
        {
            oldValue: ExtensionStorage[keyof ExtensionStorage]
            newValue: ExtensionStorage[keyof ExtensionStorage]
        }
    >
>

export const extensionStorage = {
    /**
     * Sets multiple items.
     * @param items An object which gives each key/value pair to update storage with. Any other key/value pairs in storage will not be affected.
     * Primitive values such as numbers will serialize as expected. Values with a typeof "object" and "function" will typically serialize to {}, with the exception of Array (serializes as expected), Date, and Regex (serialize using their String representation).
     */
    set(items: Partial<ExtensionStorage>) {
        return new Promise<void>(resolve => chrome.storage.local.set(items, resolve))
    },

    get<TKey extends keyof ExtensionStorage>(
        key: TKey,
    ): Promise<ExtensionStorage[TKey]> {
        return new Promise(resolve => {
            chrome.storage.local.get(key, result => resolve(result[key]))
        })
    },

    addUpdateListener(
        updateHandler: (update: ExtensionStorageUpdate) => void,
        options: { signal?: AbortSignal } = {},
    ) {
        function handleStorageUpdate(
            update: Record<string, chrome.storage.StorageChange>,
        ) {
            updateHandler(update as ExtensionStorageUpdate)
        }

        chrome.storage.local.onChanged.addListener(handleStorageUpdate)

        options.signal?.addEventListener('abort', () => {
            chrome.storage.local.onChanged.removeListener(handleStorageUpdate)
        })

        return {
            removeListener() {
                chrome.storage.local.onChanged.removeListener(handleStorageUpdate)
            },
        }
    },
}
