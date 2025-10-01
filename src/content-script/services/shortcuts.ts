import type { Key } from '@/shared/utils/hotkeys'
import { useShortcutsStore } from '@/content-script/stores/shortcuts'
import type { ClickShortcut, Shortcut } from '@/shared/models/shortcut'

interface ShortcutExecutorService<TShortcut extends Shortcut> {
    executeShortcut(shortcut: TShortcut): void
}

class ClickShortcutExecutorService implements ShortcutExecutorService<ClickShortcut> {
    executeShortcut(shortcut: ClickShortcut) {
        const target = document.querySelector(shortcut.targetSelector)

        const event = new MouseEvent('click', { bubbles: true })
        target?.dispatchEvent(event)
    }
}

const SHORTCUT_EXECUTOR_CLASSES: Record<
    Shortcut['type'],
    new () => ShortcutExecutorService<Shortcut>
> = {
    click: ClickShortcutExecutorService,
}

export class ShortcutsService {
    handleHotkey(hotkey: Key[], event: KeyboardEvent) {
        const shortcutsStore = useShortcutsStore()

        shortcutsStore.shortcuts.forEach(shortcut => {
            const hotkeyMatches = shortcut.hotkey.every(key =>
                hotkey.some(hotkeyKey => hotkeyKey.code === key.code),
            )

            const shortcutUrl = new URL(shortcut.siteUrl)
            const urlMatches = window.location.protocol === shortcutUrl.protocol

            if (hotkeyMatches && urlMatches) {
                console.log(`Executing shortcut: ${shortcut}`)

                event.stopPropagation()
                event.preventDefault()

                const executor = new SHORTCUT_EXECUTOR_CLASSES[shortcut.type]()
                executor.executeShortcut(shortcut)
            }
        })
    }
}
