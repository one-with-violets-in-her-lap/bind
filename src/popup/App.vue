<script setup lang="ts">
import AppButton from '@/shared/components/ui/app-button/AppButton.vue'
import { sendToContentScript } from '@/shared/utils/messages'

function handleAddShortcut() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (!tabs || tabs[0]?.id === undefined) {
            return
        }

        sendToContentScript(tabs[0].id, { messageType: 'shortcut-creation-start' })

        window.close()
    })
}
</script>

<template>
  <main class="popup-main-content">
    <h1 class="heading-h1 mb-2">
      Bind
    </h1>

    <AppButton @click="handleAddShortcut">
      Add shortcut
    </AppButton>
  </main>
</template>

<style scoped></style>
