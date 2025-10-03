import styles from './styles/main.css'

import App from './App.vue'
import { setupApp } from '@/shared/app'

document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`)

setupApp(App).mount('#bindApp')
