import { onMounted, onUnmounted, ref } from 'vue'

export function useWindowSize() {
    const width = ref<number>()
    const height = ref<number>()

    function updateSize() {
        width.value = window.innerWidth
        height.value = window.innerHeight
    }

    onMounted(() => {
        updateSize()
        addEventListener('resize', updateSize)
    })

    onUnmounted(() => removeEventListener('resize', updateSize))

    return { width, height }
}
