import { defineStore, type PiniaPluginContext } from 'pinia'
import { ref } from 'vue'
import type { Shortcut, ShortcutInput } from '@/shared/models/shortcut'
import { extensionStorage } from '@/shared/utils/extension/storage'
import { Logger } from '@/shared/utils/logging'

const logger = new Logger('stores/shortcuts')

const SHORTCUTS_STORE_ID = 'shortcuts'

export const useShortcutsStore = defineStore(SHORTCUTS_STORE_ID, () => {
    const shortcuts = ref<Shortcut[]>([])
    const isPending = ref(true)

    function addShortcut(shortcut: ShortcutInput) {
        const lastShortcutId = shortcuts.value?.at(-1)?.id || 0
        shortcuts.value = [
            ...(shortcuts.value || []),
            { id: lastShortcutId + 1, ...shortcut },
        ]
    }

    function removeShortcut(id: number) {
        shortcuts.value = shortcuts.value?.filter(shortcut => shortcut.id !== id)
    }

    return {
        shortcuts,
        isPending,
        addShortcut,
        removeShortcut,
    }
})

export function shortcutsStoreSyncPlugin(context: PiniaPluginContext) {
    if (context.store.$id === SHORTCUTS_STORE_ID) {
        // TODO: remove naive typing
        const store = context.store as ReturnType<typeof useShortcutsStore>

        let areChangesFromStorage = false

        extensionStorage.get('shortcuts').then(shortcuts => {
            areChangesFromStorage = true

            logger.info(`Shortcuts loaded`, shortcuts)

            store.$state.shortcuts = shortcuts || []
            store.$state.isPending = false
        })

        const storageUpdateListener = extensionStorage.addUpdateListener(update => {
            areChangesFromStorage = true

            logger.info(`Syncing shortcuts changes from storage:`, update)

            store.$state.shortcuts = update.shortcuts?.newValue || []
            store.$state.isPending = false
        })

        store.$subscribe(() => {
            if (areChangesFromStorage) {
                areChangesFromStorage = false
                return
            }

            const newShortcuts = store.$state.shortcuts

            logger.info(`Syncing shortcuts changes to storage:`, newShortcuts)

            extensionStorage.set({
                shortcuts: JSON.parse(JSON.stringify(newShortcuts)),
            })
        })

        context.app.onUnmount(() => storageUpdateListener.removeListener())
    }
}
