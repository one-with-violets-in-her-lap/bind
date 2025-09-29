<script setup lang="ts">
import { computed, ref } from 'vue'
import AppButton from '@/shared/components/ui/app-button/AppButton.vue'
import type { Key } from '@/shared/utils/keys'
import type { Shortcut } from '@/shared/models/shortcut'
import { useWindowSize } from '@/content-script/utils/window-size'
import HotkeyInput from '@/content-script/components/hotkey-input/HotkeyInput.vue'
import { getUniqueSelector } from '@/content-script/utils/selector'

const ANCHOR_SPACING = 14

const props = defineProps<{
    anchor: { x: number; y: number; width: number; height: number }

    selectedElement: HTMLElement
}>()

const emit = defineEmits<{
    (event: 'submit', shortcut: Shortcut): void
    (event: 'cancel'): void
}>()

const hotkey = ref<Key[] | null>(null)

const elementText = computed(
    () =>
        '"' +
        (
            props.selectedElement.textContent ||
            props.selectedElement.title ||
            props.selectedElement.id ||
            props.selectedElement.className
        ).trim() +
        '"',
)

const windowSize = useWindowSize()

const popupElementRef = ref<HTMLElement>()

const safePositionX = computed(() => {
    if (!popupElementRef.value) {
        return props.anchor.x
    }

    if (
        props.anchor.x + props.anchor.width + popupElementRef.value.clientWidth >
        (windowSize.width.value || 0)
    ) {
        return props.anchor.x - popupElementRef.value.clientWidth - ANCHOR_SPACING
    } else {
        return props.anchor.x + props.anchor.width + ANCHOR_SPACING
    }
})

const safePositionY = computed(() => {
    if (!popupElementRef.value) {
        return props.anchor.y
    }

    if (
        props.anchor.y + props.anchor.height + popupElementRef.value.clientHeight >
        (windowSize.height.value || 0)
    ) {
        return props.anchor.y - props.anchor.height - ANCHOR_SPACING
    } else {
        return props.anchor.y
    }
})
</script>

<template>
    <div
        class="shortcut-form-popup"
        ref="popupElementRef"
        :style="`left: ${safePositionX}px; ` + `top: ${safePositionY}px; `"
    >
        <h2 class="heading-h2 mb-1 shortcut-form-heading">New shortcut</h2>

        <div class="shortcut-title mb-4">
            Click element
            {{ elementText }}
        </div>

        <HotkeyInput v-model="hotkey" class="mb-6" />

        <div class="actions">
            <AppButton
                :disabled="hotkey === null"
                @click="
                    hotkey
                        ? emit('submit', {
                              title: `Click element ${elementText}`,
                              type: 'click',
                              hotkey,
                              targetSelector: getUniqueSelector(selectedElement),
                          })
                        : {}
                "
            >
                Create
            </AppButton>

            <AppButton variant="secondary" @click="emit('cancel')">
                Cancel
            </AppButton>
        </div>
    </div>
</template>
