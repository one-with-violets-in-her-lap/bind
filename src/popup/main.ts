import styles from './styles/main.css'

import { createApp } from 'vue'
import App from './App.vue'

document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`)

const app = createApp(App)
app.mount('#bindApp')
