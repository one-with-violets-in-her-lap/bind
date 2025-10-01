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

let hotkeyListener: { remove: VoidFunction } | undefined = undefined
onUnmounted(() => hotkeyListener?.remove())

function startHotkeyInput() {
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
        @click="startHotkeyInput"
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
