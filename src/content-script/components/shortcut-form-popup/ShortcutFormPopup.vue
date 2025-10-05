<script setup lang="ts">
import { computed, ref } from 'vue'
import AppButton from '@/shared/components/ui/app-button/AppButton.vue'
import type { Key } from '@/shared/utils/hotkeys'
import { useWindowSize } from '@/shared/utils/window-size'
import { getUniqueSelector } from '@/shared/utils/selector'
import CheckMarkIcon from '@/shared/components/ui/icons/CheckMarkIcon.vue'
import type { ShortcutInput } from '@/shared/models/shortcut'
import HotkeyInput from '@/shared/components/hotkey-input/HotkeyInput.vue'

const ANCHOR_SPACING = 14

const props = defineProps<{
    status: 'form' | 'success'
    anchor: { x: number; y: number; width: number; height: number }
    selectedElement: HTMLElement
}>()

const emit = defineEmits<{
    (event: 'submit', shortcut: ShortcutInput, selectedElement: HTMLElement): void
    (event: 'cancel'): void
}>()

const hotkey = ref<Key[] | null>(null)

const elementText = computed(() => {
    return (
        '"' +
        (
            props.selectedElement.ariaLabel?.trim() ||
            props.selectedElement.title?.trim() ||
            props.selectedElement.textContent?.trim() ||
            props.selectedElement.id?.trim() ||
            props.selectedElement.className?.trim() ||
            props.selectedElement.tagName.toLowerCase()
        ).trim() +
        '"'
    )
})

const windowSize = useWindowSize()

const popupElementRef = ref<HTMLElement>()

const safePositionX = computed(() => {
    if (!popupElementRef.value) {
        return props.anchor.x
    }

    const doesNotFitOnRightSide =
        props.anchor.x + props.anchor.width + popupElementRef.value.clientWidth >
        (windowSize.width.value || 0)

    if (doesNotFitOnRightSide) {
        if (props.anchor.x - popupElementRef.value.clientWidth >= 0) {
            // Position on left side
            return props.anchor.x - popupElementRef.value.clientWidth - ANCHOR_SPACING
        } else {
            // If popup does not fit on both sides, center it
            return (
                props.anchor.x +
                props.anchor.width / 2 -
                popupElementRef.value.clientWidth / 2
            )
        }
    } else {
        // Position on right side
        return props.anchor.x + props.anchor.width + ANCHOR_SPACING
    }
})

const safePositionY = computed(() => {
    if (!popupElementRef.value) {
        return props.anchor.y
    }

    const doesNotFitOnTop =
        props.anchor.y + props.anchor.height + popupElementRef.value.clientHeight >
        (windowSize.height.value || 0)

    if (doesNotFitOnTop) {
        return (
            props.anchor.y -
            popupElementRef.value.clientHeight +
            // If anchor height is larger than popup, center the popup
            (props.anchor.height > popupElementRef.value.clientHeight
                ? props.anchor.height / 2 + popupElementRef.value.clientHeight / 2
                : props.anchor.height)
        )
    } else {
        return props.anchor.y
    }
})

function handleSubmit() {
    if (!hotkey.value) {
        return
    }

    emit(
        'submit',
        {
            title: `Click element ${elementText.value}`,
            type: 'click',
            hotkey: hotkey.value,
            targetSelector: getUniqueSelector(props.selectedElement),
            siteUrl: `${window.location.protocol}//${window.location.host}${window.location.pathname}`,
        },
        props.selectedElement,
    )
}
</script>

<template>
    <dialog
        ref="popupElementRef"
        :style="`left: ${safePositionX}px; ` + `top: ${safePositionY}px; `"
        open
        aria-label="New shortcut form"
        class="shortcut-form-popup"
    >
        <div
            class="shortcut-form-content"
            :class="{ 'shortcut-form-content-hidden': status !== 'form' }"
        >
            <h2 class="heading-h2 mb-1 shortcut-form-heading">New shortcut</h2>

            <div class="shortcut-title mb-4">
                Click element
                {{ elementText }}
            </div>

            <HotkeyInput v-model="hotkey" class="mb-6" trigger-automatically />

            <div class="actions">
                <AppButton :disabled="hotkey === null" @click="handleSubmit">
                    Create
                </AppButton>

                <AppButton variant="secondary" @click="emit('cancel')">
                    Cancel
                </AppButton>
            </div>
        </div>

        <div
            class="shortcut-form-success"
            :class="{ 'shortcut-form-success-visible': status === 'success' }"
        >
            <CheckMarkIcon />

            <h2 class="heading-h2 mb-6 shortcut-form-heading">Shortcut created</h2>

            <AppButton variant="default" @click="emit('cancel')"> OK </AppButton>
        </div>
    </dialog>
</template>
