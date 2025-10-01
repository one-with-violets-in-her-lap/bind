<script lang="ts" setup>
type ButtonVariant = 'default' | 'secondary'

withDefaults(
    defineProps<{
        variant?: ButtonVariant
    }>(),
    { variant: 'default' },
)
</script>
<template>
  <button
    class="app-button"
    :class="`app-button-${variant}`"
  >
    <slot />
  </button>
</template>
