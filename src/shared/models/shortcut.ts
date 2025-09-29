import type { Key } from '@/shared/utils/keys'

export interface BaseShortcut {
    id: number
    title: string
    type: string
    hotkey: Key[]
    siteUrl: string
}

export interface ClickShortcut extends BaseShortcut {
    type: 'click'
    targetSelector: string
}

export type Shortcut = ClickShortcut

export type ShortcutInput = Omit<Shortcut, 'id'>
