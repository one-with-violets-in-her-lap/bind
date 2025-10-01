import styles from './styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { addContentScriptMessageListener } from '@/shared/utils/messages'
import { extensionStorage } from '@/shared/utils/storage'
import { useShortcutsStore } from '@/content-script/stores/shortcuts'
import { setupHotkeyListener } from '@/shared/utils/hotkeys'

function startContentScript() {
    console.log('[bind] yo')

    let isAppMounted = false

    addContentScriptMessageListener('shortcut-creation-start', () => {
        if (isAppMounted) {
            return
        }

        mountContentScriptApp()

        isAppMounted = true
    })
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

    createApp(App).use(createPinia()).mount(appContainer)

    extensionStorage.get('shortcuts').then(shortcuts => {
        console.log('Loaded shortcuts')
        const shortcutsStore = useShortcutsStore()
        shortcutsStore.shortcuts = shortcuts || []
        shortcutsStore.isPending = false
    })

    setupHotkeyListener(hotkey => console.log(JSON.stringify(hotkey)))
}

if (window.bindExtension === undefined) {
    window.bindExtension = {}
}

if (!window.bindExtension.isContentScriptExecuted) {
    startContentScript()

    window.bindExtension.isContentScriptExecuted = true
}
