<template>
    <div class="editor-root">
        <router-view name='mini-page'></router-view>
        <router-view name='page-view-container'></router-view>
        <router-view name='elements-view'></router-view>
    </div>
</template>

<script>

import fontAwesomeCss from 'font-awesome/css/font-awesome.css'
import appCss from '../../css/editor.css'
import * as prot from 'editor/prototypes.js'

export default {
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
        position: relative;
        display: flex;
        flex-direction: row;
        height: 100%;
    }
</style>