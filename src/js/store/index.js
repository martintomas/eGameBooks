import Vue from 'vue'
import Vuex from 'vuex'
import * as mutationTypes from 'store/mutationTypes.js'

import loader from 'store/modules/loader.js'
import { editorStore } from 'editor/store/editorStore.js'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export const store = new Vuex.Store({
    namespaced: true,
    state: {
        lang: 'en',
        selectedBook: null,
    },
    modules: {
        loader: loader,
        editor: editorStore,
    },
    actions: {
        loadEditor({ dispatch, commit, state }) {
            dispatch('editor/load', { //load action is default action used at begging
                lang: state.lang,
                book: state.selectedBook
            })
        }
    },
    strict: debug,
})

if (module.hot) {
    // accept actions and mutations as hot modules
    //module.hot.accept(['./mutations', './modules/a'], () => {
    module.hot.accept(['editor/store/editorStore', './modules/loader' ], () => {
        // require the updated modules
        // have to add .default here due to babel 6 module output
        //const newMutations = require('./mutations').default
        const newModuleA = require('editor/store/editorStore').default
        const newModuleB = require('./modules/loader').default
            // swap in the new actions and mutations
        editorStore.hotUpdate({
            //mutations: newMutations,
            modules: {
                loader: newModuleA,
                editor: newModuleB,
            }
        })
    })
}