<script lang="ts" setup>
type ButtonVariant = 'default' | 'secondary' | 'ghost'
type ButtonSize = 'default' | 'icon'

withDefaults(
    defineProps<{
        variant?: ButtonVariant
        size?: ButtonSize
    }>(),
    { variant: 'default', size: 'default' },
)
</script>
<template>
    <button class="app-button" :class="`app-button-variant-${variant} app-button-size-${size}`">
        <slot />
    </button>
</template>
