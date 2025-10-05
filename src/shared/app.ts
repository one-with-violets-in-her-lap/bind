import { createPinia } from 'pinia'
import { createApp, type Component } from 'vue'
import { shortcutsStoreSyncPlugin } from '@/shared/stores/shortcuts'
import { configureLoggers, LogLevel } from '@/shared/utils/logging'

/**
 * Creates a base Vue app for usage in different extension modules (popup, content scripts)
 * */
export function setupApp(AppComponent: Component) {
    const app = createApp(AppComponent)

    const pinia = createPinia()
    pinia.use(shortcutsStoreSyncPlugin)

    app.use(pinia)

    return app
}

export function setupLogging() {
    configureLoggers({
        level:
            process.env.BIND_MODE === 'development' ? LogLevel.INFO : LogLevel.WARN,
    })
}
