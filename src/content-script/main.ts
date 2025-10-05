import styles from './styles/main.css'

import App from './App.vue'
import { ShortcutsService } from '@/shared/services/shortcuts'
import { setupAllHotkeysListener } from '@/shared/utils/hotkeys'
import { setupApp, setupLogging } from '@/shared/app'
import { Logger } from '@/shared/utils/logging'

const logger = new Logger('content-script/main')

function startContentScript() {
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

    setupLogging()
    const app = setupApp(App)

    logger.info('Content script started')

    const shortcutsService = new ShortcutsService()
    setupAllHotkeysListener((hotkey, event) =>
        shortcutsService.handleHotkey(hotkey, event),
    )

    app.mount(appContainer)
}

if (window.bindExtension === undefined) {
    window.bindExtension = {}
}

if (!window.bindExtension.isContentScriptExecuted) {
    startContentScript()

    window.bindExtension.isContentScriptExecuted = true
}
