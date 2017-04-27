<template>
    <dyn-tooltip :inline='true' :reactToClick='true' :reactToHover='false' :tooltip-id="generateHash('main-text','link'+actionId)">
        <span v-html='text' slot='tooltip' class='link-text tooltip' :component-id="generateHash('main-text','link'+actionId)"></span>
        <span slot='tooltipText'>
            <template v-if="linkData != null">
                <template v-if="linkData.pageId != null">
                Page number: {{linkData.pageId}}
                </template>
                <template v-else>
                    {{String.doTranslationEditor('missing-page')}}
                </template> 
                <br>
                condition: {{linkData.condition}}
            </template>
            <template v-else>
                {{String.doTranslationEditor('missing-link')}}
            </template>            
        </span>
    </dyn-tooltip>
</template>

<script>

import DynTooltip from 'editor/components/dyn-components/dynTooltip.vue'
import { generateHash } from 'defaults.js'

export default {
    components: {
        DynTooltip
    },
    props: {
        pageData: null,
        actionId: {
            default: 0,
            type: Number
        },
        text: ''
    },
    computed: {
        linkData() {
            for(let i=0;i<this.pageData.actions.link.length;i++) {
                if(this.pageData.actions.link[i].id === this.actionId) return this.pageData.actions.link[i]
            }
            console.log('TEXT MAIN LINK WARN: link is missing')
            return null
        }
    },
    mounted() {
    },
    methods: {
        generateHash
    }
}
</script>

<style>
.link-text {
    text-decoration: underline;
    cursor: pointer
}
</style>