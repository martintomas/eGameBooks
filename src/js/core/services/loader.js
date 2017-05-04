import Vue from 'vue'

class Loader {
    constructor() {
        this.loaderQueue = []
    }
    addLoaderQueue(message,actionId=null) {
        if(actionId === null) actionId = Math.random()
        Vue.set(this.loaderQueue,this.loaderQueue.length,{message:message,id:actionId})
        return actionId
    }
    removeLoaderQueue(actionId) {
        for(let i=0;i<this.loaderQueue.length;i++) {
            if(this.loaderQueue[i].id === actionId) {
                //this.loaderQueue = this.loaderQueue.splice(i,1)
                Vue.delete(this.loaderQueue,i)
            }
        }
    }
    removeLoaderSimple(message) {
        for(let i=0;i<this.loaderQueue.length;i++) {
            if(this.loaderQueue[i].message === message) {
                //this.loaderQueue = this.loaderQueue.splice(i,1)
                Vue.delete(this.loaderQueue,i)
            }
        }
    }
}

export default Loader