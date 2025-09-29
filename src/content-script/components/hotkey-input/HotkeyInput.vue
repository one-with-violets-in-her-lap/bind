<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import PlusKeyIcon from '@/shared/components/ui/icons/PlusKeyIcon.vue'
import { type Key, KeyCode } from '@/shared/utils/keys'

const props = defineProps<{
    modelValue: Key[] | null
}>()

const emit = defineEmits<{
    (event: 'update:modelValue', newValue: Key[]): void
}>()

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

    let hotkey = props.modelValue

    if (!keyInputStarted) {
        keyInputStarted = true
        hotkey = []
    }

    if (hotkey === null) {
        hotkey = []
    }

    if (event.ctrlKey && !hotkey.some(key => key.code === KeyCode.Ctrl)) {
        hotkey.push({
            code: KeyCode.Ctrl,
            name: 'Ctrl',
        })
    }

    if (event.shiftKey && !hotkey.some(key => key.code === KeyCode.Shift)) {
        hotkey.push({
            code: KeyCode.Shift,
            name: 'Shift',
        })
    }

    if (event.altKey && !hotkey.some(key => key.code === KeyCode.Alt)) {
        hotkey.push({ code: KeyCode.Alt, name: 'Alt' })
    }

    if (event.metaKey && !hotkey.some(key => key.code === KeyCode.LeftWindowKey)) {
        hotkey.push({
            code: KeyCode.LeftWindowKey,
            name: '⌘',
        })
    }

    if (!hotkey.some(key => key.code === event.keyCode)) {
        hotkey.push({
            code: event.keyCode,
            name: event.key.slice(0, 1).toUpperCase() + event.key.slice(1),
        })
    }

    emit('update:modelValue', hotkey)
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

        <kbd v-if="!isWaitingForKeyInput && modelValue" class="hotkey-value">
            <template v-for="(key, index) in modelValue">
                <kbd class="hotkey-key">
                    {{ key.name }}
                </kbd>

                <span v-if="index < modelValue.length - 1"> + </span>
            </template>
        </kbd>

        <span v-show="isWaitingForKeyInput"> Press hotkey... </span>
    </button>
</template>
