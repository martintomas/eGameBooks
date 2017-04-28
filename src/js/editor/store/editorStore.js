import pagesModule from 'editor/store/modules/pages'
import transModule from 'editor/store/modules/trans'
import appConfigModule from 'editor/store/modules/appConfig'
import editorStatusModule from 'editor/store/modules/editorStatus'
import notificationModule from 'editor/store/modules/notification'
import * as mutationTypes from 'editor/store/mutation-types'
import * as api from 'editor/api'


export const editorStore = {
    namespaced: true,
    modules: {
        pages: pagesModule,
        trans: transModule,
        appConf: appConfigModule,
        editorStatus: editorStatusModule,
        notification: notificationModule
    },
    mutations: {},
    actions: {
        load({ dispatch, commit }, args) {
            dispatch('loadLanguage', args.lang)
            dispatch('loadBook', args.book)
        }
    },
}

if (module.hot) {
    // accept actions and mutations as hot modules
    //module.hot.accept(['./mutations', './modules/a'], () => {
    module.hot.accept(['./modules/pages', './modules/trans', './modules/appConfig', './modules/editorStatus','./modules/notification'], () => {
        // require the updated modules
        // have to add .default here due to babel 6 module output
        //const newMutations = require('./mutations').default
        const newModuleA = require('./modules/pages').default
        const newModuleB = require('./modules/trans').default
        const newModuleC = require('./modules/appConfig').default
        const newModuleD = require('./modules/editorStatus').default
        const newModuleE = require('./modules/notification').default
            // swap in the new actions and mutations
        editorStore.hotUpdate({
            //mutations: newMutations,
            modules: {
                pages: newModuleA,
                trans: newModuleB,
                appConf: newModuleC,
                editorStatus: newModuleD,
                notification: newModuleE,
            }
        })
    })
}