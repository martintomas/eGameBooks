import Vue from 'vue'
import Vuex from 'vuex'

import { editorStore } from 'editor/store/editorStore.js'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export const store = new Vuex.Store({
    namespaced: true,
    modules: {
        editor: editorStore,
    },
    strict: debug,
})

function loadData() {
    //register all api calls that have to be run at start
    store.dispatch('editor/load') //load action is default action used at begging
}

loadData()