class MainStoreWrapper {
    constructor(store) {
        this.store = store
    }
    commit(type,payload,options) {
        store.commit(type,payload,{root:true})
    }
}