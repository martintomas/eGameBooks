import * as mutationTypes from 'editor/store/mutation-types'

const debug = process.env.NODE_ENV !== 'production'

function constructInternalMessage(args) {
    switch(args.type) {
        case 'info':
            return 'EDITOR INFO: ' + args.message
            break
        case 'warn':
            return 'EDITOR WARN: ' + args.message
            break
        case 'error':
            return 'EDITOR ERROR: ' + args.message
            break
    }
}

class Notification {
    constructor() {
        this.remmemberLastNotifications = 15, //how much notifications should be remmembered
        this.notifications = []
    }
    newInternalInfo(message,debug=false) {
        return this.addNew({message:message,debug:debug,level:'internal',type:'info'})
    }
    newInternalWarn(message,debug=false) {
        return this.addNew({message:message,debug:debug,level:'internal',type:'warn'})
    }
    newInternalError(message,debug=false) {
        return this.addNew({message:message,debug:debug,level:'internal',type:'error'})
    }
    newExternalInfo(message) {
        return this.addNew({message:message,debug:false,level:'external',type:'info'})
    }
    addNew(args = {}) {
        //args should contain following informations
        //debug --> should be shown only when app is debug?
        //level --> where message should be shown (internal, external)
        //type --> type of notification (info, warn, error)
        //message --> text of message

        if(!('level' in args)) args.level = 'internal' //internal message level is default one
        if(!('type' in args)) args.type = 'info' //info message type is default one
        if(!('debug' in args)) args.debug = false //debug is false by default

        if(!debug && args.debug) return //show debug messages only in case that debug is allowed

        if(args.level === 'internal') {
            console.log(constructInternalMessage(args))
        } else if(args.level === 'external') { //only external notifications are remmembered
            console.log(constructInternalMessage(args))
            if(this.notifications.length < this.remmemberLastNotifications) this.notifications.push(args)
            else {
                this.notifications = this.notifications.splice(0,1) //remove first element
                this.notifications.push(args)
            }
        } else {
            console.log('EDITOR WARN: notification type is missing')
        }
    }
}

export const notification = new Notification()

export default {
    state: {
        notif: notification,
        notifications: notification.notifications //shortcut that lead to real notifications messages
    },
    mutations: {
        [mutationTypes.NEW_NOTIFICATION](state, args) {
            state.notif.addNew(args)
        }
    }
}