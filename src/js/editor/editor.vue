<template>
    <div class="editor-root">
        <editor-toolbar></editor-toolbar>

        <div class="editor-main-root">
            <router-view name='mini-page'></router-view>
            <router-view name='page-view-container'></router-view>
            <router-view name='elements-view'></router-view>
        </div>

        <dyn-page-detail></dyn-page-detail>
    </div>
</template>

<script>

import fontAwesomeCss from 'font-awesome/css/font-awesome.css'
import appCss from '../../css/editor.css'
import * as prot from 'editor/prototypes.js'

import EditorToolbar from 'editor/components/editor-toolbar/editorToolbar.vue'
import DynPageDetail from 'editor/components/page-main/page-main-text/dynPageDetail.vue'

export default {
    components: {
        EditorToolbar,
        DynPageDetail
    },
    mounted() {
    },
    install(Vue,options) {
        if(!('store' in options)) {
            console.log('Editor registration error --> store was not provided')
        }
        
        Vue.mixin({ //globaly register editor store variable
            data() {
                return {
                    editorStore: options.store.state.editor
                }
            }
        })
    }
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