<script setup="" lang="ts">
import type { Shortcut } from '@/shared/models/shortcut'
import ThreeDotsIcon from '@/shared/components/ui/icons/ThreeDotsIcon.vue'
import AppButton from '@/shared/components/ui/app-button/AppButton.vue'
import DropdownMenu from '@/shared/components/ui/dropdown-menu/DropdownMenu.vue'
import DropdownItem from '@/shared/components/ui/dropdown-menu/DropdownItem.vue'
import TrashIcon from '@/shared/components/ui/icons/TrashIcon.vue'

defineProps<{
    shortcuts: Shortcut[]
}>()

const emit = defineEmits<{
    (event: 'delete', shortcut: Shortcut): void
}>()
</script>

<template>
    <div class="shortcut-list-wrapper">
        <div class="shortcut-list-divider-lines">
            <div class="shortcut-list-divider" />
            <div class="shortcut-list-divider" />
        </div>

        <TransitionGroup class="shortcut-list" tag="ul" name="shortcut-list-slide">
            <li
                v-for="shortcut in shortcuts"
                :key="shortcut.id"
                class="shortcut-list-item"
            >
                <div class="shortcut-item-info">
                    <div class="shortcut-item-title-container">
                        <div class="shortcut-item-title">
                            {{ shortcut.title }}
                        </div>

                        <DropdownMenu>
                            <template #trigger="{ triggerProps }">
                                <AppButton
                                    size="icon"
                                    variant="ghost"
                                    v-bind="triggerProps"
                                >
                                    <ThreeDotsIcon />
                                </AppButton>
                            </template>

                            <template #default="{ close }">
                                <DropdownItem
                                    @click="
                                        () => {
                                            close()
                                            emit('delete', shortcut)
                                        }
                                    "
                                >
                                    <TrashIcon />
                                    Delete
                                </DropdownItem>
                            </template>
                        </DropdownMenu>
                    </div>

                    <a
                        class="shortcut-site"
                        :href="shortcut.siteUrl"
                        target="_blank"
                        >{{ shortcut.siteUrl }}</a
                    >
                </div>

                <span class="shortcut-hotkey">
                    <kbd v-for="key in shortcut.hotkey" class="hotkey-key">
                        {{ key.name }}
                    </kbd>
                </span>
            </li>
        </TransitionGroup>
    </div>
</template>
