import {
    onMounted,
    onUnmounted,
    ref,
    toRef,
    toValue,
    watch,
    type MaybeRefOrGetter,
} from 'vue'

/**
 * Reactive bounding box composables that updates the value only on scroll
 * **Resize and style changes are not handled yet**
 */
export function useBoundingBox(
    elementRef: MaybeRefOrGetter<HTMLElement | null | undefined>,
) {
    const boundingBox = ref<DOMRect>()

    function updateBoundingBox() {
        requestAnimationFrame(
            () => (boundingBox.value = toValue(elementRef)?.getBoundingClientRect()),
        )
    }

    onMounted(() => {
        document.addEventListener('scroll', updateBoundingBox, { capture: true })
    })

    onUnmounted(() =>
        document.removeEventListener('scroll', updateBoundingBox, { capture: true }),
    )

    watch(toRef(elementRef), updateBoundingBox)

    return { boundingBox }
}
