import Vue from 'vue'
import * as mutationTypes from 'main/store/mutationTypes'
import Loader from 'main/services/loader'
import {mainNotification} from 'main/services/defaults.js'

export default {
    state: {
        loaders: {},
    },
    mutations: {
        [mutationTypes.ADD_NEW_LOADER_SOURCE](state, args) {
            //args: loaderType,loader
            Vue.set(state.loaders,args.loaderType,new Loader())

            mainNotification.newInternalInfo('New loader queue has been added. Type of queue is ' + args.loaderType,true)
        },
        [mutationTypes.ADD_LOADER](state, args) {
            if(!('id' in args)) args.id = null

            if(args.loaderType in state.loaders) state.loaders[args.loaderType].addLoaderQueue(args.text,args.id)
            else mainNotification.newInternalError('Loader cannot be added because appropriate queue is missing. Type of loader queue is '+args.loaderType,true)
        },
        [mutationTypes.REMOVE_LOADER](state, args) {
            if(!(args.loaderType in state.loaders)) mainNotification.newInternalError('Loader cannot be removed because appropriate queue is missing. Type of loader queue is '+args.loaderType,true)

            if('id' in args || args.id != null) state.loaders[args.loaderType].removeLoaderQueue(args.id)
            else state.loaders[args.loaderType].removeLoaderSimple(args.text)
        }
    },
    getters: {
        getLoaders: (state, getters) => (loaderType) => {
            return state.loaders[loaderType].loaderQueue
        }
    }
}