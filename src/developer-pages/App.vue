<script setup lang="ts">
import ShortcutFormPopup from '@/content-script/components/shortcut-form-popup/ShortcutFormPopup.vue'

const mockElement = document.createElement('div')
</script>

<template>
    <h2>Shortcut form</h2>

    <ShortcutFormPopup
        :anchor="{ x: 0, y: 0, height: 0, width: 0 }"
        :selected-element="mockElement"
        class="shortcut-form-mock"
    />
</template>

<style>
.shortcut-form-popup.shortcut-form-mock {
    position: static;
}
</style>
