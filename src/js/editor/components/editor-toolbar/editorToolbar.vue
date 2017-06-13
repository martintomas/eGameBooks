<template>
    <div class='editor-toolbar-root'>
        <div class='editor-toolbars-buttons'>
            <span class='editor-toolbar-button' @click='saveBook'>{{String.doTranslationEditor('save')}}</span>
            <span class='editor-toolbar-button' @click='saveAsBook'>{{String.doTranslationEditor('save-as')}}</span>
            <span class='editor-toolbar-button' @click='loadBook'>{{String.doTranslationEditor('load')}}</span>
            <span class='editor-toolbar-button' @click='newPageSimple'>{{String.doTranslationEditor('new-page-simple')}}</span>
            <span class='editor-toolbar-button' @click='undoAction'>
                {{String.doTranslationEditor('undo')}}&nbsp;({{undoActions.length}})
                <span class='dropbtn' style='display:inline-block;' :component-id="undoDropdownId" @click='undoActionsDropdown'>
                    <i class="fa fa-chevron-down unactive-icon dropbtn" aria-hidden="true" :component-id="undoDropdownId"></i>
                    <div class="dropdown-toolbar-header-content editor-toolbar-dropdown-content" ref="dropdownUndoToolbar">
                        <div class='whisperer-scroller'>
                            <a v-for='(model, index) in undoActions' @click='runUndo(index)'>{{model.name}}</a>
                        </div>
                    </div>
                </span>
                
            </span>
            <span class='editor-toolbar-button' @click='redoAction'>
                {{String.doTranslationEditor('redo')}}&nbsp;({{redoActions.length}})
                <span class='dropbtn' style='display:inline-block;' :component-id="redoDropdownId" @click='redoActionsDropdown'>
                    <i class="fa fa-chevron-down unactive-icon dropbtn" aria-hidden="true" :component-id="redoDropdownId"></i>
                    <div class="dropdown-toolbar-header-content editor-toolbar-dropdown-content" ref="dropdownRedoToolbar">
                        <div class='whisperer-scroller'>
                            <a v-for='(model, index) in redoActions' @click='runRedo(index)'>{{model.name}}</a>
                        </div>
                    </div>
                </span>
            </span>
        </div>
        <notification-line class='notification-line'></notification-line>
        <div class='float-right'>
            <span class='editor-toolbar-button' @click='editSettings'>{{String.doTranslationEditor('settings')}}</span>
            <span class='editor-toolbar-button' @click='closeEditor'>{{String.doTranslationEditor('close')}}</span>
        </div>
    </div>
</template>

<script>
import {bus} from 'app.js'
import IScroll from 'iscroll'
import * as mutationTypes from 'editor/store/mutationTypes'
import NotificationLine from 'editor/components/editor-toolbar/notificationLine.vue'
import {messageBoxWrapper} from 'editor/services/defaults.js'
import {generateHash} from 'defaults'

export default {
    components: {
        NotificationLine
    },
    data() {
        return {
            undoDropdownId: this.generateHash('undo-toolbar',0),
            redoDropdownId: this.generateHash('redo-toolbar',0),
            dropdownUndoToolbar: null,
            dropdownRedoToolbar: null,
            scrollUndo: null,
            scrollRedo: null,
        }
    },
    computed: {
        undoActions() {
            let u = this.$store.state.editor.editorStatus.undoActions
            return [].concat(u).reverse() //keep reverse order from new to older ones
        },
        redoActions() {
            let u = this.$store.state.editor.editorStatus.redoActions
            return [].concat(u).reverse() //keep reverse order from new to older ones
        },
        shouldBeSavedBook() {
            return this.$store.state.editor.bookData.shouldBeSavedBook
        }
    },
    created() {
        bus.$on('automatic-hide', source => {
            if (!source.target.matches('.dropbtn')) {
                this.hideUndoActionsDropdown()
                this.hideRedoActionsDropdown()
            } else {
                let componentId = source.target.getAttribute('component-id')
                if(componentId && this.undoDropdownId != null) {
                    if(componentId != this.undoDropdownId) {
                        this.hideUndoActionsDropdown()
                    }
                }
                if(componentId && this.redoDropdownId != null) {
                    if(componentId != this.redoDropdownId) {
                        this.hideRedoActionsDropdown()
                    }
                }
            }
        })
    },
    mounted() {
        this.dropdownUndoToolbar = this.$refs.dropdownUndoToolbar
        this.dropdownRedoToolbar = this.$refs.dropdownRedoToolbar

        this.scrollUndo = new IScroll(this.$refs.dropdownUndoToolbar, {
            mouseWheel: true,
            bounce: false,
            interactiveScrollbars: true,
            shrinkScrollbars: 'clip',
            scrollbars: 'custom',
        })

        this.scrollRedo = new IScroll(this.$refs.dropdownRedoToolbar, {
            mouseWheel: true,
            bounce: false,
            interactiveScrollbars: true,
            shrinkScrollbars: 'clip',
            scrollbars: 'custom',
        })
    },
    methods: {
        generateHash,
        undoAction(event) {
            if(this.undoActions.length > 0) {
                let lastElement = this.undoActions.length-1
                this.$store.dispatch('editor/callUndoAction',lastElement)
            }
        },
        runUndo(index) {
            if(this.undoActions.length > 0 && index >= 0) {
                let lastElement = this.undoActions.length-1
                this.$store.dispatch('editor/callUndoAction',lastElement).then(() => {
                    setTimeout(this.runUndo(--index),0)
                })
            }
        },
        undoActionsDropdown(event) {
            if(event) event.stopPropagation()

            this.dropdownUndoToolbar.classList.toggle("show-block")
            this.hideRedoActionsDropdown()

            setTimeout(() => {
                this.scrollUndo.refresh()
            }, 200)
        },
        hideUndoActionsDropdown() {
            if (this.dropdownUndoToolbar.classList.contains('show-block')) {
                this.dropdownUndoToolbar.classList.remove('show-block');
            }
        },
        redoAction(event) {
            if(this.redoActions.length > 0) {
                let lastElement = this.redoActions.length-1
                this.$store.dispatch('editor/callRedoAction',lastElement)
            }
        },
        runRedo(index) {
            if(this.redoActions.length > 0 && index >= 0) {
                let lastElement = this.redoActions.length-1
                this.$store.dispatch('editor/callRedoAction',lastElement).then(() => {
                    setTimeout(this.runRedo(--index),0)
                })
            }
        },
        redoActionsDropdown(event) {
            if(event) event.stopPropagation()

            this.dropdownRedoToolbar.classList.toggle("show-block")
            this.hideUndoActionsDropdown()

            setTimeout(() => {
                this.scrollRedo.refresh()
            }, 200)
        },
        hideRedoActionsDropdown() {
            if (this.dropdownRedoToolbar.classList.contains('show-block')) {
                this.dropdownRedoToolbar.classList.remove('show-block');
            }
        },
        newPageSimple(event) {
            this.$router.push({ name: 'editor-new-page-default' })
        },
        editSettings(event) {
            this.$router.push({ name: 'editor-edit-settings' })
        },
        saveBook() {
            this.$store.dispatch('editor/saveBook','user')
        },
        saveAsBook() {

        },
        loadBook() {

        },
        closeEditor() {
            if(this.shouldBeSavedBook) {
                messageBoxWrapper.showChoiceMessage(this.$store.commit,String.doTranslationEditor('save-book-editor-exit'),
                    () => {
                        this.$store.dispatch('editor/saveBook').then(() => {
                            this.$router.push({ name: 'main-view' })
                        })
                    },null,
                    () => {
                        this.$router.push({ name: 'main-view' })
                    }
                )
            } else {
                this.$router.push({ name: 'main-view' })
            }
        }
    }

}

</script>

<style>
.editor-toolbar-root {
    min-height:2rem;
    width:100%;
    flex: 0 0 auto;
    display:flex;
    flex-direction:row;
}
.editor-toolbars-buttons {
    flex-grow:2;
}
.editor-toolbar-button {
    padding: 0.25rem 1rem 0.25rem 1rem;
    border-radius: 0.25rem;
    border: 1px solid black;
    font-weight:bold;
    font-size:130%;
    display: inline-block;
    line-height: 1.5rem;
    margin: 0.25rem 0.2rem 0.25rem 0.2rem;
    background-color: rgb(0, 78, 102);
    color:white;
    cursor:pointer;

    transition: background-color 0.2s, color 0.2s;
}
.editor-toolbar-button:hover {
    background-color: rgb(204, 243, 255);
    color:black;
}
.editor-toolbar-dropdown-content {
    font-size:100%;
    font-weight:normal;
}
.editor-toolbar-dropdown-content a{
    padding: 0.2rem 0.5rem 0.2rem 0.5rem;
    margin: 0;
}
</style>