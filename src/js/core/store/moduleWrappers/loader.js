import * as mutationTypes from 'core/store/mutationTypes'
import {coreStorePrefix} from 'core/constants'

class LoaderStoreWrapper {
    constructor(loaderType) {
        this.storePrefix = coreStorePrefix
        this.loaderType = loaderType        
    }
    initializeLoader(commit) {
        //add new queue to Vuex store
        commit(this.storePrefix +'/'+mutationTypes.ADD_NEW_LOADER_SOURCE,{
            loaderType:this.loaderType,
        },{root:true})
    }
    addLoader(commit,id,text) {
        commit(this.storePrefix +'/'+mutationTypes.ADD_LOADER, {id:id,text:text,loaderType:this.loaderType},{root:true})
    }
    removeLoader(commit,id=null) {
        commit(this.storePrefix +'/'+mutationTypes.REMOVE_LOADER, {id:id,loaderType:this.loaderType},{root:true})
    }
    getLoaders(store) {
        return store.getters[this.storePrefix + '/getLoaders'](this.loaderType)
    }
}

export default LoaderStoreWrapper