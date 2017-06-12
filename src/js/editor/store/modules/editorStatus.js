import Vue from 'vue'
import * as mutationTypes from 'editor/store/mutationTypes'
import {editorNotification,editorNotificationWrapper} from 'editor/services/defaults.js'

export default {
    state: {
        miniPageListShown: true,
        miniPageMultiPages: false,
        elementsListShow: true,
        onlyErrorMiniPageList: false,
        editorShowPreview: true,
        editorSimplePreview: true,
        undoActions: [],
        redoActions: [],
    },
    mutations: {
        [mutationTypes.CHANGE_MINI_PAGE_LIST_STATUS](state, status) {
            if (status) {
                //console.log('STORE: mini page list is shown')
                editorNotification.newInternalInfo('Mini page list is shown',true)
            }
            else {
                //console.log('STORE: mini page list is hidden')
                editorNotification.newInternalInfo('Mini page list is hidden',true)
            }

            state.miniPageListShown = status
        },
        [mutationTypes.CHANGE_MINI_PAGE_SHOWN_METHOD](state, status) {
            if (status) {
                //console.log('STORE: mini page list is showing more compact mini pages')
                editorNotification.newInternalInfo('Mini page list is showing more compact mini pages',true)
            }
            else {
                //console.log('STORE: mini page list is showing complete mini pages')
                editorNotification.newInternalInfo('Mini page list is showing complete mini pages',true)
            }

            state.miniPageMultiPages = status
        },
        [mutationTypes.CHANGE_ELEMENTS_LIST_STATUS](state, status) {
            if (status) {
                //console.log('STORE: elements list is shown')
                editorNotification.newInternalInfo('Elements list is shown',true)
            }
            else {
                //console.log('STORE: elements list is hidden')
                editorNotification.newInternalInfo('Elements list is hidden',true)
            }

            state.elementsListShow = status
        },
        [mutationTypes.ONLY_ERROR_MINI_PAGE_SHOWN_METHOD](state, status) {
            if (status) {
                //console.log('STORE: elements list is shown')
                editorNotification.newInternalInfo('Only error pages in mini page list are shown',true)
            }
            else {
                //console.log('STORE: elements list is hidden')
                editorNotification.newInternalInfo('All pages in mini page list are shown',true)
            }

            state.onlyErrorMiniPageList = status
        },
        [mutationTypes.ADD_UNDO_ACTION](state, undoAction) {
            state.undoActions.push(undoAction)

            editorNotification.newInternalInfo('New undo action has been added',true)
        },
        [mutationTypes.REMOVE_UNDO_ACTION](state, index) {
            Vue.delete(state.undoActions,index)

            editorNotification.newInternalInfo('Undo action with id: '+index+' has been removed',true)
        },
        [mutationTypes.ADD_REDO_ACTION](state, redoAction) {
            state.redoActions.push(redoAction)

            editorNotification.newInternalInfo('New redo action has been added',true)
        },
        [mutationTypes.REMOVE_REDO_ACTION](state, index=null) {
            if(index != null) {
                Vue.delete(state.redoActions,index)

                editorNotification.newInternalInfo('Redo action with id: '+index+' has been removed',true)
            } else {
                //index is null -> delete all redo actions
                // for(let i=0;i<state.redoActions.length;i++) {
                //     Vue.delete(state.redoActions,i)
                // }
                state.redoActions = []

                editorNotification.newInternalInfo('All redo actions has been removed',true)
            }
            
        },
        [mutationTypes.CHANGE_EDITOR_SHOW_PREVIEW](state, status) {
            if (status) {
                editorNotification.newInternalInfo('Editor preview is shown',true)
            }
            else {
                editorNotification.newInternalInfo('Editor preview is hidden',true)
            }

            state.editorShowPreview = status
        },
        [mutationTypes.CHANGE_EDITOR_SIMPLE_PREVIEW](state, status) {
            if (status) {
                editorNotification.newInternalInfo('Editor simple preview is shown',true)
            }
            else {
                editorNotification.newInternalInfo('Editor complex preview is shown',true)
            }

            state.editorSimplePreview = status
        },
        [mutationTypes.MODULES_CLEAR](state) {
            Vue.set(state,'undoActions',[])
            Vue.set(state,'redoActions',[])
        },
    },
    actions: {
        undoRedoWrapper({ commit, dispatch, state }, args) {
            //args should be undoAction,redoAction,undo,redo
            if(args.undo) {
                commit(mutationTypes.ADD_UNDO_ACTION,args)
                commit(mutationTypes.REMOVE_REDO_ACTION,null)
            }
            if(args.runRedo) {
                args.redoAction(args.redoArgs)
            }
        },
        callUndoAction({ commit, dispatch, state },index) {
            let undoArgsBackup = JSON.parse(JSON.stringify(state.undoActions[index].undoArgs))

            state.undoActions[index].undoAction(undoArgsBackup)

            let backupRedo = state.undoActions[index]
            commit(mutationTypes.REMOVE_UNDO_ACTION,index)
            commit(mutationTypes.ADD_REDO_ACTION,backupRedo)
        },
        callRedoAction({ commit, dispatch, state },index) {
            let redoArgsBackup = JSON.parse(JSON.stringify(state.redoActions[index].redoArgs))

            state.redoActions[index].redoAction(redoArgsBackup)

            let backupUndo = state.redoActions[index]
            commit(mutationTypes.REMOVE_REDO_ACTION,index)
            commit(mutationTypes.ADD_UNDO_ACTION,backupUndo)
        }
    }
}