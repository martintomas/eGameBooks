const debug = process.env.NODE_ENV !== 'production'

function constructInternalMessage(notificationType,args) {
    switch(args.type) {
        case 'info':
            if(args.debug) return notificationType+' INFO (debug): ' + args.message
            return notificationType+' INFO: ' + args.message
            break
        case 'warn':
            if(args.debug) return notificationType+' WARN (debug): ' + args.message
            return notificationType+' WARN: ' + args.message
            break
        case 'error':
            if(args.debug) return notificationType+' ERROR (debug): ' + args.message
            return notificationType+' ERROR: ' + args.message
            break
    }
}

class Notification {
    constructor(notificationType,remmemberLastNotifications=15) {
        this.notificationType = notificationType
        this.remmemberLastNotifications = remmemberLastNotifications, //how much notifications should be remmembered
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
            console.log(constructInternalMessage(this.notificationType,args))
        } else if(args.level === 'external') { //only external notifications are remmembered
            console.log(constructInternalMessage(this.notificationType,args))
            if(this.notifications.length < this.remmemberLastNotifications) this.notifications.push(args)
            else {
                this.notifications = this.notifications.splice(0,1) //remove first element
                this.notifications.push(args)
            }
        } else {
            console.log(constructInternalMessage(this.notificationType,{type:'error',message:'Notification type '+args.type+' doesnt exists.'}))
        }
    }
}

export default Notification