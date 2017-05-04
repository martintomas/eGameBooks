<template>
    <dyn-tooltip :inline='true' :reactToClick='true' :reactToHover='false' :tooltip-id="generateHash('main-text','link'+actionId)">
        <span v-html='text' slot='tooltip' class='link-text tooltip' :component-id="generateHash('main-text','link'+actionId)"></span>
        <span slot='tooltipText'>
            <template v-if="renderType === 'main'">
                {{String.doTranslationEditor('action-id')}}: {{actionId}}<br>
            </template>

            <template v-if="linkData != null">
                <template v-if="linkData.pageId != null">
                    {{String.doTranslationEditor('page-number')}}: {{linkData.pageId}}
                </template>
                <template v-else>
                    {{String.doTranslationEditor('missing-page')}}
                </template> 
                <br>

                <template v-if="linkData.condition != ''">
                    {{String.doTranslationEditor('condition')}}: {{linkData.condition}}<br>
                </template>
                
                <template v-if="renderType === 'pageDetail' && linkData.pageId != null">
                    <dyn-tooltip class='dyn-tooltip'>
                        <i class="fa fa-hand-o-right unactive-icon tooltip" aria-hidden="true" slot='tooltip' @click='showPageDetail'></i>
                        <span slot='tooltipText'>{{String.doTranslationEditor('continue-to-page')}}</span>
                    </dyn-tooltip>
                </template>
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
import {busEditor,editorNotificationWrapper} from 'editor/services/defaults.js'
import * as mutationTypes from 'editor/store/mutationTypes'

export default {
    components: {
        DynTooltip
    },
    props: {
        pageData: null,
        renderType: '',
        actionId: {
            default: 0,
            type: Number
        },
        text: ''
    },
    computed: {
        linkData() {
            if(this.actionId in this.pageData.actions.link) return this.pageData.actions.link[this.actionId]

            //console.log('TEXT MAIN LINK WARN: link is missing')
            return null
        }
    },
    mounted() {
    },
    methods: {
        generateHash,
        showPageDetail(events) {
            //console.log('Continuing reading to page: ' + this.linkData.pageId)
            editorNotificationWrapper.newInternalInfo(this.$store.commit,'Continuing reading to page: ' + this.linkData.pageId,false)
            // this.$store.commit('editor/'+mutationTypes.NEW_NOTIFICATION,{type:'info',level:'internal',debug:false,
            //     message:'Continuing reading to page: ' + this.linkData.pageId
            // })

            if (event) event.stopPropagation()

            busEditor.$emit('show-page-detail',this.linkData.pageId)
        }
    }
}
</script>

<style>
.link-text {
    text-decoration: underline;
    cursor: pointer
}
</style>