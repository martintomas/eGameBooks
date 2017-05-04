import loaderModule from 'core/store/modules/loader'
import notificationModule from 'core/store/modules/notification'
import transModule from 'core/store/modules/trans'
import messageBoxModule from 'core/store/modules/messageBox'

export const coreStore = {
    namespaced: true,
    modules: {
        loader: loaderModule,
        notification: notificationModule,
        trans: transModule,
        messageBox: messageBoxModule,
    },
    mutations: {},
    actions: {
    }

}

if (module.hot) {
    // accept actions and mutations as hot modules
    //module.hot.accept(['./mutations', './modules/a'], () => {
    module.hot.accept(['./modules/loader', './modules/notification', './modules/trans','./modules/messageBox'], () => {
        // require the updated modules
        // have to add .default here due to babel 6 module output
        //const newMutations = require('./mutations').default
        const newModuleA = require('./modules/loader').default
        const newModuleB = require('./modules/notification').default
        const newModuleC = require('./modules/trans').default
        const newModuleD = require('./modules/messageBox').default
            // swap in the new actions and mutations
        coreStore.hotUpdate({
            //mutations: newMutations,
            modules: {
                loader: newModuleA,
                notification: newModuleB,
                trans: newModuleC,
                messageBox: newModuleD
            }
        })
    })
}