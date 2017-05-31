import Vue from 'vue'
import Notification from 'core/services/notification.js'
import NotificationStoreWrapper from 'core/store/moduleWrappers/notification.js'
import LoaderStoreWrapper from 'core/store/moduleWrappers/loader.js'
import MessageBoxWrapper from 'core/store/moduleWrappers/messageBox.js'
import ConditionGraph from 'editor/services/conditions'
import * as constants from 'editor/constants'

export const busEditor = new Vue() //used for indirect communication inside editor
export const editorNotification = new Notification('EDITOR')
export const editorNotificationWrapper = new NotificationStoreWrapper(constants.editorNotificationType,editorNotification)
export const editorLoaderWrapper = new LoaderStoreWrapper(constants.editorLoaderType)
export const messageBoxWrapper = new MessageBoxWrapper()
export const editorConditionGraph = new ConditionGraph()