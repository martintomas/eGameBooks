import {mainStorePrefix} from 'main/constants'

class MessageBoxWrapper {
    constructor() {
        this.storePrefix = mainStorePrefix
    }
    showInformationMessage(commit,message,func=null,args=null) {

    }
    showWarnMessage(commit,message,func=null,args=null) {

    }
    showErrorMessage(commit,message,func=null,args=null) {
        
    }
    showChoiceMessage(commit,message,func1=null,args1=null,func2=null,args2=null) {
        
    }
    addMessage(commit,args) {
        commit(this.storePrefix +'/'+mutationTypes.NEW_MESSAGE,args,{root:true})
    }
    deleteFirstMessage(commit) {
        commit(this.storePrefix +'/'+mutationTypes.DELETE_MESSAGE,0,{root:true})
    }
}

export default MessageBoxWrapper