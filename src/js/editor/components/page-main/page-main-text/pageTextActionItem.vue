<template>
    <dyn-tooltip :inline='true' :reactToClick='true' :reactToHover='false' :tooltip-id="generateHash('main-text','link'+actionId)">
        <span v-html='text' slot='tooltip' :class="[isCorrect ? '' : 'error-action', 'link-text', 'tooltip']" :component-id="generateHash('main-text','link'+actionId)"></span>
        <span slot='tooltipText'>
            <template v-if="renderType === 'main'">
                {{String.doTranslationEditor('action-id')}}: {{actionId}}<br>
            </template>

            <template v-if='itemAction != null'>
                <template v-if="item != null">
                    {{String.doTranslationEditor('item-name')}}: {{item.name}}
                </template>
                <template v-else>
                    {{String.doTranslationEditor('item-name')}}: {{String.doTranslationEditor('missing-item')}}
                </template> 
                <br>
                {{String.doTranslationEditor('item-action')}}: {{String.doTranslationEditor(itemAction.action)}}
                <br>
                <template v-if="itemAction.condition != ''">
                    {{String.doTranslationEditor('condition')}}: {{itemAction.condition}}<br>
                </template>
                    
                <template v-if="renderType === 'pageDetail' && item != null">
                    <template v-if="itemAction.action === 'add'">
                        <dyn-tooltip class='dyn-tooltip'>
                            <i class="fa fa-hand-grab-o unactive-icon tooltip" aria-hidden="true" slot='tooltip' @click='addItemDetail'></i>
                            <span slot='tooltipText'>{{String.doTranslationEditor('take-item')}}</span>
                        </dyn-tooltip>
                    </template>
                    <template v-else-if="itemAction.action === 'remove'">
                        <dyn-tooltip class='dyn-tooltip'>
                            <i class="fa fa-trash-o unactive-icon tooltip" aria-hidden="true" slot='tooltip' @click='removeItemDetail'></i>
                            <span slot='tooltipText'>{{String.doTranslationEditor('remove-item')}}</span>
                        </dyn-tooltip>
                    </template>
                </template>
            </template>
            <template v-else>
                {{String.doTranslationEditor('missing-item-action')}}
            </template>            
        </span>
    </dyn-tooltip>
</template>

<script>

import DynTooltip from 'editor/components/dyn-components/dynTooltip.vue'
import { generateHash } from 'defaults.js'
import {editorNotificationWrapper,messageBoxWrapper} from 'editor/services/defaults.js'
import {AllowedActions} from 'editor/constants'
import {containsErrors,isActionCorrect} from 'editor/services/validators'

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
    data() {
        return {
            actionType: AllowedActions.Item,
        }
    },
    computed: {
        itemAction() {
            if(this.actionId in this.pageData.actions.item) return this.pageData.actions.item[this.actionId]

            //console.log('TEXT MAIN LINK WARN: link is missing')
            return null
        },
        items() {
            return this.$store.state.editor.items.workspace.local
        },
        item() {
            if(this.itemAction.ref in this.items) {
                return this.items[this.itemAction.ref]
            }
            return null
        },
        isCorrect() {
            if(this.itemAction != null) {
                return !containsErrors(isActionCorrect(this.actionType,this.itemAction))
            }
            return false
        }
    },
    mounted() {
    },
    methods: {
        generateHash,
        addItemDetail(event) {
            if(this.item != null) {
                editorNotificationWrapper.newInternalInfo(this.$store.commit,'Adding item with id: ' + this.item.localId,false)
                messageBoxWrapper.showInformationMessage(this.$store.commit,String.doTranslationEditor('item-added-inventory',this.item.name))
            }
        },
        removeItemDetail(event) {
            if(this.item != null) {
                editorNotificationWrapper.newInternalInfo(this.$store.commit,'Removing item with id: ' + this.item.localId,false)
                messageBoxWrapper.showInformationMessage(this.$store.commit,String.doTranslationEditor('item-removed-inventory',this.item.name))
            }
        },
    }
}
</script>

<style>
.link-text {
    text-decoration: underline;
    cursor: pointer
}
</style>