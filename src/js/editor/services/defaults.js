import Vue from 'vue'
import Notification from 'main/services/notification.js'
import NotificationStoreWrapper from 'main/store/moduleWrappers/notification.js'
import LoaderStoreWrapper from 'main/store/moduleWrappers/loader.js'
import * as constants from 'editor/constants'

export const busEditor = new Vue() //used for indirect communication inside editor
export const editorNotification = new Notification('EDITOR')
export const editorNotificationWrapper = new NotificationStoreWrapper(constants.editorNotificationType,editorNotification)
export const editorLoaderWrapper = new LoaderStoreWrapper(constants.editorLoaderType)