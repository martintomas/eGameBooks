<template>
    <div class='markdown-action-panel-root'>
        <div class='markdown-action-panel-buttons'>
            <div class='markdown-toolbar-button' @click="showModal('editorActionLink')">{{String.doTranslationEditor('link')}}</div>
            <div v-if="usedModules && usedModules.indexOf('item')>=0" class='markdown-toolbar-button' @click="showModal('editorActionItem')">{{String.doTranslationEditor('item')}}</div>
        </div>
        <div class='markdown-action-panel-result'>
            <editor-action-link ref='editorActionLink' :page-id='pageId' :link-data='linkData' @remove-action='removeAction' @add-action='addAction' @edit-action='editAction'></editor-action-link>
            <editor-action-item ref='editorActionItem' :page-id='pageId' :local-data='itemData' @remove-action='removeAction' @add-action='addAction' @edit-action='editAction'></editor-action-item>
        </div>

    </div>
</template>

<script>

import EditorActionLink from 'editor/components/page-main/page-editor-view/editorActionLink.vue'
import EditorActionItem from 'editor/components/page-main/page-editor-view/editorActionItem.vue'
import {messageBoxWrapper} from 'editor/services/defaults.js'
import {AllowedActions} from 'editor/constants'

export default {
    components: {
        EditorActionLink,
        EditorActionItem,
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
        usedModules() {
            return this.$store.state.editor.bookData.mainInfo.usedModules
        },
        actions() {
            if(this.pageId in this.pages) return this.pages[this.pageId].actions
            return []
        },
        linkData() {
            return this.actions.link
        },
        itemData() {
            return this.actions.item
        }
    },
    methods: {
        showModal(ref) {
            this.$refs[ref].showModal()
        },
        addAction(values) {
            //take care of action addding
            switch(values.actionType) {
                case AllowedActions.LINK:
                    this.$store.dispatch('editor/newLinkAction',values)
                    break
                case AllowedActions.ITEM:
                    this.$store.dispatch('editor/newItemAction',values)
                    break
                default:
                    console.log('Action creation. Unknown action type!')
            }
        },
        removeAction(values) {
            //take care of action removing
            messageBoxWrapper.showChoiceMessage(this.$store.commit,String.doTranslationEditor('used-action-deletion-message'),
                () => {
                    this.$store.dispatch('editor/deleteAction',values)
                }
            )
        },
        editAction(values) {
            //take care of action editing
            this.$store.dispatch('editor/editAction',values)
        }
    }
}
</script>

<style>
.markdown-action-panel-root {
    display:flex;
    flex-flow:row nowrap;
    border: 1px solid gray;
    margin: 0 0 0.25rem 0;
    width: 100%;
    /*height: 10%;*/
    min-height: 5rem;
    max-height: 15rem;
}
.markdown-action-panel-buttons {
    border-right:1px solid black;
    margin: 0.2rem;
    width:15%;
    min-width:5rem;
    max-width:12rem;
    flex: 0 0 auto;
}
.markdown-action-panel-result {
    margin:0.2rem;
    flex-grow:2;
}
.markdown-action-panel-result ul {
  list-style-type: none;
  display:inline;
  padding-left:0px;
  overflow:auto;
}
.markdown-action-panel-result li {
  display:inline-block;
}

.markdown-action-panel-result li .used {
    border-color: black;
}
.markdown-action-panel-result li .wrong-action {
    border-color: red;
}

.markdown-action-buttons {
    display:inline-block;
    padding: 0.2rem 0.5rem 0.2rem 0.5rem;
    margin: 0.2rem;
     border-radius: 1rem;
    -webkit-border-radius: 1rem;
    -moz-border-radius: 1rem;
}

</style>