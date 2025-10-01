<script setup="" lang="ts">
import type { Shortcut } from '@/shared/models/shortcut'

defineProps<{
    shortcuts: Shortcut[]
}>()
</script>

<template>
  <div class="shortcut-list-wrapper">
    <div class="shortcut-list-divider-lines">
      <div class="shortcut-list-divider" />
      <div class="shortcut-list-divider" />
    </div>

    <ul class="shortcut-list">
      <li
        v-for="shortcut in shortcuts"
        :key="shortcut.id"
        class="shortcut-list-item"
      >
        <div class="shortcut-item-info">
          <div class="shortcut-item-title">
            {{ shortcut.title }}
          </div>

          <span class="shortcut-site">{{ shortcut.siteUrl }}</span>
        </div>

        <span class="shortcut-hotkey">
          {{ shortcut.hotkey.map(key => key.name).join(' + ') }}
        </span>
      </li>
    </ul>
  </div>
</template>
