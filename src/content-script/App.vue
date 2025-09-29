<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { Shortcut } from '@/shared/models/shortcut'
import AppButton from '@/shared/components/ui/app-button/AppButton.vue'
import { addContentScriptMessageListener, sendToPopup } from '@/shared/utils/messages'
import { useHoveredElement } from '@/shared/utils/hovered-element'
import { useBoundingBox } from '@/shared/utils/bounding-box'
import ShortcutFormPopup from '@/content-script/components/shortcut-form-popup/ShortcutFormPopup.vue'

const state = ref<
    | {
          status: 'inactive'
      }
    | {
          status: 'selection'
      }
    | {
          status: 'form'
          selectedElement: HTMLElement
      }
    | {
          status: 'success'
          createdShortcut: Shortcut
      }
>({ status: 'selection' })

const { hoveredElement } = useHoveredElement({ debouncedUpdate: true })

watch(hoveredElement, (newElement, previousElement) => {
    if (state.value.status === 'inactive') {
        return
    }

    newElement?.addEventListener('click', handleElementSelection, { capture: true })
    previousElement?.removeEventListener('click', handleElementSelection, {
        capture: true,
    })
})

const { boundingBox: hoveredElementBoundingBox } = useBoundingBox(hoveredElement)
const { boundingBox: selectedElementBoundingBox } = useBoundingBox(() =>
    state.value.status === 'form' ? state.value.selectedElement : null,
)

const boundingClientRect = computed(() =>
    state.value.status === 'form'
        ? selectedElementBoundingBox.value
        : hoveredElementBoundingBox.value,
)

const abortController = new AbortController()

onMounted(() => {
    addContentScriptMessageListener(
        'shortcut-creation-start',
        handleShortcutCreationStart,
        {
            signal: abortController.signal,
        },
    )
})

onUnmounted(() => {
    abortController.abort()
})

function handleShortcutCreationStart() {
    state.value = { status: 'selection' }
}

function handleCancel() {
    state.value = { status: 'inactive' }
}

function handleNewShortcut(shortcut: Shortcut) {
    sendToPopup({ messageType: 'new-shortcut', data: shortcut })
    state.value = { status: 'success', createdShortcut: shortcut }
}

async function handleElementSelection(event: Event) {
    if (state.value.status !== 'selection') {
        return
    }

    if (event.target instanceof HTMLElement && event.target.id === 'bindAppRoot') {
        return
    }

    event.stopPropagation()
    event.preventDefault()

    if (!(event.target instanceof HTMLElement)) {
        throw new Error('Selected element is not an instance of HTMLElement')
    }

    state.value = { selectedElement: event.target, status: 'form' }
}
</script>

<template>
    <Transition name="scale" appear>
        <div v-if="state.status === 'selection'" class="status-popup">
            <h2 class="heading-h2 mb-4">Click on a button to bind</h2>

            <AppButton @click="handleCancel"> Cancel </AppButton>
        </div>
    </Transition>

    <Transition name="fade" appear>
        <div
            v-if="
                (state.status === 'selection' || state.status === 'form') &&
                boundingClientRect
            "
            class="hovered-element-highlight"
            :class="{ 'selected-element-highlight': state.status === 'form' }"
            :style="
                `left: ${boundingClientRect.x}px; ` +
                `top: ${boundingClientRect.y}px; ` +
                `width: ${boundingClientRect.width}px; ` +
                `height: ${boundingClientRect.height}px`
            "
        ></div>
    </Transition>

    <Transition name="scale" appear>
        <ShortcutFormPopup
            v-if="state.status === 'form' && boundingClientRect"
            :anchor="boundingClientRect"
            :selected-element="state.selectedElement"
            @cancel="handleCancel"
            @submit="handleNewShortcut"
        />
    </Transition>

    <Transition name="scale" appear>
        <div v-if="state.status === 'success'" class="status-popup">
            <h2 class="heading-h2 mb-4">Shortcut created</h2>

            <AppButton @click="handleCancel"> OK </AppButton>
        </div>
    </Transition>
</template>
