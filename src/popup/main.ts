import styles from './styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { extensionStorage } from '@/shared/utils/storage'
import { useShortcutsStore } from '@/content-script/stores/shortcuts'

document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`)

const app = createApp(App)

app.use(createPinia()).mount('#bindApp')

extensionStorage.get('shortcuts').then(shortcuts => {
    console.log('Loading shortcuts', shortcuts)
    const shortcutsStore = useShortcutsStore()
    shortcutsStore.shortcuts = shortcuts || []
    shortcutsStore.isPending = false
})
