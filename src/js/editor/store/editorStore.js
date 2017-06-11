import bookDataModule from 'editor/store/modules/bookData'
import editorConfigModule from 'editor/store/modules/editorConfig'
import editorStatusModule from 'editor/store/modules/editorStatus'
import itemsModule from 'editor/store/modules/items'
import journalsModule from 'editor/store/modules/journals'
import * as mutationTypes from 'editor/store/mutationTypes'
import * as api from 'editor/api'


export const editorStore = {
    namespaced: true,
    modules: {
        bookData: bookDataModule,
        editorConfig: editorConfigModule,
        editorStatus: editorStatusModule,
        items: itemsModule,
        journals: journalsModule,
    },
    mutations: {},
    actions: {
        load({ dispatch, commit, state }, args) {
            return dispatch('loadBook', args.bookId).then(() => {
                dispatch('loadModulesWorspace',state.bookData.mainInfo.usedModules)
            })
        },
        loadModulesWorspace({dispatch,commit,state},usedModules) {
            return api.getModulesWorkspace(usedModules).then((modulesWorkspace) => {
                commit(mutationTypes.ADD_WORKSPACES,modulesWorkspace) //every modules that uses workspaces should implement this mutation
            }).catch((reason) => {

            })
        }
    },
}

if (module.hot) {
    // accept actions and mutations as hot modules
    //module.hot.accept(['./mutations', './modules/a'], () => {
    module.hot.accept(['./modules/bookData', './modules/editorConfig', './modules/editorStatus', './modules/items', './modules/journals'], () => {
        // require the updated modules
        // have to add .default here due to babel 6 module output
        //const newMutations = require('./mutations').default
        const newModuleA = require('./modules/bookData').default
        const newModuleB = require('./modules/editorConfig').default
        const newModuleC = require('./modules/editorStatus').default
        const newModuleD = require('./modules/items').default
        const newModuleE = require('./modules/journals').default
            // swap in the new actions and mutations
        editorStore.hotUpdate({
            //mutations: newMutations,
            modules: {
                bookData: newModuleA,
                editorConfig: newModuleB,
                editorStatus: newModuleC,
                items: newModuleD,
                journals: newModuleE,
            }
        })
    })
}