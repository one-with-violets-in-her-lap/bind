import contentScriptStyles from '@/content-script/styles/main.css'
import popupStyles from '@/popup/styles/main.css'

import { createApp } from 'vue'
import App from './App.vue'

document.head.insertAdjacentHTML(
    'beforeend',
    `
	<style>
	${contentScriptStyles}
	</style>

	<style>
	${popupStyles}
	</style>
    `,
)

const app = createApp(App)
app.mount('#app')
