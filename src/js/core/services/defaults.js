import Vue from 'vue'
import Notification from 'core/services/notification.js'
import NotificationStoreWrapper from 'core/store/moduleWrappers/notification.js'
import LoaderStoreWrapper from 'core/store/moduleWrappers/loader.js'
import MessageBoxWrapper from 'core/store/moduleWrappers/messageBox.js'
import * as constants from 'core/constants'

export const busCore = new Vue() //used for indirect communication inside core
export const coreNotification = new Notification('CORE')
export const coreNotificationWrapper = new NotificationStoreWrapper(constants.coreNotificationType,coreNotification)
export const coreLoaderWrapper = new LoaderStoreWrapper(constants.coreLoaderType)
export const messageBoxWrapper = new MessageBoxWrapper()