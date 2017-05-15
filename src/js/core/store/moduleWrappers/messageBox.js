import * as mutationTypes from 'core/store/mutationTypes'

import {coreStorePrefix} from 'core/constants'

class MessageBoxWrapper {
    constructor() {
        this.storePrefix = coreStorePrefix
    }
    showInformationMessage(commit,message,func=null,args=null) {
        let mess = {
            type:'info',
            message:message,
            func1:func,
            args1:args,
            func2:null,
            args2:null,
            buttonType: 'ok'
        }
        this.addMessage(commit,mess)
    }
    showWarnMessage(commit,message,func=null,args=null) {
        let mess = {
            type:'info',
            message:message,
            func1:func,
            args1:args,
            func2:null,
            args2:null,
            buttonType: 'ok'
        }
        this.addMessage(commit,mess)
    }
    showErrorMessage(commit,message,func=null,args=null) {
        
    }
    showInformationMessageStorno(commit,message,func=null,args=null) {

    }
    showWarnMessageStorno(commit,message,func=null,args=null) {
        let mess = {
            type:'warn',
            message:message,
            func1:func,
            args1:args,
            func2:null,
            args2:null,
            buttonType: 'storno'
        }
        this.addMessage(commit,mess)
    }
    showErrorMessageStorno(commit,message,func=null,args=null) {
        
    }
    showChoiceMessage(commit,message,func1=null,args1=null,func2=null,args2=null) {
        let mess = {
            type:'warn',
            message:message,
            func1:func1,
            args1:args1,
            func2:func2,
            args2:args1,
            buttonType: 'choice'
        }
        this.addMessage(commit,mess)
    }
    addMessage(commit,args) {
        commit(this.storePrefix +'/'+mutationTypes.NEW_MESSAGE,args,{root:true})
    }
    deleteFirstMessage(commit) {
        commit(this.storePrefix +'/'+mutationTypes.DELETE_MESSAGE,0,{root:true})
    }
}

export default MessageBoxWrapper