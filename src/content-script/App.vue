<script lang="ts" setup>
import { useHoveredElement } from '@/content-script/composables/hovered-element'
import { computed } from 'vue'

const { hoveredElement } = useHoveredElement({ debouncedUpdate: true })

const hoveredElementBoundingClientRect = computed(() =>
    hoveredElement.value?.getBoundingClientRect(),
)
</script>

<template>
    <Transition name="scale" appear>
        <div class="status-popup">
            <h2 class="heading-h2">Choose a button to bind</h2>
        </div>
    </Transition>

    <Transition name="fade" appear>
        <div
            v-if="hoveredElementBoundingClientRect"
            class="hovered-element-highlight"
            :style="`left: ${hoveredElementBoundingClientRect.x}px; top: ${hoveredElementBoundingClientRect.y}px; width: ${hoveredElementBoundingClientRect.width}px; height: ${hoveredElementBoundingClientRect.height}px`"
        ></div>
    </Transition>
</template>
