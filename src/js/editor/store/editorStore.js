import bookDataModule from 'editor/store/modules/bookData'
import editorConfigModule from 'editor/store/modules/editorConfig'
import editorStatusModule from 'editor/store/modules/editorStatus'
import * as mutationTypes from 'editor/store/mutationTypes'
import * as api from 'editor/api'


export const editorStore = {
    namespaced: true,
    modules: {
        bookData: bookDataModule,
        editorConfig: editorConfigModule,
        editorStatus: editorStatusModule,
    },
    mutations: {},
    actions: {
        load({ dispatch, commit }, args) {
            dispatch('loadBook', args.book)
        }
    },
}

if (module.hot) {
    // accept actions and mutations as hot modules
    //module.hot.accept(['./mutations', './modules/a'], () => {
    module.hot.accept(['./modules/bookData', './modules/editorConfig', './modules/editorStatus'], () => {
        // require the updated modules
        // have to add .default here due to babel 6 module output
        //const newMutations = require('./mutations').default
        const newModuleA = require('./modules/bookData').default
        const newModuleB = require('./modules/editorConfig').default
        const newModuleC = require('./modules/editorStatus').default
            // swap in the new actions and mutations
        editorStore.hotUpdate({
            //mutations: newMutations,
            modules: {
                bookData: newModuleA,
                editorConfig: newModuleB,
                editorStatus: newModuleC,
            }
        })
    })
}