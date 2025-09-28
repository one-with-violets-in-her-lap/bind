<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import PlusKeyIcon from '@/shared/components/ui/icons/PlusKeyIcon.vue'
import { type Key, KeyCode } from '@/content-script/utils/keys'

const modelValue = defineModel<Key[] | null>('modelValue', { default: null })

const isWaitingForKeyInput = ref(false)

let keyInputStarted = false

function handleKeyDown(event: KeyboardEvent) {
    if (!isWaitingForKeyInput.value) {
        return
    }

    event.preventDefault()
    event.stopPropagation()

    if (event.key === 'Escape') {
        isWaitingForKeyInput.value = false
        return
    }

    if (event.repeat) {
        return
    }

    if (!keyInputStarted) {
        keyInputStarted = true
        modelValue.value = []
    }

    if (modelValue.value === null) {
        modelValue.value = []
    }

    if (event.ctrlKey && !modelValue.value.some(key => key.code === KeyCode.Ctrl)) {
        modelValue.value.push({ code: KeyCode.Ctrl, name: 'Ctrl' })
    }

    if (event.shiftKey && !modelValue.value.some(key => key.code === KeyCode.Shift)) {
        modelValue.value.push({ code: KeyCode.Shift, name: 'Shift' })
    }

    if (event.altKey && !modelValue.value.some(key => key.code === KeyCode.Alt)) {
        modelValue.value.push({ code: KeyCode.Alt, name: 'Alt' })
    }

    if (
        event.metaKey &&
        !modelValue.value.some(key => key.code === KeyCode.LeftWindowKey)
    ) {
        modelValue.value.push({ code: KeyCode.LeftWindowKey, name: '⌘' })
    }

    if (!modelValue.value.some(key => key.code === event.keyCode)) {
        modelValue.value.push({
            code: event.keyCode,
            name: event.key.slice(0, 1).toUpperCase() + event.key.slice(1),
        })
    }
}

function handleKeyUp() {
    isWaitingForKeyInput.value = false
    keyInputStarted = false
}

onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
})
onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
})
</script>

<template>
    <button
        class="hotkey-input"
        :class="{ 'hotkey-input-active': isWaitingForKeyInput }"
        @click="isWaitingForKeyInput = !isWaitingForKeyInput"
    >
        <div
            class="hotkey-input-placeholder"
            v-show="!isWaitingForKeyInput && !modelValue"
        >
            <PlusKeyIcon class="hotkey-input-placeholder-icon" />
            Click to add a hotkey
        </div>

        <div v-if="!isWaitingForKeyInput && modelValue" class="hotkey-value">
            <kbd v-for="(key, index) in modelValue">
                <kbd class="hotkey-key">
                    {{ key.name }}
                </kbd>

                <span v-if="index < modelValue.length - 1"> + </span>
            </kbd>
        </div>

        <span v-show="isWaitingForKeyInput"> Press hotkey... </span>
    </button>
</template>
