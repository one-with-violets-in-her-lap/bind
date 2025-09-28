<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import AppButton from '@/shared/components/ui/app-button/AppButton.vue'
import { addContentScriptMessageListener } from '@/shared/lib/messages'
import { useHoveredElement } from './utils/hovered-element'
import ShortcutFormPopup from './components/shortcut-form-popup/ShortcutFormPopup.vue'

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

const boundingClientRect = computed(() =>
    state.value.status === 'form'
        ? state.value.selectedElement.getBoundingClientRect()
        : hoveredElement.value?.getBoundingClientRect(),
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
	</ShortcutFormPopup>
    </Transition>
</template>
