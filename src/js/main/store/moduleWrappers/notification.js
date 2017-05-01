import * as mutationTypes from 'main/store/mutationTypes'
import {mainStorePrefix} from 'main/constants'

class NotificationStoreWrapper {
    constructor(notificationType,notification) {
        this.storePrefix = mainStorePrefix
        this.notificationType = notificationType
        this.notification = notification

    }
    initializeNotification(commit) {
        //add new queue to Vuex store
        commit(this.storePrefix +'/'+mutationTypes.ADD_NEW_NOTIFICATION_SOURCE,{
            notificationType:this.notificationType,
            notification: this.notification
        },{root:true})
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