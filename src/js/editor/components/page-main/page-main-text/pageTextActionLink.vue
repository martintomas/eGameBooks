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
                <br>

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
import {busEditor} from 'editor/defaults.js'
import * as mutationTypes from 'editor/store/mutation-types'

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
            for(let i=0;i<this.pageData.actions.link.length;i++) {
                if(this.pageData.actions.link[i].id === this.actionId) return this.pageData.actions.link[i]
            }
            //console.log('TEXT MAIN LINK WARN: link is missing')
            this.$store.commit('editor/'+mutationTypes.NEW_NOTIFICATION,{type:'warn',level:'internal',debug:false,
                message:'text action link warn: link is missing'
            })
            return null
        }
    },
    mounted() {
    },
    methods: {
        generateHash,
        showPageDetail(events) {
            //console.log('Continuing reading to page: ' + this.linkData.pageId)
            this.$store.commit('editor/'+mutationTypes.NEW_NOTIFICATION,{type:'info',level:'internal',debug:false,
                message:'Continuing reading to page: ' + this.linkData.pageId
            })

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