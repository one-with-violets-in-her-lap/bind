import styles from './page.css'

import { addContentScriptMessageListener } from '@/shared/lib/messages'

function startContentScript() {
    console.log('[bind] yo ', styles,)

    document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`)

    addContentScriptMessageListener('add-shortcut', () => startShortcutCreation())
}

function startShortcutCreation() {
    const abortController = new AbortController()

    document.body.classList.add('bind__select-mode')

    let previousHighlightedElement: HTMLElement | undefined = undefined
    document.addEventListener(
        'mousemove',
        event => {
            previousHighlightedElement?.classList.remove('bind__highlighted')

            if (event.target instanceof HTMLElement) {
                event.target.classList.add('bind__highlighted')
                previousHighlightedElement = event.target
            }
        },
        { signal: abortController.signal },
    )
}

if (window.bindExtension === undefined) {
    window.bindExtension = {}
}

if (!window.bindExtension.isContentScriptExecuted) {
    startContentScript()

    window.bindExtension.isContentScriptExecuted = true
}
