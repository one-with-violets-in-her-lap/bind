<script setup lang="ts">
import { onMounted, onUnmounted, useId } from 'vue'
import { Logger } from '@/shared/utils/logging'

const logger = new Logger('dropdown-menu.vue')

const open = defineModel<boolean>('open', { default: false })

const id = useId()

function handleClick(event: Event) {
    if (!(event.target instanceof Element) || !event.target.closest('#' + id)) {
        logger.debug('Closing', event.target)

        open.value = false
    }
}

onMounted(() => document.addEventListener('click', handleClick))
onUnmounted(() => document.removeEventListener('click', handleClick))
</script>

<template>
  <div
    :id
    class="dropdown-container"
  >
    <slot
      name="trigger"
      :trigger-props="{ onClick: () => (open = !open) }"
    />

    <Transition name="dropdown-slide">
      <div
        v-show="open"
        class="dropdown-menu"
      >
        <slot :close="() => (open = false)" />
      </div>
    </Transition>
  </div>
</template>
