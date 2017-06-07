<template>
    <span>

        <ul>
           <li v-for="(value,key,index) in localData" :key="key">
                <dyn-tooltip ref='tooltipLink' :tooltip-id="generateHash('link',index)" :react-to-click='true' :react-to-hover='false' tooltip-box='editorMarkdownActionPanel'>
                    <span slot='tooltip' :component-id="generateHash('link',index)"  :class="[value.existsInText ? 'used':'',containsErrors(isActionCorrect('link',value)) ? 'wrong-action' : '','tooltip', 'markdown-action-buttons', 'markdown-action-buttons-links', 'bold']">
                    {{String.doTranslationEditor('link-small')}}:&nbsp;{{key}}&nbsp;
                        <template v-if="value.pageId != '' && value.pageId != null">
                            ({{String.doTranslationEditor('page-small')}}&nbsp;{{value.pageId}})
                        </template>
                    </span>
                    <span slot='tooltipText'>
                        <i class="fa fa-edit unactive-icon" aria-hidden="true" @click="editAction(value)"></i>
                        <i class="fa fa-question unactive-icon tooltip" aria-hidden="true" @click="showInfo(key)"></i>
                        <i class="fa fa-times-circle unactive-icon" aria-hidden="true" @click="removeAction(key)" ></i>
                    </span>
                </dyn-tooltip>
            </li>
        </ul>

    </span>
</template>

<script>
import DynTooltip from 'editor/components/dyn-components/dynTooltip.vue'
import {generateHash} from 'defaults.js'
import {AllowedActions} from 'editor/constants'
import {containsErrors,isActionCorrect} from 'editor/services/validators'

export default {
    components: {
        DynTooltip,
    },
    props: {
        pageId: null,
        linkData: Object,
    },
    data() {
        return {

        }
    },
    computed: {
        pages() {
            return this.$store.state.editor.bookData.pages
        },
        actions() {
            if(this.pageId in this.pages) return this.pages[this.pageId].actions
            return []
        },
        localData() {
            return this.actions.link
        },
    },
    methods: {
        generateHash,
        containsErrors,
        isActionCorrect,
        editAction(localData) {
            this.$emit('modal-action',{
                actionType:AllowedActions.LINK,
                action: 'edit',
                data:localData
            })
        },
        removeAction(dataId) {
            this.$emit('remove-action',{'actionType':AllowedActions.LINK,'pageId':this.pageId,'actionId':dataId,'used':this.localData[dataId].existsInText})
        },
        showInfo(dataId) {
            this.$emit('modal-action',{
                actionType:AllowedActions.LINK,
                action: 'info',
                data:this.localData[dataId]
            })
        },
    }
}

</script>

<style>
.markdown-action-buttons-links {
    border: 1px solid #FFCC99;
    background-color:#FFCC99;
    cursor:pointer;
}
</style>