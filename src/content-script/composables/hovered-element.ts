import { onMounted, onUnmounted, ref } from 'vue'

const DEBOUNCE_MILLISECONDS = 20

export function useHoveredElement(
    options: { debouncedUpdate?: boolean } = { debouncedUpdate: false },
) {
    const abortController = new AbortController()

    const hoveredElement = ref<HTMLElement | null>(null)

    function handleMouseMove(event: Event) {
        hoveredElement.value =
            event.target instanceof HTMLElement ? event.target : null
    }

    let lastUpdateTimeoutId: number | undefined = undefined

    onMounted(() => {
        document.addEventListener(
            'mousemove',
            event => {
                if (options.debouncedUpdate) {
                    window.clearTimeout(lastUpdateTimeoutId)

                    lastUpdateTimeoutId = window.setTimeout(() => {
                        handleMouseMove(event)
                    }, DEBOUNCE_MILLISECONDS)
                } else {
                    handleMouseMove(event)
                }
            },
            {
                signal: abortController.signal,
            },
        )
    })

    onUnmounted(() => {
        abortController.abort()
    })

    return { hoveredElement }
}
