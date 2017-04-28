import * as mutationTypes from 'store/mutationTypes.js'
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

export const loader = new Loader()

export default {
    namespaced: true,
    state: {
        loader: loader,
        loaderQueue: loader.loaderQueue,
    },
    mutations: {
        [mutationTypes.MODIFY_LOADER_QUEUE](state, queueArgs) {
            //queueArgs should contain 
            //text --> action description
            //start --> true/false if it is action start --> otherwise it is end
            //id of loader action

            if(!('start' in queueArgs)) queueArgs.start = true
            if(!('id' in queueArgs)) queueArgs.id = null

            if(queueArgs.start) {
                loader.addLoaderQueue(queueArgs.text,queueArgs.id)
            } else {
                if(queueArgs.id != null) loader.removeLoaderQueue(queueArgs.id)
                else loader.removeLoaderSimple(queueArgs.text)
            }
        }
    }
}