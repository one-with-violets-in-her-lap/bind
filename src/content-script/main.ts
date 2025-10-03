import styles from './styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { shortcutsStoreSyncPlugin } from '@/shared/stores/shortcuts'
import { ShortcutsService } from '@/shared/services/shortcuts'
import { extensionStorage } from '@/shared/utils/storage'
import { setupHotkeyListener } from '@/shared/utils/hotkeys'

function startContentScript() {
    console.log('[bind] yo')

    mountContentScriptApp()
}

function mountContentScriptApp() {
    const shadowHost = document.createElement('div')
    shadowHost.id = 'bindAppRoot'
    shadowHost.style.all = 'unset'

    const shadow = shadowHost.attachShadow({ mode: 'open' })

    const appContainer = document.createElement('div')
    appContainer.id = 'bindApp'

    const styleElement = document.createElement('style')
    styleElement.innerHTML = styles

    shadow.appendChild(styleElement)
    shadow.appendChild(appContainer)

    document.body.appendChild(shadowHost)

    const shortcutsService = new ShortcutsService()
    setupHotkeyListener((hotkey, event) =>
        shortcutsService.handleHotkey(hotkey, event),
    )

    const pinia = createPinia()
    pinia.use(shortcutsStoreSyncPlugin)

    createApp(App).use(pinia).mount(appContainer)
}

if (window.bindExtension === undefined) {
    window.bindExtension = {}
}

if (!window.bindExtension.isContentScriptExecuted) {
    startContentScript()

    window.bindExtension.isContentScriptExecuted = true
}
