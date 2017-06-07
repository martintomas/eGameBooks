<template>
    <span>

        <ul>
           <li v-for="(value,key,index) in localData" :key="key">
                <dyn-tooltip ref='tooltipLink' :tooltip-id="generateHash('item',index)" :react-to-click='true' :react-to-hover='false' tooltip-box='editorMarkdownActionPanel'>
                    <span slot='tooltip' :component-id="generateHash('item',index)"  :class="[value.existsInText ? 'used':'',containsErrors(isActionCorrect('item',value)) ? 'wrong-action' : '','tooltip', 'markdown-action-buttons', 'markdown-action-buttons-items', 'bold']">
                    {{String.doTranslationEditor('item-small')}}:&nbsp;{{key}}&nbsp;
                        <template v-if="value.ref != '' && value.ref != null">
                            ({{String.doTranslationEditor('id')}}&nbsp;{{value.ref}})
                        </template>
                        <template v-if="value.action === 'add'">
                            <i class="fa fa-arrow-up" aria-hidden="true"></i>
                        </template>
                        <template v-else-if="value.action === 'remove'">
                            <i class="fa fa-arrow-down" aria-hidden="true"></i>
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
            return this.actions.item
        },
    },
    methods: {
        generateHash,
        containsErrors,
        isActionCorrect,
        editAction(localData) {
            this.$emit('modal-action',{
                actionType:AllowedActions.ITEM,
                action: 'edit',
                data:localData
            })
        },
        removeAction(dataId) {
            this.$emit('remove-action',{'actionType':AllowedActions.ITEM,'pageId':this.pageId,'actionId':dataId,'used':this.localData[dataId].existsInText})
        },
        showInfo(dataId) {
            this.$emit('modal-action',{
                actionType:AllowedActions.ITEM,
                action: 'info',
                data:this.localData[dataId]
            })
        },
    }
}

</script>

<style>
.markdown-action-buttons-items {
    border: 1px solid #99e699;
    background-color:#99e699;
    cursor:pointer;
}
</style>