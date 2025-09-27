import styles from './styles/main.css'

import { createApp } from 'vue'
import App from './App.vue'

function startContentScript() {
    console.log('[bind] yo')

    const shadowHost = document.createElement('div')
    shadowHost.style.all = 'unset'

    const shadow = shadowHost.attachShadow({ mode: 'open' })

    const appContainer = document.createElement('div')
    appContainer.id = 'app'

    const styleElement = document.createElement('style')
    styleElement.innerHTML = styles

    shadow.appendChild(styleElement)
    shadow.appendChild(appContainer)

    document.body.appendChild(shadowHost)

    createApp(App).mount(appContainer)
}

if (window.bindExtension === undefined) {
    window.bindExtension = {}
}

if (!window.bindExtension.isContentScriptExecuted) {
    startContentScript()

    window.bindExtension.isContentScriptExecuted = true
}
