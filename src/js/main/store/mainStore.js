import loaderModule from 'main/store/modules/loader'
import notificationModule from 'main/store/modules/notification'
import transModule from 'main/store/modules/trans'

export const mainStore = {
    namespaced: true,
    modules: {
        loader: loaderModule,
        notification: notificationModule,
        trans: transModule,
    },
    mutations: {},
    actions: {
    }

}

if (module.hot) {
    // accept actions and mutations as hot modules
    //module.hot.accept(['./mutations', './modules/a'], () => {
    module.hot.accept(['./modules/loader', './modules/notification', './modules/trans'], () => {
        // require the updated modules
        // have to add .default here due to babel 6 module output
        //const newMutations = require('./mutations').default
        const newModuleA = require('./modules/loader').default
        const newModuleB = require('./modules/notification').default
        const newModuleC = require('./modules/trans').default
            // swap in the new actions and mutations
        mainStore.hotUpdate({
            //mutations: newMutations,
            modules: {
                loader: newModuleA,
                notification: newModuleB,
                trans: newModuleC,
            }
        })
    })
}