export function getUniqueSelector(element: HTMLElement) {
    let path = [],
        parent

    while ((parent = element.parentElement)) {
        path.unshift(
            `${element.tagName}:nth-child(${[...parent.children].indexOf(element) + 1})`,
        )

        element = parent
    }
    return `${path.join(' > ')}`.toLowerCase()
}
