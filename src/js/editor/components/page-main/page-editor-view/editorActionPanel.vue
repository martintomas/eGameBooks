<template>
    <div class='markdown-action-panel-root'>
        <div class='markdown-action-panel-buttons'>
            <div class='markdown-toolbar-button' @click="showModal('editorActionLinkModals')">{{String.doTranslationEditor('link')}}</div>
            <div v-if="usedModules && usedModules.indexOf('item')>=0" class='markdown-toolbar-button' @click="showModal('editorActionItemModals')">{{String.doTranslationEditor('item')}}</div>
        </div>
        <div class='markdown-action-panel-result' id='editorMarkdownActionPanel'>
            <div class='scroller-wrapper' ref="actionPanelWrapper">
                <div class='scroller-box'>
                    <editor-action-link ref='editorActionLink' :page-id='pageId' @remove-action='removeAction' @modal-action='modalAction'></editor-action-link>
                    <editor-action-item v-if="usedModules && usedModules.indexOf('item')>=0" ref='editorActionItem' :page-id='pageId' @remove-action='removeAction' @modal-action='modalAction'></editor-action-item>
                </div>
            </div>
        </div>

        <editor-action-item-modals ref='editorActionItemModals' :page-id='pageId' :local-data='localData' @add-action='addAction' @edit-action='editAction'></editor-action-item-modals>
        <editor-action-link-modals v-if="usedModules && usedModules.indexOf('item')>=0" ref='editorActionLinkModals' :page-id='pageId' :local-data='localData' @add-action='addAction' @edit-action='editAction'></editor-action-link-modals>
    </div>
</template>

<script>
import IScroll from 'iscroll'
import {busEditor} from 'editor/services/defaults.js'
import EditorActionLink from 'editor/components/page-main/page-editor-view/editorActionLink.vue'
import EditorActionItem from 'editor/components/page-main/page-editor-view/editorActionItem.vue'
import EditorActionItemModals from 'editor/components/page-main/page-editor-view/editorActionItemModals.vue'
import EditorActionLinkModals from 'editor/components/page-main/page-editor-view/editorActionLinkModals.vue'
import {messageBoxWrapper} from 'editor/services/defaults.js'
import {AllowedActions} from 'editor/constants'

export default {
    components: {
        EditorActionLink,
        EditorActionLinkModals,
        EditorActionItem,
        EditorActionItemModals,
    },
    props: {
        pageId: null,
    },
    data() {
        return {
            scroller: null,
            scrollWrapper: 'actionPanelWrapper',
            localData: null,
        }
    },
    computed: {
        usedModules() {
            return this.$store.state.editor.bookData.mainInfo.usedModules
        },
    },
    created() {
        busEditor.$on('editor-panel-resize', source => {
            if(this.scroller != null) {
                this.scroller.refresh()
            }
        })
    },
    mounted() {
        this.scroller = new IScroll(this.$refs[this.scrollWrapper], {
            mouseWheel: true,
            bounce: false,
            interactiveScrollbars: true,
            shrinkScrollbars: 'clip',
            scrollbars: 'custom',
        })
        setTimeout(() => {
            this.scroller.refresh();
        }, 200);
    },
    methods: {
        showModal(ref) {
            this.$refs[ref].showModal()
        },
        modalAction(data) {
            this.localData = data
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
            if(values.used) {
                messageBoxWrapper.showChoiceMessage(this.$store.commit,String.doTranslationEditor('used-action-deletion-message'),
                    () => {
                        this.$store.dispatch('editor/deleteAction',values)
                    }
                )
            } else {
                this.$store.dispatch('editor/deleteAction',values)
            }
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
    min-height: 6rem;
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
    position:relative;
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
}

</style>