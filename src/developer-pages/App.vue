<script setup lang="ts">
import ShortcutFormPopup from '@/content-script/components/shortcut-form-popup/ShortcutFormPopup.vue'
import AppButton from '@/shared/components/ui/app-button/AppButton.vue'
import DropdownItem from '@/shared/components/ui/dropdown-menu/DropdownItem.vue'
import DropdownMenu from '@/shared/components/ui/dropdown-menu/DropdownMenu.vue'

const mockElement = document.createElement('div')
</script>

<template>
    <section class="mb-8">
        <h2 class="mb-4">Shortcut form</h2>

        <ShortcutFormPopup
            :anchor="{ x: 0, y: 0, height: 0, width: 0 }"
            :selected-element="mockElement"
            status="success"
            class="shortcut-form-mock"
        />
    </section>

    <section class="mb-8">
        <h2 class="mb-4">Button</h2>

        <div class="mb-4">
            <AppButton variant="default" size="default"> Default </AppButton>
        </div>

        <div class="mb-4">
            <AppButton variant="secondary" size="default"> Secondary </AppButton>
        </div>

        <div class="mb-4">
            <AppButton variant="ghost" size="default"> Ghost </AppButton>
        </div>
    </section>

    <section>
        <h2 class="mb-4">Dropdown menu</h2>

        <DropdownMenu class="dropdown-menu-story">
            <template #trigger="{ triggerProps }">
                <AppButton variant="ghost" v-bind="triggerProps">Open menu</AppButton>
            </template>

            <template #default>
                <DropdownItem> Item 1 </DropdownItem>

                <DropdownItem> Item 2 </DropdownItem>

                <DropdownItem> Item 3 </DropdownItem>
            </template>
        </DropdownMenu>
    </section>
</template>

<style>
body {
    background-color: black;
    padding: 20px;
    padding-bottom: 200px;
}

.shortcut-form-popup.shortcut-form-mock {
    position: static;
}

.dropdown-menu-story {
    padding-right: 60px;
    width: fit-content;
}
</style>
