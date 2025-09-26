<script setup lang="ts">
import { sendToContentScript } from '@/shared/messages'

function handleAddShortcut() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (!tabs || tabs[0]?.id === undefined) {
            return
        }

        sendToContentScript(tabs[0].id, { messageType: 'add-shortcut' })
    })
}
</script>

<template>
    <h1>Bind</h1>

    <button @click="handleAddShortcut">Add shortcut</button>
</template>

<style scoped></style>
