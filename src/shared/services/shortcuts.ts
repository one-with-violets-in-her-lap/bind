import type { Key } from '@/shared/utils/hotkeys'
import { useShortcutsStore } from '@/shared/stores/shortcuts'
import type { ClickShortcut, Shortcut } from '@/shared/models/shortcut'

interface ShortcutExecutor<TShortcut extends Shortcut> {
    executeShortcut(shortcut: TShortcut): void
}

class ClickShortcutExecutor implements ShortcutExecutor<ClickShortcut> {
    executeShortcut(shortcut: ClickShortcut) {
        const target = document.querySelector(shortcut.targetSelector)

        const event = new MouseEvent('click', { bubbles: true })
        target?.dispatchEvent(event)
    }
}

const SHORTCUT_EXECUTOR_CLASSES: Record<
    Shortcut['type'],
    new () => ShortcutExecutor<Shortcut>
> = {
    click: ClickShortcutExecutor,
}

export class ShortcutsService {
    groupShortcutsByUrl(currentSiteUrl: string) {
        const shortcutsStore = useShortcutsStore()

        return Object.groupBy(shortcutsStore.shortcuts, shortcut =>
            this.checkIfUrlsMatch(shortcut.siteUrl, currentSiteUrl)
                ? 'current-site'
                : 'other',
        )
    }

    handleHotkey(hotkey: Key[], event: KeyboardEvent) {
        const shortcutsStore = useShortcutsStore()

        shortcutsStore.shortcuts.forEach(shortcut => {
            const hotkeyMatches = shortcut.hotkey.every(key =>
                hotkey.some(hotkeyKey => hotkeyKey.code === key.code),
            )

            if (
                hotkeyMatches &&
                this.checkIfUrlsMatch(shortcut.siteUrl, window.location.href)
            ) {
                console.log(`Executing shortcut: ${JSON.stringify(shortcut)}`)

                event.stopPropagation()
                event.preventDefault()

                const executor = new SHORTCUT_EXECUTOR_CLASSES[shortcut.type]()
                executor.executeShortcut(shortcut)
            }
        })
    }

    private checkIfUrlsMatch(url1: string, url2: string) {
        const parsedUrl1 = new URL(url1)
        const parsedUrl2 = new URL(url2)

        return (
            parsedUrl1.origin === parsedUrl2.origin &&
            parsedUrl1.pathname === parsedUrl2.pathname
        )
    }
}
