import Vue from 'vue'
import VueRouter from 'vue-router'

import { editorRoutes } from 'editor/router'
import { mainRoutes } from 'main/router'

import Main from 'main/main.vue'
import Editor from 'editor/editor.vue'

Vue.use(VueRouter)

export const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            components: {
                'main-center-view':Main,
            },
            name: 'main-view',
            //children: mainRoutes
        }, {
            path: '/book/:bookId/editor(/save/)?:saveId?',
            components: {
                'main-center-view':Editor,
            },
            props: { 'main-center-view': true },
            children: editorRoutes
        }
    ]
})