import '../../public/manifest.json' with { type: 'json' }
import { addContentScriptMessageListener } from '@/shared/messages'

function startContentScript() {
    console.log('[bind] yo')

    addContentScriptMessageListener('add-shortcut', () => {
        document.body.innerHTML = `<h1>Your page is gone + computer hacked</h1>`
    })
}

if (window.bindExtension === undefined) {
    window.bindExtension = {}
}

if (!window.bindExtension.isContentScriptExecuted) {
    startContentScript()

    window.bindExtension.isContentScriptExecuted = true
}
