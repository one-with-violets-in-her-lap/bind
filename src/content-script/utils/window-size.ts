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
        window.addEventListener('resize', updateSize)
    })

    onUnmounted(() => window.removeEventListener('resize', updateSize))

    return { width, height }
}
