<script lang="ts" setup>
import { onUnmounted, ref } from 'vue'
import PlusKeyIcon from '@/shared/components/ui/icons/PlusKeyIcon.vue'
import { type Key, KeyCode, setupHotkeyListener } from '@/shared/utils/hotkeys'

defineProps<{
    modelValue: Key[] | null
}>()

const emit = defineEmits<{
    (event: 'update:modelValue', newValue: Key[]): void
}>()

const isWaitingForKeyInput = ref(false)

let hotkeyListener: { remove: () => void } | undefined = undefined
onUnmounted(() => hotkeyListener?.remove())

function handleClick() {
    if (isWaitingForKeyInput.value) {
        isWaitingForKeyInput.value = false
        return
    }

    isWaitingForKeyInput.value = true

    hotkeyListener = setupHotkeyListener(
        (hotkey, event) => {
            if (event.keyCode === KeyCode.Escape) {
                stopHotkeyInput()
                return
            }

            event.preventDefault()
            event.stopPropagation()

            emit('update:modelValue', hotkey)
        },
        { onHotkeyEnd: stopHotkeyInput },
    )
}

function stopHotkeyInput() {
    isWaitingForKeyInput.value = false
    hotkeyListener?.remove()
}
</script>

<template>
    <button
        class="hotkey-input"
        :class="{ 'hotkey-input-active': isWaitingForKeyInput }"
        @click="handleClick"
    >
        <div
            v-show="!isWaitingForKeyInput && !modelValue"
            class="hotkey-input-placeholder"
        >
            <PlusKeyIcon class="hotkey-input-placeholder-icon" />
            Click to add a hotkey
        </div>

        <kbd v-if="!isWaitingForKeyInput && modelValue" class="hotkey-value">
            <kbd v-for="key in modelValue" class="hotkey-key">
                {{ key.name }}
            </kbd>
        </kbd>

        <span v-show="isWaitingForKeyInput"> Press hotkey... </span>
    </button>
</template>
