import Vue from 'vue'
import Vuex from 'vuex'

import { editorStore } from 'editor/store/editorStore.js'
import { mainStore } from 'main/store/mainStore.js'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export const store = new Vuex.Store({
    modules: {
        main: mainStore,
        editor: editorStore,
    },
    strict: debug,
})