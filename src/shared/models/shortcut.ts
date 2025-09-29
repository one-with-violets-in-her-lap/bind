import type { Key } from '@/shared/utils/keys'

export interface BaseShortcut {
    title: string
    type: string
    hotkey: Key[]
}

export interface ClickShortcut extends BaseShortcut {
    type: 'click'
    targetSelector: string
}

export type Shortcut = ClickShortcut
