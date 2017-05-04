import Vue from 'vue'
import * as mutationTypes from 'editor/store/mutationTypes'
import {editorNotification,editorNotificationWrapper} from 'editor/services/defaults.js'

export default {
    state: {
        miniPageListShown: true,
        miniPageMultiPages: false,
        elementsListShow: true,
        onlyErrorMiniPageList: false,
        undoActions: [],
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
        }
    }
}