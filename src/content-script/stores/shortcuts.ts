import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Shortcut, ShortcutInput } from '@/shared/models/shortcut'
import { extensionStorage } from '@/shared/utils/storage'

export const useShortcutsStore = defineStore('shortcuts', () => {
    const shortcuts = ref<Shortcut[]>([])
    const isPending = ref(true)

    watch(shortcuts, () => {
        console.log('Syncing shortcuts to storage:', shortcuts.value)
        extensionStorage.set({
            shortcuts: JSON.parse(JSON.stringify(shortcuts.value)),
        })
    })

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
