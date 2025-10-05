import styles from './styles/main.css'

import App from './App.vue'
import { setupApp, setupLogging } from '@/shared/app'

document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`)

setupLogging()
setupApp(App).mount('#bindApp')
