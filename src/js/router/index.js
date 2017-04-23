import Vue from 'vue'
import VueRouter from 'vue-router'

import { editorRoutes } from 'editor/router'

Vue.use(VueRouter)

export const router = new VueRouter({
    mode: 'history',
    routes: editorRoutes
})