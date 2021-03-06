import * as mutationTypes from 'core/store/mutationTypes'
import {coreStorePrefix} from 'core/constants'

class NotificationStoreWrapper {
    constructor(notificationType,notification) {
        this.storePrefix = coreStorePrefix
        this.notificationType = notificationType
        this.notification = notification
        this.initialized = false
    }
    initializeNotification(commit) {
        if(!this.initialized) {
            //add new queue to Vuex store
            commit(this.storePrefix +'/'+mutationTypes.ADD_NEW_NOTIFICATION_SOURCE,{
                notificationType:this.notificationType,
                notification: this.notification
            },{root:true})

            this.initialized = true
        }
    }
    newInternalInfo(commit,message,debug=false) {
        this.newNotification(commit,{message:message,debug:debug,level:'internal',type:'info'})
    }
    newInternalWarn(commit,message,debug=false) {
        this.newNotification(commit,{message:message,debug:debug,level:'internal',type:'warn'})
    }
    newInternalError(commit,message,debug=false) {
        this.newNotification(commit,{message:message,debug:debug,level:'internal',type:'error'})
    }
    newExternalInfo(commit,message) {
        this.newNotification(commit,{message:message,debug:false,level:'external',type:'info'})
    }
    newExternalWarn(commit,message) {
        this.newNotification(commit,{message:message,debug:false,level:'external',type:'warn'})
    }
    newExternalError(commit,message) {
        this.newNotification(commit,{message:message,debug:false,level:'external',type:'error'})
    }
    newNotification(commit,args) {
        args.notificationType = this.notificationType
        commit(this.storePrefix +'/'+mutationTypes.ADD_NOTIFICATION,args,{root:true})
    }
    getNotifications(store,id=null) {
        if(id != null) return store.getters[this.storePrefix+'/getNotification'](this.notificationType,id)
        else return store.getters[this.storePrefix+'/getAllNotifications'](this.notificationType)
    }
}

export default NotificationStoreWrapper