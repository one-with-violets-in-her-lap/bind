<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWindowSize } from '../utils/window-size'
import AppButton from '@/shared/components/ui/app-button/AppButton.vue'

const ANCHOR_SPACING = 14

const props = defineProps<{
    anchor: { x: number; y: number; width: number; height: number }

    selectedElement: HTMLElement
}>()

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
        <h2 class="heading-h2 mb-4">
            New shortcut -
            {{
                selectedElement.textContent ||
                selectedElement.title ||
                selectedElement.id ||
                selectedElement.className
            }}
        </h2>

        <AppButton> Create </AppButton>
    </div>
</template>
