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

        <!-- Modal for book save or load -->
        <dyn-modal ref='saveLoadToolbarModal' body-specific='modal-body-form' footer-specific='modal-footer-form' content-specific='modal-content-form'>
            <span slot='modalHeader'>
                <template v-if='saveAs'>
                    {{String.doTranslationEditor('save-book-header')}}
                    <span v-if='loadedData != null' :class="[loadedData.length>=maxSaveLimit ? 'error-color': '', '']">({{loadedData.length}}/{{maxSaveLimit}})</span>
                </template>
                <template v-else>
                    {{String.doTranslationEditor('load-book-header')}}
                </template>
            </span>
            <span slot='modalBody'>
                <template v-if='loadedData === null'>
                    <div class='text-center' style='margin:2rem 0 2rem 0;'>
                        <i class="fa fa-spinner fa-spin fa-2x" aria-hidden="true"></i>
                    </div>
                </template>
                <template v-else>
                    <div class='text-center' ref='saveLoadWrapper' style='position:relative;'>
                        <div class='whisperer-scroller'>
                            <table class='editor-save-table-items'>
                                <tr><th>{{String.doTranslationEditor('save-name')}}</th><th>{{String.doTranslationEditor('save-time')}}</th><th>{{String.doTranslationEditor('action')}}</th></tr>
                                <tr v-for='(model,index) in loadedData' v-if="!(model.saveType === 'autosave' && saveAs)">
                                    <td>{{model.saveName}}</td>
                                    <td>{{model.saveTime}}</td>
                                    <td>
                                        <span class='editor-save-load-button' v-if='saveAs' @click='saveBookTab(model.saveId)'>{{String.doTranslationEditor('save')}}</span>
                                        <span class='editor-save-load-button' v-else @click='loadBookTab(model.saveId)'>{{String.doTranslationEditor('load')}}</span>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div v-if='saveAs && loadedData.length<maxSaveLimit'>
                        <label for="newSaveName" class="modalLabel bold">{{String.doTranslationEditor('new-save-name')}}<span class='required'>*</span>: </label>
                        <input class="modalInput" v-model="newSaveName" type="text" id="newSaveName" :placeholder="String.doTranslationEditor('type-new-save-name')">
                    </div>
                </template>
            </span>
            <span slot='modalFooter'>
                 <span v-if='saveAs' class='common-button' @click='saveBookNew'>{{String.doTranslationEditor('save')}}</span>
                <span class='common-button' @click='closeSaveLoadModal'>{{String.doTranslationEditor('close')}}</span>
            </span>
        </dyn-modal>

    </div>
</template>

<script>
import {bus} from 'app.js'
import IScroll from 'iscroll'
import DynModal from 'editor/components/dyn-components/dynModal.vue'
import * as mutationTypes from 'editor/store/mutationTypes'
import NotificationLine from 'editor/components/editor-toolbar/notificationLine.vue'
import {messageBoxWrapper} from 'editor/services/defaults.js'
import {generateHash} from 'defaults'
import {getBookSaves} from 'editor/api'

export default {
    components: {
        NotificationLine,
        DynModal,
    },
    data() {
        return {
            undoDropdownId: this.generateHash('undo-toolbar',0),
            redoDropdownId: this.generateHash('redo-toolbar',0),
            dropdownUndoToolbar: null,
            dropdownRedoToolbar: null,
            scrollUndo: null,
            scrollRedo: null,
            scrollSaveLoad: null,
            saveAs: true,
            saveLoadToolbarModal: null,
            loadedData: null,
            newSaveName: '',
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
        },
        mainInfo() {
            return this.$store.state.editor.bookData.mainInfo
        },
        bookId() {
            return this.mainInfo.id
        },
        maxSaveLimit() {
            return this.$store.state.editor.bookData.maxSaveLimit
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
        this.saveLoadToolbarModal = this.$refs.saveLoadToolbarModal

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
        undoAction() {
            if(this.undoActions.length > 0) {
                let lastElement = this.undoActions.length-1
                return this.$store.dispatch('editor/callUndoAction',lastElement)
            }
            return null
        },
        runUndo(index) {
            if(index >= 0) {
                let a = this.undoAction()
                if(a != null) {
                    a.then(() => {
                        setTimeout(this.runUndo(--index),0)
                    })
                }
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
        redoAction() {
            if(this.redoActions.length > 0) {
                let lastElement = this.redoActions.length-1
                this.$store.dispatch('editor/callRedoAction',lastElement)
            }
        },
        runRedo(index) {
            if(index >= 0) {
                let a = this.redoAction()
                if(a != null) {
                    a.then(() => {
                        setTimeout(this.runRedo(--index),0)
                    })
                }
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
            if(this.mainInfo.saveType === 'autosave') { //check if autosave load is not used
                this.saveAsBook() //autosave version have to saved manualy
            } else {
                this.$store.dispatch('editor/saveBook','user').catch((reason) => {
                    messageBoxWrapper.showErrorMessage(this.$store.commit,String.doTranslationEditor('book-no-saved',reason))
                })
            }
        },
        saveAsBook() {
            this.saveAs = true
            this.newSaveName = ''
            this.getSaveLoadModal()
        },
        closeSaveLoadModal() {
            this.saveLoadToolbarModal.close()
        },
        loadBook() {
            this.saveAs = false
            this.getSaveLoadModal()
        },
        getSaveLoadModal() {
            this.saveLoadToolbarModal.show()
            this.loadedData = null

            getBookSaves(this.bookId).then((bookSaves) => {
                this.loadedData = bookSaves
                this.$nextTick(() => {
                    this.updateLoadSaveScroller()
                })
            }).catch((reason) => {
                messageBoxWrapper.showErrorMessage(this.$store.commit,String.doTranslationEditor('error-get-book-saves',reason))
            })
        },
        updateLoadSaveScroller() {
            if(this.scrollSaveLoad === null) {
                this.scrollSaveLoad = new IScroll(this.$refs.saveLoadWrapper, {
                    mouseWheel: true,
                    bounce: false,
                    interactiveScrollbars: true,
                    shrinkScrollbars: 'clip',
                    scrollbars: 'custom',
                })
            } else {
                setTimeout(() => {
                    this.scrollSaveLoad.refresh()
                }, 200)
            }
        },
        saveBookTab(saveId) {
            let loadedDataId = this.checkValidSaveId(saveId)
            if(loadedDataId != null) {
                messageBoxWrapper.showChoiceMessage(this.$store.commit,String.doTranslationEditor('save-book-overwrite'),
                    () => {
                        this.doBookSave(this.loadedData[loadedDataId])
                    }
                )
            } else {
                messageBoxWrapper.showErrorMessage(this.$store.commit,String.doTranslationEditor('unknown-save-id'))
            }
        },
        saveBookNew() {
            if(this.newSaveName === '') {
                messageBoxWrapper.showErrorMessage(this.$store.commit,String.doTranslationEditor('save-name-required'))
                return
            }
            let i = this.checkValidSaveId(this.newSaveName,'saveName') //save with name already exists?

            if(i != null) this.saveBookTab(this.loadedData[i].saveId)
            else {
                let newSaveData = {
                    saveId: this.loadedData[this.loadedData.length-1].saveId + 1, //use last suitable id (saves have to be ordered!)
                    saveType: 'save',
                    saveName: this.newSaveName,
                }
                this.doBookSave(newSaveData)
            }
        },
        doBookSave(saveData) {
            this.saveLoadToolbarModal.close()

            let saveDataRem = { //remmember previous values to be able to rollback changes
                saveId: this.mainInfo.saveId,
                saveType: this.mainInfo.saveType,
                saveName: this.mainInfo.saveName,
            }
            this.$store.commit('editor/'+mutationTypes.UPDATE_SAVE_DATA,saveData)
            this.$store.dispatch('editor/saveBook','user').then(() => {
                messageBoxWrapper.showInformationMessage(this.$store.commit,String.doTranslationEditor('book-saved'))
            }).catch((reason) => {
                this.saveLoadToolbarModal.show()
                messageBoxWrapper.showErrorMessage(this.$store.commit,String.doTranslationEditor('book-no-saved',reason))
                this.$store.commit('editor/'+mutationTypes.UPDATE_SAVE_DATA,saveDataRem)
            })
        },
        loadBookTab(saveId) {
            let loadedDataId = this.checkValidSaveId(saveId)
            if(loadedDataId === null) {
                messageBoxWrapper.showErrorMessage(this.$store.commit,String.doTranslationEditor('unknown-load-id'))
                return
            }

            if(this.shouldBeSavedBook) {
                messageBoxWrapper.showChoiceMessage(this.$store.commit,String.doTranslationEditor('load-unsaved-progress'),
                    () => {
                        this.doLoad(this.loadedData[loadedDataId])
                    }
                )
            } else {
                this.doLoad(this.loadedData[loadedDataId])
            }
        },
        doLoad(saveData) {
            this.saveLoadToolbarModal.close()

            this.$store.dispatch('editor/clear').then(() => {
                return this.$store.dispatch('editor/load', { //load book
                    bookId: this.bookId,
                    saveId: saveData.saveId
                })
            }).then(() => {
                messageBoxWrapper.showInformationMessage(this.$store.commit,String.doTranslationEditor('load-book-loaded'))
            }).catch((reason) => {
                messageBoxWrapper.showErrorMessage(this.$store.commit,String.doTranslationEditor('load-book-no-load',reason))
            })
        },
        checkValidSaveId(value,param='saveId') {
            let valid = null
            for(let i = 0;i<this.loadedData.length;i++) {
                if(this.loadedData[i][param] === value) {
                    valid = i
                    break
                }
            }
            return valid
        },
        closeEditor() {
            if(this.shouldBeSavedBook) {
                messageBoxWrapper.showChoiceMessage(this.$store.commit,String.doTranslationEditor('save-book-editor-exit'),
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
.editor-save-table-items {
    border-collapse: collapse;
    margin: 0.2rem auto;
    width: 100%;
    font-size: 110%;
}
.editor-save-table-items tr {
    border-bottom: black 1px solid;
    text-align:center;
    height:1.5rem
}
.editor-save-table-items tr:first-child { 
    border-width:2px;
}
.editor-save-table-items tr:last-child { 
    border:none;
}
.editor-save-load-button {
    cursor:pointer;
    padding:0 1rem 0 1rem;
    border: solid black 1px;
    border-radius: 0.25rem;
}
.editor-save-load-button:hover {
    background-color:gray;
}
</style>