import fontAwesomeCss from 'font-awesome/css/font-awesome.css'
import Vue from 'vue'
import * as prot from 'prototypes.js'
import { router } from 'router/'
import { store } from 'store/'
import { waitForResizeEnd } from 'defaults.js'

import Index from 'core/index.vue'

Vue.config.debug = true

export const bus = new Vue() //used for indirect communication

window.onclick = function(e) {
    bus.$emit('automatic-hide', e)
}

window.onresize = function(e) {
    waitForResizeEnd(() => {
        bus.$emit('window-resize-end', e)
    }, window)
}

const root = new Vue({
    el: '#app',
    components: { Index },
    store,
    router,
    render: h => h(Index)
})