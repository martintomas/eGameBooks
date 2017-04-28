import fontAwesomeCss from 'font-awesome/css/font-awesome.css'
import Vue from 'vue'
import { router } from 'router/'
import { store } from 'store/'
import { waitForResizeEnd } from 'defaults.js'
import Editor from 'editor/editor.vue'

Vue.config.debug = true
Vue.use(Editor, { 'store': store })

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
    components: { Editor },
    store,
    router,
    render: h => h(Editor)
})