import contentScriptStyles from '@/content-script/styles/main.css'
import popupStyles from '@/popup/styles/main.css'

import App from './App.vue'
import { setupApp, setupLogging } from '@/shared/app'

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

setupLogging()
setupApp(App).mount('#app')
