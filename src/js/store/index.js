import Vue from 'vue'
import Vuex from 'vuex'
import * as mutationTypes from 'store/mutationTypes.js'

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

store.dispatch('loadEditor')