import Vue from 'vue'
import Notification from 'main/services/notification.js'
import NotificationStoreWrapper from 'main/store/moduleWrappers/notification.js'
import LoaderStoreWrapper from 'main/store/moduleWrappers/loader.js'
import * as constants from 'main/constants'

export const busMain = new Vue() //used for indirect communication inside main
export const mainNotification = new Notification('MAIN')
export const mainNotificationWrapper = new NotificationStoreWrapper(constants.mainNotificationType,mainNotification)
export const mainLoaderWrapper = new LoaderStoreWrapper(constants.mainLoaderType)