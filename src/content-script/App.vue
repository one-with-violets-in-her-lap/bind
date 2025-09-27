<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useHoveredElement } from '@/content-script/composables/hovered-element'
import AppButton from '@/shared/components/ui/app-button/AppButton.vue'
import { addContentScriptMessageListener } from '@/shared/lib/messages'

const isAppActive = ref(true)

const { hoveredElement } = useHoveredElement({ debouncedUpdate: true })

watch(hoveredElement, (newElement, previousElement) => {
    newElement?.addEventListener('click', handleClick, { capture: true })
    previousElement?.removeEventListener('click', handleClick, { capture: true })
})

const hoveredElementBoundingClientRect = computed(() =>
    hoveredElement.value?.getBoundingClientRect(),
)

const abortController = new AbortController()

onMounted(() => {
    addContentScriptMessageListener('add-shortcut', handleShortcutCreationStart, {
        signal: abortController.signal,
    })
})

onUnmounted(() => {
    abortController.abort()
})

function handleShortcutCreationStart() {
    isAppActive.value = true
}

function handleCancel() {
    isAppActive.value = false
}

function handleClick(event: Event) {
    if (event.target instanceof HTMLElement && event.target.id === 'bindAppRoot') {
        return
    }

    event.stopPropagation()
    event.preventDefault()
    console.log(event.target)
}
</script>

<template>
    <Transition name="scale" appear>
        <div v-if="isAppActive" class="status-popup">
            <h2 class="heading-h2">Click on a button to bind</h2>

            <AppButton @click="handleCancel"> Cancel </AppButton>
        </div>
    </Transition>

    <Transition name="fade" appear>
        <div
            v-if="isAppActive && hoveredElementBoundingClientRect"
            class="hovered-element-highlight"
            :style="`left: ${hoveredElementBoundingClientRect.x}px; top: ${hoveredElementBoundingClientRect.y}px; width: ${hoveredElementBoundingClientRect.width}px; height: ${hoveredElementBoundingClientRect.height}px`"
        ></div>
    </Transition>
</template>
