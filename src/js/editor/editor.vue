<template>
    <div class="editor-root">
        <editor-toolbar></editor-toolbar>

        <div class="editor-main-root">
            <router-view name='editor-mini-page'></router-view>
            <router-view name='editor-page-view-container'></router-view>
            <router-view name='editor-elements-view'></router-view>
        </div>

        <dyn-page-detail></dyn-page-detail>
        <loader></loader>
    </div>
</template>

<script>

import fontAwesomeCss from 'font-awesome/css/font-awesome.css'
import appCss from '../../css/editor.css'
import * as defaults from 'editor/services/defaults'
import * as constants from 'editor/constants'
import * as prot from 'editor/prototypes.js'
import { store } from 'store/'

import EditorToolbar from 'editor/components/editor-toolbar/editorToolbar.vue'
import DynPageDetail from 'editor/components/page-main/page-main-text/dynPageDetail.vue'
import Loader from 'editor/components/dyn-components/loader.vue'

export default {
    props: {
        book: {
            default: '',
            type: String,
        }
    },
    components: {
        EditorToolbar,
        DynPageDetail,
        Loader
    },
    beforeRouteEnter (to, from, next) {
        //prepare loader and notification
        defaults.editorNotificationWrapper.initializeNotification(store.commit)
        defaults.editorLoaderWrapper.initializeLoader(store.commit)

        //load language
        if(!store.getters['core/languageExists'](constants.editorLangType)) {
            let prom1 = store.dispatch('core/loadEditorLanguage').then(() => { //load editor language
                defaults.editorNotificationWrapper.newInternalInfo(store.commit,'Editor is shown',true)
                next() //confirm hook when language have been loaded
            }).catch((reason) => {
                defaults.editorNotificationWrapper.newInternalError(store.commit,'Error during editor shown. Reason of error is: '+reason,true)
            })
        } else {
            defaults.editorNotificationWrapper.newInternalInfo(store.commit,'Language already loaded. Editor is shown immidatelly',true)
            next()
        }

        let prom2 = store.dispatch('editor/load', { //load book
            book: to.params.book
        }).then(() => {
            
        }).catch((reason) => {
            console.log(reason)

            //!!!!show message box for users in future
        })

    },
    beforeRouteUpdate (to, from, next) {
        //load book
        next()
    },
    beforeRouteLeave (to, from, next) {
        //clear data from editor vuex instance
    },
    mounted() {
    },
}

</script>

<style>
    .editor-root {
        display:flex;
        flex-direction:column;
        height:100vh;
    }
    .editor-main-root {
        position: relative;
        display: flex;
        flex-direction: row;
        height: 100%;
        flex-grow:2;
    }
</style>