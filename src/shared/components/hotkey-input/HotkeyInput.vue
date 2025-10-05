<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import PlusKeyIcon from '@/shared/components/ui/icons/PlusKeyIcon.vue'
import { type Key, KeyCode, setupAllHotkeysListener } from '@/shared/utils/hotkeys'

const props = defineProps<{
    modelValue: Key[] | null

    /**
     * Immediately starts hotkey selection once the component is mounted
     */
    triggerAutomatically?: boolean
}>()

const emit = defineEmits<{
    (event: 'update:modelValue', newValue: Key[]): void
}>()

const isWaitingForKeyInput = ref(false)

let hotkeyListener: { remove: () => void } | undefined = undefined
onUnmounted(() => hotkeyListener?.remove())

const inputButtonRef = ref<HTMLButtonElement>()
onMounted(() => {
    if (props.triggerAutomatically) {
        inputButtonRef.value?.click()
    }
})

function handleClick() {
    if (isWaitingForKeyInput.value) {
        isWaitingForKeyInput.value = false
        return
    }

    isWaitingForKeyInput.value = true

    hotkeyListener = setupAllHotkeysListener(
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
        ref="inputButtonRef"
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
