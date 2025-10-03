<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useShortcutsStore } from '@/shared/stores/shortcuts'
import ShortcutList from '@/shared/components/shortcut-list/ShortcutList.vue'
import AppButton from '@/shared/components/ui/app-button/AppButton.vue'
import { sendToContentScript } from '@/shared/utils/extension/messages'
import { ShortcutsService } from '@/shared/services/shortcuts'

const shortcutsService = new ShortcutsService()

const groupedShortcuts = computed(() =>
    activeTab.value?.url
        ? shortcutsService.groupShortcutsByUrl(activeTab.value.url)
        : null,
)

const { removeShortcut } = useShortcutsStore()

const activeTab = ref<chrome.tabs.Tab>()

onMounted(() => {
    updateActiveTab()

    chrome.tabs.onCreated.addListener(updateActiveTab)
    chrome.tabs.onActivated.addListener(updateActiveTab)
})

onUnmounted(() => {
    chrome.tabs.onCreated.removeListener(updateActiveTab)
    chrome.tabs.onActivated.removeListener(updateActiveTab)
})

function updateActiveTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (!tabs) {
            return
        }

        activeTab.value = tabs[0]
    })
}

function handleAddShortcut() {
    if (!activeTab.value?.id) {
        throw new Error('Could not retrieve active tab id')
    }

    sendToContentScript(activeTab.value.id, {
        messageType: 'shortcut-creation-start',
    })

    window.close()
}
</script>

<template>
    <div class="popup">
        <main class="popup-main-content">
            <h1 class="heading-h1 popup-heading mb-4">Bind</h1>

            <AppButton class="mb-8" @click="handleAddShortcut">
                Add shortcut
            </AppButton>

            <section class="shortcuts-section mb-8">
                <h2 class="heading-h2 mb-1">On this site</h2>

                <ShortcutList
                    :shortcuts="groupedShortcuts?.['current-site'] || []"
                    @delete="shortcut => removeShortcut(shortcut.id)"
                />
            </section>

            <section class="shortcuts-section">
                <h2 class="heading-h2 mb-1">Other shortcuts</h2>

                <ShortcutList
                    :shortcuts="groupedShortcuts?.['other'] || []"
                    @delete="shortcut => removeShortcut(shortcut.id)"
                />
            </section>
        </main>
    </div>
</template>

<style scoped></style>
