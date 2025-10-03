import styles from './styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { shortcutsStoreSyncPlugin } from '@/shared/stores/shortcuts'

document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`)

const app = createApp(App)

const pinia = createPinia()
pinia.use(shortcutsStoreSyncPlugin)

app.use(pinia).mount('#bindApp')
