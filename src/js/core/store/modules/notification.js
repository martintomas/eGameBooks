import Vue from 'vue'
import * as mutationTypes from 'core/store/mutationTypes'
import {coreNotification} from 'core/services/defaults.js'

export default {
    state: {
        notificators: {},
    },
    mutations: {
        [mutationTypes.ADD_NEW_NOTIFICATION_SOURCE](state, args) {
            //args: notificationType,notification
            Vue.set(state.notificators,args.notificationType,args.notification)

            coreNotification.newInternalInfo('New notification queue has been added. Type of queue is ' + args.notificationType,true)
        },
        [mutationTypes.ADD_NOTIFICATION](state,args) {
            state.notificators[args.notificationType].addNew(args)
        }
    },
    getters: {
        getNotification : (state, getters) => (notificationType,notificationId) => {
            if(notificationId >= state.notificators[notificationType].notifications.length || notificationId < 0) {
                return null
            } else {
                return state.notificators[notificationType].notifications[notificationId]
            }
        },
        getAllNotifications : (state, getters) => (notificationType) => {
            return state.notificators[notificationType].notifications
        }
    }
}