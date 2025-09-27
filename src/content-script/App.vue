<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useHoveredElement } from '@/content-script/utils/hovered-element'
import AppButton from '@/shared/components/ui/app-button/AppButton.vue'
import { addContentScriptMessageListener } from '@/shared/lib/messages'

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

const hoveredElementBoundingClientRect = computed(() =>
    hoveredElement.value?.getBoundingClientRect(),
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
            v-if="state.status === 'selection' && hoveredElementBoundingClientRect"
            class="hovered-element-highlight"
            :style="
                `left: ${hoveredElementBoundingClientRect.x}px; ` +
                `top: ${hoveredElementBoundingClientRect.y}px; ` +
                `width: ${hoveredElementBoundingClientRect.width}px; ` +
                `height: ${hoveredElementBoundingClientRect.height}px`
            "
        ></div>
    </Transition>

    <Transition name="scale" appear>
        <div
            v-if="state.status === 'form' && hoveredElementBoundingClientRect"
            class="shortcut-form-popup"
            :style="
                `left: ${state.selectedElement.getBoundingClientRect().x + state.selectedElement.getBoundingClientRect().width + 20}px; ` +
                `top: ${state.selectedElement.getBoundingClientRect().y}px; `
            "
        >
            <h2 class="heading-h2 mb-4">
                New shortcut -
                {{
                    state.selectedElement.textContent ||
                    state.selectedElement.title ||
                    state.selectedElement.id ||
                    state.selectedElement.className
                }}
            </h2>

            <AppButton> Create </AppButton>
        </div>
    </Transition>
</template>
