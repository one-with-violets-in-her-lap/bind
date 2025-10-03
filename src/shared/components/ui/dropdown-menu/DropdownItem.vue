<script setup lang="ts">
import AppButton from '@/shared/components/ui/app-button/AppButton.vue'
</script>

<template>
    <AppButton class="dropdown-item" variant="ghost">
        <slot />
    </AppButton>
</template>
