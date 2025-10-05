import { setupLogging } from '@/shared/app'
import { sendToCurrentTab } from '@/shared/utils/extension/messages'
import { Logger } from '@/shared/utils/logging'

setupLogging()

const logger = new Logger('background-script/main.ts')

logger.info('Background script stsarted, setting up command listeners')

chrome.commands.onCommand.addListener(command => {
    if (command === 'create-shortcut') {
        sendToCurrentTab({
            messageType: 'shortcut-creation-start',
        })
    }
})
