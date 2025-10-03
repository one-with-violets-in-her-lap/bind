<script setup lang="ts">
import { onMounted, onUnmounted, useId } from 'vue'

const open = defineModel<boolean>('open', { default: false })

const id = useId()

function handleClick(event: Event) {
    if (!(event.target instanceof Element) || !event.target.closest('#' + id)) {
        console.log('closing', event.target)

        open.value = false
    }
}

onMounted(() => document.addEventListener('click', handleClick))
onUnmounted(() => document.removeEventListener('click', handleClick))
</script>

<template>
    <div class="dropdown-container" :id>
        <slot name="trigger" :trigger-props="{ onClick: () => (open = !open) }">
        </slot>

        <Transition name="dropdown-slide">
            <div v-show="open" class="dropdown-menu">
                <slot :close="() => (open = false)"></slot>
            </div>
        </Transition>
    </div>
</template>
